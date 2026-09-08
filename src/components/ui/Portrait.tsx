import { UserRound } from 'lucide-react';

interface Props {
  photo?: string;
  name: string;
  className?: string;
  rounded?: string; // tailwind rounding class
}

/** Doctor portrait — real photo if `photo` is set, otherwise an intentional,
 * premium placeholder frame (never a random stock face). Swap in the real
 * professional photo via the data file's `photo` path. */
export function Portrait({ photo, name, className = '', rounded = 'rounded-2xl' }: Props) {
  if (photo) {
    return (
      <img src={photo} alt={name} loading="lazy" className={`${rounded} object-cover ${className}`} />
    );
  }
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${rounded} border border-white/10 bg-[radial-gradient(ellipse_at_50%_30%,#123443_0%,#0a141d_70%)] ${className}`}
    >
      <UserRound className="h-1/3 w-1/3 text-[#2f4a57]" strokeWidth={1} />
      <span className="absolute bottom-3 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#3f5c69]">
        Foto qo‘shiladi
      </span>
    </div>
  );
}
