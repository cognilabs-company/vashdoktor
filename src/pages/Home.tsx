import { Hero } from '../procedural/Hero';
import { ProcedureSequence } from '../components/procedure/ProcedureSequence';
import { HomeServices } from '../components/home/HomeServices';
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
      <Hero onOpenConsultation={openConsultation} />

      <HomeServices />

      {/* After the hero "dive-in", the 3D jaw emerges: scan → plan → treat */}
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
