"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  ShieldCheck,
  Menu,
  X,
  FileCheck,
  Scale,
  Eye,
  Archive,
  BookOpen,
  ClipboardCheck,
  FileText,
  Play,
  Package,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MenuDropdown } from "./MenuDropdown";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function TspHeader() {
  const pathname = usePathname();
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);

  const PRODUCT_GROUP = {
    groups: [
      {
        heading: t("groupTspModules"),
        links: [
          { href: "/core", label: "Core", desc: t("moduleCoreDesc"), icon: Package, badge: "MIT" },
          { href: "/risk", label: "Risk", desc: t("moduleRiskDesc"), icon: Scale, badge: "Enterprise" },
          { href: "/oversight", label: "Oversight", desc: t("moduleOversightDesc"), icon: Eye },
          { href: "/evidence", label: "Evidence", desc: t("moduleEvidenceDesc"), icon: Archive },
        ],
      },
    ],
  };

  const COMPLIANCE_GROUP = {
    groups: [
      {
        heading: t("groupRegulatoryFrameworks"),
        links: [
          { href: "/eu-ai-act", label: "EU AI Act", desc: t("complianceEuAiActDesc"), icon: FileCheck, badge: "Annex III" },
          { href: "/iso-42001", label: "ISO 42001", desc: t("complianceIsoDesc"), icon: ClipboardCheck },
        ],
      },
    ],
  };

  const DEVELOPER_GROUP = {
    groups: [
      {
        heading: t("groupTechnicalResources"),
        links: [
          { href: "/spec", label: "Spec v3.0", desc: t("devSpecDesc"), icon: FileText },
          { href: "/docs", label: "API-docs", desc: t("devApiDocsDesc"), icon: BookOpen },
          { href: "/playground", label: "Playground", desc: t("devPlaygroundDesc"), icon: Play },
          { href: "/verify", label: "Verify-tool", desc: t("devVerifyDesc"), icon: ShieldCheck },
        ],
      },
    ],
  };

  const isProduct = pathname.startsWith("/core") || pathname.startsWith("/risk") || pathname.startsWith("/oversight") || pathname.startsWith("/evidence");
  const isCompliance = pathname.startsWith("/eu-ai-act") || pathname.startsWith("/iso-42001");
  const isDev = pathname.startsWith("/spec") || pathname.startsWith("/docs") || pathname.startsWith("/playground") || pathname.startsWith("/verify");

  return (
    <header className="border-b border-border bg-paper/85 backdrop-blur-md sticky top-0 z-40">
      <div className="tsp-container flex items-center justify-between h-14">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 no-underline"
        >
          <span
            className="tsp-live-dot"
            aria-label="Spec live (alpha)"
            role="img"
          />
          <span className="font-medium text-ink tracking-tight text-[1.05rem]">TSP</span>
          <span className="font-mono text-xs text-muted">Aug 2026-ready · MIT</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm">
          <MenuDropdown trigger={t("products")} active={isProduct} groups={PRODUCT_GROUP.groups} />
          <MenuDropdown trigger={t("compliance")} active={isCompliance} groups={COMPLIANCE_GROUP.groups} />
          <MenuDropdown trigger={t("developers")} active={isDev} groups={DEVELOPER_GROUP.groups} />
        </nav>

        <div className="hidden lg:flex items-center gap-1 text-sm">
          <Link
            href="/priser"
            className="px-3 py-1.5 text-muted hover:text-ink no-underline"
          >
            {t("pricing")}
          </Link>
          <Link
            href="/kontakt"
            className="px-3 py-1.5 text-muted hover:text-ink no-underline"
          >
            {t("contact")}
          </Link>
          <span className="ml-3 mr-2">
            <LocaleSwitcher />
          </span>
          <Link
            href="/spec"
            className="ml-1 tsp-btn-primary text-sm"
            style={{ paddingTop: "6px", paddingBottom: "6px" }}
          >
            {t("specCta")}
          </Link>
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label={t("menu")}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-paper max-h-[80vh] overflow-y-auto">
          <nav className="tsp-container py-4 flex flex-col gap-4">
            <MobileGroup title={t("products")} links={PRODUCT_GROUP.groups[0].links} onClick={() => setOpen(false)} pathname={pathname} />
            <MobileGroup title={t("compliance")} links={COMPLIANCE_GROUP.groups[0].links} onClick={() => setOpen(false)} pathname={pathname} />
            <MobileGroup title={t("developers")} links={DEVELOPER_GROUP.groups[0].links} onClick={() => setOpen(false)} pathname={pathname} />
            <div className="flex items-center justify-between border-t border-border pt-3">
              <LocaleSwitcher />
              <Link
                href="/spec"
                className="tsp-btn-primary"
                onClick={() => setOpen(false)}
              >
                {t("specCta")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function MobileGroup({
  title,
  links,
  pathname,
  onClick,
}: {
  title: string;
  links: Array<{ href: string; label: string; desc?: string }>;
  pathname: string;
  onClick: () => void;
}) {
  return (
    <div>
      <div className="tsp-eyebrow text-muted mb-1.5 px-1">{title}</div>
      <div className="flex flex-col gap-0.5">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={onClick}
            className={cn(
              "px-3 py-2 text-sm no-underline border-l-2",
              pathname === l.href
                ? "border-ink text-ink font-medium"
                : "border-transparent text-muted hover:text-ink",
            )}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
