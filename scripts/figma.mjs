#!/usr/bin/env node
/**
 * Figma puller — dependency-free helper for wiring the design in.
 *
 *   npm run figma:pull
 *
 * Reads FIGMA_TOKEN + FIGMA_FILE_KEY (from .env.local or the environment),
 * then writes:
 *   .figma/file.json      raw Figma document
 *   .figma/tree.txt       page / frame / section outline
 *   .figma/tokens.json    colours, fonts, type scale, radii found in the file
 *   .figma/exports/*.png  every top-level frame rendered at 1x (2x for mobile)
 *
 * Requires a token with "File content: Read only" scope:
 *   Figma → Settings → Security → Personal access tokens
 */

import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, ".figma");
const FIGMA_API = "https://api.figma.com/v1";

async function loadEnv() {
  const candidates = [".env.local", ".env"];
  for (const file of candidates) {
    const full = path.join(ROOT, file);
    if (!existsSync(full)) continue;
    const text = await readFile(full, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!match) continue;
      const [, key, raw] = match;
      if (!process.env[key]) {
        process.env[key] = raw.replace(/^["']|["']$/g, "");
      }
    }
  }
}

function env(name) {
  const value = process.env[name];
  if (!value) {
    console.error(
      `Missing ${name}. Create .env.local with:\n\n` +
        `  FIGMA_TOKEN=figd_...\n` +
        `  FIGMA_FILE_KEY=08Mu3KwXJjvI6CkkgjDXyL\n`,
    );
    process.exit(1);
  }
  return value;
}

async function api(pathname) {
  const res = await fetch(`${FIGMA_API}${pathname}`, {
    headers: { "X-Figma-Token": env("FIGMA_TOKEN") },
  });
  if (!res.ok) {
    throw new Error(`Figma API ${res.status} for ${pathname}: ${await res.text()}`);
  }
  return res.json();
}

const rgbToHex = ({ r, g, b, a = 1 }) => {
  const to = (v) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}${a < 1 ? to(a) : ""}`.toLowerCase();
};

function colorOf(paint) {
  if (!paint || paint.visible === false) return null;
  if (paint.type === "SOLID" && paint.color) return rgbToHex(paint.color);
  if (paint.type?.startsWith("GRADIENT")) {
    const stops = (paint.gradientStops ?? []).map((s) => rgbToHex(s.color));
    return `linear-gradient(${stops.join(", ")})`;
  }
  return paint.type ?? null;
}

function* walk(node) {
  yield node;
  for (const child of node.children ?? []) yield* walk(child);
}

function outline(doc) {
  const lines = [];
  const visit = (node, depth) => {
    if (depth > 6) return;
    const box = node.absoluteBoundingBox;
    const size = box ? `${Math.round(box.width)}×${Math.round(box.height)}` : "";
    const label = node.type === "TEXT" ? ` "${String(node.characters).slice(0, 48)}"` : "";
    lines.push(
      `${"  ".repeat(depth)}${node.type} ${node.name}${size ? ` [${size}]` : ""}${label}`,
    );
    for (const child of node.children ?? []) visit(child, depth + 1);
  };
  visit(doc.document, 0);
  return lines.join("\n");
}

function tokens(doc) {
  const colors = new Map();
  const fonts = new Map();
  const sizes = new Map();
  const radii = new Map();
  const effects = new Map();

  const bump = (map, key) => key && map.set(key, (map.get(key) ?? 0) + 1);

  for (const node of walk(doc.document)) {
    for (const paint of node.fills ?? []) bump(colors, colorOf(paint));
    for (const paint of node.strokes ?? []) bump(colors, colorOf(paint));

    if (node.type === "TEXT" && node.style) {
      const { fontFamily, fontStyle, fontWeight, fontSize } = node.style;
      bump(fonts, `${fontFamily} · ${fontStyle ?? fontWeight ?? "Regular"}`);
      if (fontSize) bump(sizes, `${Math.round(fontSize)}px`);
    }

    if (typeof node.cornerRadius === "number") bump(radii, `${node.cornerRadius}px`);
    for (const radius of node.rectangleCornerRadii ?? []) bump(radii, `${radius}px`);

    for (const effect of node.effects ?? []) {
      bump(effects, `${effect.type}${effect.radius ? ` ${effect.radius}` : ""}`);
    }
  }

  const top = (map, n = 40) =>
    [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([value, count]) => ({
      value,
      count,
    }));

  return {
    colors: top(colors, 60),
    fonts: top(fonts, 20),
    fontSizes: top(sizes, 30),
    radii: top(radii, 15),
    effects: top(effects, 10),
  };
}

function topLevelFrames(doc) {
  const frames = [];
  for (const page of doc.document.children ?? []) {
    for (const child of page.children ?? []) {
      if (child.type === "FRAME" || child.type === "COMPONENT" || child.type === "SECTION") {
        const box = child.absoluteBoundingBox;
        frames.push({
          id: child.id,
          name: `${page.name} / ${child.name}`.replace(/\//g, " - "),
          width: box ? Math.round(box.width) : null,
          height: box ? Math.round(box.height) : null,
        });
      }
    }
  }
  return frames;
}

async function exportFrames(key, frames) {
  const dir = path.join(OUT, "exports");
  await mkdir(dir, { recursive: true });

  const saved = [];
  const chunkSize = 12;
  for (let i = 0; i < frames.length; i += chunkSize) {
    const chunk = frames.slice(i, i + chunkSize);
    const ids = chunk.map((f) => f.id).join(",");
    const { images } = await api(
      `/images/${key}?ids=${encodeURIComponent(ids)}&format=png&scale=1`,
    );

    for (const frame of chunk) {
      const url = images[frame.id];
      if (!url) continue;
      const res = await fetch(url);
      const buffer = Buffer.from(await res.arrayBuffer());
      const safe = frame.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const file = path.join(dir, `${safe || frame.id.replace(/[:;]/g, "-")}.png`);
      await writeFile(file, buffer);
      saved.push({ ...frame, file: path.relative(ROOT, file) });
    }
  }
  return saved;
}

async function main() {
  await loadEnv();
  const key = env("FIGMA_FILE_KEY");
  await mkdir(OUT, { recursive: true });

  console.log("→ fetching document …");
  const doc = await api(`/files/${key}?geometry=paths`);
  await writeFile(path.join(OUT, "file.json"), JSON.stringify(doc, null, 2));

  const tree = outline(doc);
  await writeFile(path.join(OUT, "tree.txt"), tree);

  const found = tokens(doc);
  await writeFile(path.join(OUT, "tokens.json"), JSON.stringify(found, null, 2));

  const frames = topLevelFrames(doc);
  console.log("→ exporting top-level frames …");
  const saved = await exportFrames(key, frames);
  await writeFile(path.join(OUT, "frames.json"), JSON.stringify(saved, null, 2));

  console.log(`\nDocument: ${doc.name} (last modified ${doc.lastModified})`);
  console.log(`Frames:   ${saved.length} exported to .figma/exports\n`);
  console.log(tree.split("\n").filter((l) => l.split("  ").length < 4).join("\n"));
  console.log("\nColours:", found.colors.slice(0, 8).map((c) => c.value).join(", "));
  console.log("Fonts:  ", found.fonts.slice(0, 5).map((f) => f.value).join(", "));
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
