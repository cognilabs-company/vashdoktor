import { useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { SERVICES, SERVICE_CATEGORIES, type Service, type ServiceCategory } from '../../lib/services';
import { Eyebrow } from './Eyebrow';
import { FLOW } from '../../lib/flow';
import { categoryLabel } from './ServiceDialog';

export type CatalogFilter = ServiceCategory | 'all';

interface Props {
  filter: CatalogFilter;
  onFilter: (f: CatalogFilter) => void;
  onOpenService: (s: Service) => void;
}

/** The full list, laid out like a treatment menu: one hairline row per
 * service, text tabs with a sliding underline, and a row that morphs into
 * its detail sheet when clicked. */
export function ServiceCatalog({ filter, onFilter, onOpenService }: Props) {
  const tabs = useMemo(
    () => [
      { key: 'all' as CatalogFilter, label: 'Hammasi', count: SERVICES.length },
      ...SERVICE_CATEGORIES.map((c) => ({ key: c.key as CatalogFilter, label: c.label, count: SERVICES.filter((s) => s.category === c.key).length })),
    ],
    []
  );
  const visible = filter === 'all' ? SERVICES : SERVICES.filter((s) => s.category === filter);

  return (
    <section id="catalog" data-bg={FLOW.base} className="relative w-full py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12" data-reveal>
          <div className="lg:col-span-5">
            <Eyebrow>To‘liq ro‘yxat</Eyebrow>
            <h2 className="mt-5 font-serif text-[clamp(1.9rem,4vw,3.1rem)] font-medium leading-[1.06] tracking-tight text-white">
              Nimalarni qilamiz
            </h2>
          </div>

          {/* text tabs with a sliding underline */}
          <div className="flex flex-wrap gap-x-7 gap-y-2 self-end border-b border-white/10 lg:col-span-7">
            {tabs.map((t) => {
              const active = t.key === filter;
              return (
                <button
                  key={t.key}
                  onClick={() => onFilter(t.key)}
                  className={`relative pb-3 text-[14px] transition-colors ${active ? 'text-white' : 'text-[#7f9aa4] hover:text-[#c6dbe1]'}`}
                >
                  {t.label}
                  <sup className="ml-1 font-serif text-[11px] text-[#5c7580]">{t.count}</sup>
                  {active && (
                    <motion.span
                      layoutId="catalog-underline"
                      className="absolute inset-x-0 -bottom-px h-px bg-[#8fc7d4]"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <motion.ol layout className="mt-10 border-t border-white/10">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((s) => (
              <motion.li
                key={s.slug}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="border-b border-white/10"
              >
                <motion.button
                  layoutId={`service-${s.slug}`}
                  onClick={() => onOpenService(s)}
                  className="group grid w-full grid-cols-[2.5rem_minmax(0,1fr)_1.5rem] items-baseline gap-x-4 py-5 text-left transition-colors lg:grid-cols-[2.5rem_minmax(0,1.1fr)_minmax(0,1.6fr)_11rem_1.5rem]"
                >
                  <span className="font-serif text-[13px] text-[#5c7580]">{s.eyebrow}</span>
                  <motion.span layoutId={`service-title-${s.slug}`} className="font-serif text-[17px] font-medium leading-snug text-white transition-colors group-hover:text-[#8fc7d4] sm:text-[19px]">
                    {s.title}
                  </motion.span>
                  <span className="col-span-full col-start-2 mt-1 text-[13px] leading-snug text-[#8fb0ba] lg:col-span-1 lg:col-start-auto lg:mt-0 lg:text-[14px]">
                    {s.short}
                  </span>
                  <span className="hidden text-[12px] text-[#5c7580] lg:block">{categoryLabel(s.category)}</span>
                  <ArrowUpRight className="col-start-3 row-start-1 h-4 w-4 self-center text-[#5c7580] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#8fc7d4] lg:col-start-5" />
                </motion.button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ol>

        <p className="mt-6 text-[12px] text-[#5c7580]">* Narx — ko‘rikdan keyin, davolash rejasi bilan birga.</p>
      </div>
    </section>
  );
}
