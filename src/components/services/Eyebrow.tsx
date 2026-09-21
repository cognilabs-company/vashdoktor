/** Quiet section label — a short rule and a few words, no pill. */
export function Eyebrow({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-3 text-[13px] text-[#8fc7d4]">
      <span className="h-px w-7 bg-[#8fc7d4]/60" />
      {children}
    </span>
  );
}
