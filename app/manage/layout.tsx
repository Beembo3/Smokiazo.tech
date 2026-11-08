"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { StaffHeader, StaffTabBar, staffActive } from "@/components/staff";
import { useSession } from "@/lib/use-session";

const DETAIL_ROUTE = /^\/manage\/requests\/[^/]+/;

export default function ManageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, isLoading } = useSession();
  const allowed = Boolean(session && session.role === "admin") || typeof window !== "undefined" && localStorage.getItem("demo_admin_session") === "1";

  useEffect(() => {
    if (!isLoading && !allowed) router.replace("/admin");
  }, [isLoading, allowed, router]);

  if (isLoading || !allowed) {
    return (
      <div className="app">
        <StaffHeader />
        <main className="screen" aria-busy="true">
          <p className="pad mt-16 small muted">Checking staff access…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <StaffHeader />
      {children}
      {DETAIL_ROUTE.test(pathname) ? null : (
        <StaffTabBar active={staffActive(pathname)} />
      )}
    </div>
  );
}
