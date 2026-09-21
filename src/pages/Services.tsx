import { useCallback, useState } from 'react';
import { ServicesHero } from '../components/services/ServicesHero';
import { ServiceChapters } from '../components/services/ServiceChapters';
import { ServiceCatalog, type CatalogFilter } from '../components/services/ServiceCatalog';
import { ServiceDialog } from '../components/services/ServiceDialog';
import { Principles } from '../components/services/Principles';
import { ProcessSection } from '../components/sections/ProcessSection';
import { FinalCTA } from '../components/sections/FinalCTA';
import type { Service } from '../lib/services';
import { useClinicUI } from '../lib/uiContext';
import { FLOW } from '../lib/flow';

export function Services() {
  const { openConsultation } = useClinicUI();
  // shared between the chapter cards ("to‘liq ro‘yxat") and the catalogue tabs
  const [filter, setFilter] = useState<CatalogFilter>('all');
  // the open detail sheet; it morphs out of a catalogue row, but just fades
  // in when opened from a chapter (those rows carry no shared layout)
  const [open, setOpen] = useState<{ service: Service; morph: boolean } | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <ServicesHero onOpenConsultation={openConsultation} />
      <ServiceChapters onPickCategory={setFilter} onOpenService={(s) => setOpen({ service: s, morph: false })} />
      <ServiceCatalog filter={filter} onFilter={setFilter} onOpenService={(s) => setOpen({ service: s, morph: true })} />
      <Principles />
      <ProcessSection flow={FLOW.blue} />
      <FinalCTA onOpenConsultation={openConsultation} />

      <ServiceDialog
        service={open?.service ?? null}
        morph={open?.morph ?? true}
        onClose={close}
        onOpenConsultation={openConsultation}
        onPick={(s) => setOpen({ service: s, morph: false })}
      />
    </>
  );
}
