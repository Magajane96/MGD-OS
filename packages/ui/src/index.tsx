import type { CSSProperties, ReactNode } from "react";
import { mgdTheme, type MGDTone } from "@mgd/design-system";

const toneStyles: Record<MGDTone, string> = {
  neutral: "border-white/10 bg-white/[0.04] text-white/65",
  success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  warning: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  danger: "border-rose-400/20 bg-rose-400/10 text-rose-300",
  info: "border-blue-400/20 bg-blue-400/10 text-blue-300",
  primary: "border-[#6D5DFC]/30 bg-[#6D5DFC]/15 text-violet-200",
};

const toneText: Record<MGDTone, string> = {
  neutral: "text-white/65",
  success: "text-emerald-300",
  warning: "text-amber-300",
  danger: "text-rose-300",
  info: "text-blue-300",
  primary: "text-violet-200",
};

export function MGDAppShell({ children }: { children: ReactNode }) {
  const nav = [
    "Command Center",
    "Commerce Center",
    "Finance Center",
    "Customer Center",
    "Marketing Center",
    "Analytics Center",
    "Operations Center",
    "Intelligence Center",
    "Administration Center",
  ];

  return (
    <main
      className="min-h-screen overflow-hidden bg-[#050816] text-white selection:bg-[#6D5DFC]/40"
      style={{ fontFamily: mgdTheme.typography.fontFamily }}
    >
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(109,93,252,.24),transparent_28%),radial-gradient(circle_at_88%_14%,rgba(0,210,106,.12),transparent_24%),linear-gradient(135deg,rgba(47,128,255,.10),transparent_42%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />

      <div className="relative flex min-h-screen">
        <aside className="hidden w-80 shrink-0 border-r border-white/10 bg-[#070B18]/88 p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl xl:block">
          <div className="mb-7 rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/30">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#6D5DFC]">
              MGD OS
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              Enterprise Control
            </h2>
            <p className="mt-2 text-xs text-white/40">
              Project TITAN / Sprint 004A
            </p>
          </div>

          <nav className="space-y-2">
            {nav.map((item, index) => (
              <button
                key={item}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition duration-300 ${
                  index === 0
                    ? "border border-[#6D5DFC]/35 bg-[#6D5DFC]/18 text-white shadow-lg shadow-[#6D5DFC]/10"
                    : "text-white/48 hover:bg-white/[0.055] hover:text-white"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    index === 0 ? "bg-emerald-300" : "bg-white/20"
                  }`}
                />
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-[26px] border border-emerald-400/15 bg-emerald-400/10 p-4 shadow-lg shadow-emerald-950/10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Company Status
            </p>
            <p className="mt-2 text-sm text-white/65">
              All centers online. Business Health stable at 92/100.
            </p>
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-4 py-5 sm:px-5 lg:px-10 lg:py-8">
          <div className="mb-5 flex items-center justify-between rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl xl:hidden">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6D5DFC]">
                MGD OS
              </p>
              <p className="mt-1 text-sm font-semibold">Command Center</p>
            </div>
            <MGDBadge tone="success">92/100</MGDBadge>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}

export function MGDTopBar() {
  return (
    <header className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#6D5DFC]">
          Digital Mission Control
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <MGDBadge tone="success">Company online</MGDBadge>
          <MGDBadge tone="info">Live signals</MGDBadge>
          <MGDBadge tone="primary">Business Health 92</MGDBadge>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-white/10 bg-[#050816]/45 px-4 text-sm text-white/40 shadow-inner shadow-black/20 lg:w-80">
          <span className="text-white/35">Search</span>
          <input
            className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/30"
            placeholder="Global search"
            type="search"
          />
        </label>

        <div className="flex items-center gap-3">
          <button className="relative h-12 w-12 rounded-2xl border border-white/10 bg-white/[0.045] text-sm font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/[0.07]">
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-amber-300" />
            N
          </button>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-300">
              Operational
            </p>
            <p className="mt-1 text-sm font-semibold text-white">Stable</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#6D5DFC] to-[#2F80FF] text-sm font-bold shadow-lg shadow-[#6D5DFC]/20">
            M
          </div>
        </div>
      </div>
    </header>
  );
}

export function MGDWidget({
  title,
  eyebrow,
  status = "Live",
  tone = "neutral",
  children,
  footer,
  className = "",
}: {
  title: string;
  eyebrow?: string;
  status?: string;
  tone?: MGDTone;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0E1424]/80 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-[#131C30]/90 ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#6D5DFC]/10 blur-3xl transition duration-300 group-hover:bg-[#6D5DFC]/20" />

      <div className="relative mb-5 flex items-start justify-between gap-4">
        <div>
          {eyebrow ? (
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.24em] text-white/35">
              {eyebrow}
            </p>
          ) : null}

          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/55">
            {title}
          </h2>
        </div>

        <MGDBadge tone={tone}>{status}</MGDBadge>
      </div>

      <div className="relative">{children}</div>

      {footer ? (
        <div className="relative mt-5 border-t border-white/10 pt-4 text-xs text-white/40">
          {footer}
        </div>
      ) : null}
    </section>
  );
}

export function MGDBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: MGDTone;
}) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${toneStyles[tone]}`}
    >
      {children}
    </span>
  );
}

export function MGDButton({
  children,
  variant = "primary",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  if (variant === "secondary") {
    return (
      <button className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/72 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white">
        {children}
      </button>
    );
  }

  return (
    <button className="rounded-2xl bg-[#6D5DFC] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#6D5DFC]/25 transition hover:-translate-y-0.5 hover:bg-[#7B6DFF]">
      {children}
    </button>
  );
}

export function MetricLine({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  tone?: MGDTone;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <span className="text-sm text-white/55">{label}</span>
      <span className={`text-sm font-semibold ${toneText[tone]}`}>{value}</span>
    </div>
  );
}

export function Sparkline({
  values = [25, 42, 35, 58, 52, 72, 88],
}: {
  values?: number[];
}) {
  const max = Math.max(...values);

  return (
    <div className="flex h-14 items-end gap-1.5">
      {values.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className="w-full rounded-full bg-gradient-to-t from-[#6D5DFC] to-emerald-300/80 opacity-80"
          style={{ height: `${Math.max(16, (value / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

export function TokenSwatch({
  name,
  value,
  description,
}: {
  name: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div
        className="mb-4 h-14 rounded-2xl border border-white/10"
        style={{ background: value } as CSSProperties}
      />
      <p className="font-semibold text-white">{name}</p>
      <p className="mt-1 font-mono text-xs text-white/40">{value}</p>
      <p className="mt-3 text-sm leading-6 text-white/50">{description}</p>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6D5DFC]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-.035em] text-white lg:text-3xl">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-white/50">
        {description}
      </p>
    </div>
  );
}
