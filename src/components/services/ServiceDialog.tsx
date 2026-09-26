import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';
import { SERVICES, SERVICE_CATEGORIES, type Service } from '../../lib/services';

export const categoryLabel = (key: Service['category']) => SERVICE_CATEGORIES.find((c) => c.key === key)?.label ?? key;

interface Props {
  service: Service | null;
  morph?: boolean; // share layout with the catalogue row that opened it
  onClose: () => void;
  onOpenConsultation: () => void;
  onPick: (s: Service) => void; // jump to a related service
}

/** Service detail sheet. Morphs out of the row that opened it (shared
 * `layoutId`) and reads like a page from a treatment guide. */
export function ServiceDialog({ service: s, morph = true, onClose, onOpenConsultation, onPick }: Props) {
  useEffect(() => {
    if (!s) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [s, onClose]);

  return (
    <AnimatePresence>
      {s && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-[70] flex items-end justify-center bg-[#050b11]/85 p-3 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            layoutId={morph ? `service-${s.slug}` : undefined}
            initial={morph ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
            animate={morph ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={morph ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 240, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0d1b26]"
          >
            <button
              onClick={onClose}
              aria-label="Yopish"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-[var(--c-text-2)] transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="max-h-[86vh] overflow-y-auto px-6 pb-6 pt-7 sm:px-9 sm:pb-8 sm:pt-9">
              <div className="flex items-baseline gap-3 text-[12px] text-[var(--c-text-4)]">
                <span className="font-serif text-[var(--c-accent)]">{s.eyebrow}</span>
                <span>·</span>
                <span>{categoryLabel(s.category)}</span>
              </div>
              <motion.h3 layoutId={morph ? `service-title-${s.slug}` : undefined} className="mt-3 font-serif text-2xl font-medium leading-tight tracking-tight text-white sm:text-[2rem]">
                {s.title}
              </motion.h3>
              <motion.p
                className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--c-text)]"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.12 } }}
              >
                {s.body}
              </motion.p>

              <motion.dl
                className="mt-6 border-t border-white/10"
                initial="hidden"
                animate="show"
                transition={{ staggerChildren: 0.05, delayChildren: 0.18 }}
              >
                {s.points.map((p, i) => (
                  <motion.div
                    key={p}
                    variants={{ hidden: { opacity: 0, x: -6 }, show: { opacity: 1, x: 0 } }}
                    className="flex items-baseline gap-4 border-b border-white/10 py-3 text-[14px]"
                  >
                    <dt className="w-6 shrink-0 font-serif text-[12px] text-[var(--c-text-5)]">{i + 1}</dt>
                    <dd className="text-[var(--c-mist-2)]">{p}</dd>
                  </motion.div>
                ))}
              </motion.dl>

              <motion.div
                className="mt-6 flex flex-wrap items-center justify-between gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.28 } }}
              >
                <p className="text-[13px] text-[var(--c-text-4)]">Narx va muddat — ko‘rikdan keyin.</p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenConsultation();
                  }}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[var(--c-bg)] transition-colors hover:bg-[var(--c-mist)]"
                >
                  Ko‘rikka yozilish
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>

              {(() => {
                const related = SERVICES.filter((x) => x.category === s.category && x.slug !== s.slug);
                if (!related.length) return null;
                return (
                  <motion.div className="mt-7 text-[13px]" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.34 } }}>
                    <span className="text-[var(--c-text-4)]">Shu yo‘nalishda yana: </span>
                    {related.map((r, i) => (
                      <span key={r.slug}>
                        <button onClick={() => onPick(r)} className="text-[var(--c-accent-2)] underline decoration-[var(--c-accent)]/40 underline-offset-4 hover:decoration-[var(--c-accent)]">
                          {r.title}
                        </button>
                        {i < related.length - 1 ? ', ' : '.'}
                      </span>
                    ))}
                  </motion.div>
                );
              })()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
