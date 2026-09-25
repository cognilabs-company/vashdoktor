/** Quiet section label — a short rule and a few words, no pill. */
export function Eyebrow({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-3 text-[13px] text-[var(--c-accent)]">
      <span className="h-px w-7 bg-[var(--c-accent)]/60" />
      {children}
    </span>
  );
}
