import { HeroFlight } from '../components/home/HeroFlight';
import { ImplantReveal } from '../components/home/ImplantReveal';
import { ProcedureSequence } from '../components/procedure/ProcedureSequence';
import { ImplantTeaser } from '../components/home/ImplantTeaser';
import { Testimonials } from '../components/home/Testimonials';
import { ContactMap } from '../components/home/ContactMap';
import { FirstVisit } from '../components/home/FirstVisit';
import { FounderSection } from '../components/sections/FounderSection';
import { DoctorsSection } from '../components/sections/DoctorsSection';
import { FAQ } from '../components/sections/FAQ';
import { GENERAL_FAQ } from '../lib/clinicConfig';
import { DOCTORS } from '../lib/doctors';
import { useClinicUI } from '../lib/uiContext';
import { FLOW } from '../lib/flow';

/**
 * Home = the whole clinic, in the order a first-time visitor needs it:
 * what we do → how every treatment goes (3D) → implants as one door → what a
 * first visit is like → what patients say → who treats you → questions →
 * where we are. The deep implant story lives on /implantatsiya.
 */
export function Home() {
  const { openConsultation, open3DViewer } = useClinicUI();

  return (
    <>
      {/* scroll flies the camera through the fjord, stopping at each of the
          four service directions, and ends inside the fog */}
      <HeroFlight onOpenConsultation={openConsultation} />

      {/* out of that fog: the implant takes itself apart, then back together */}
      <ImplantReveal onOpen3DViewer={open3DViewer} onOpenConsultation={openConsultation} />

      {/* 3D jaw: scan → plan → treat */}
      <ProcedureSequence />

      <ImplantTeaser onOpen3DViewer={open3DViewer} />

      <FirstVisit onOpenConsultation={openConsultation} />

      <Testimonials />

      {/* Founder — the trust anchor (author clinic), before the team grid */}
      <FounderSection compact flow={FLOW.green} />

      <DoctorsSection
        doctors={DOCTORS}
        title="Jamoa"
        cta={{ label: 'Butun jamoa', to: '/doctors' }}
        compact
      />

      <FAQ
        items={GENERAL_FAQ.slice(0, 5)}
        code="SAVOL-JAVOB"
        eyebrow="KELISHDAN OLDIN"
        title={
          <>
            Odatda so‘raladigan <br />
            <span className="font-medium text-[#8fc7d4]">savollar.</span>
          </>
        }
        subtitle="Og‘riq, narx, bolalar, kafolat."
      />

      <ContactMap onOpenConsultation={openConsultation} />
    </>
  );
}
