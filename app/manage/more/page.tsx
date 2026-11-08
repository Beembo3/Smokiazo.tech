"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { IonIcon } from "@ionic/react";
import {
  businessOutline,
  chevronForwardOutline,
  peopleOutline,
  personCircleOutline,
} from "ionicons/icons";
import { Button, Hero, IconTile, SectionHead } from "@/components/ui";
import { useSession } from "@/lib/use-session";

const LINKS = [
  {
    href: "/manage/branch",
    icon: businessOutline,
    title: "Branch profile management",
    sub: "Published details and manager-only draft",
  },
  {
    href: "/manage/account",
    icon: personCircleOutline,
    title: "Staff account & access",
    sub: "Profile, permissions and notifications",
  },
  {
    href: "/manage/directory",
    icon: peopleOutline,
    title: "User directory",
    sub: "Registered customer accounts and roles",
  },
];

export default function StaffMorePage() {
  const router = useRouter();
  const { signOut } = useSession();

  const logout = async () => {
    await signOut();
    router.replace("/admin");
    router.refresh();
  };

  return (
    <main className="screen screen--tabbed">
      <Hero page eyebrow="Staff workspace · More" title="More" />

      <div className="section mt-12">
        <SectionHead label="Settings & directories" />
        <div className="card card--flush list-card">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="row">
              <span className="row__main admin-row">
                <IconTile icon={link.icon} />
                <span>
                  <span className="row__title" style={{ display: "block" }}>
                    {link.title}
                  </span>
                  <span className="row__sub" style={{ display: "block" }}>
                    {link.sub}
                  </span>
                </span>
              </span>
              <IonIcon
                icon={chevronForwardOutline}
                className="row__chevron"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>

        <p className="tiny mt-12">
          Staff access is restricted to authorized branch accounts. Roles are
          assigned by a trusted database administrator.
        </p>

        <div className="full-button mt-20">
          <Button variant="outline" onClick={() => void logout()}>
            Sign out
          </Button>
        </div>
      </div>
    </main>
  );
}
