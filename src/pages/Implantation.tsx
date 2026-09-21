import { ScanLine, Syringe, Hourglass, Gem } from 'lucide-react';
import { ImplantHero } from '../components/implant/ImplantHero';
import { ProceduralExperience } from '../procedural/ProceduralExperience';
import { ImplantCompare } from '../components/implant/ImplantCompare';
import { ImplantIncluded } from '../components/implant/ImplantIncluded';
import { ImplantDoctor } from '../components/implant/ImplantDoctor';
import { ProcessSection, type ProcessStep } from '../components/sections/ProcessSection';
import { FAQ } from '../components/sections/FAQ';
import { FinalCTA } from '../components/sections/FinalCTA';
import { useClinicUI } from '../lib/uiContext';
import { FLOW } from '../lib/flow';

// the patient's implant journey, with how long each stop takes
const IMPLANT_STEPS: ProcessStep[] = [
  { icon: ScanLine, step: '01', title: 'Ko‘rik + 3D skan · 1 kun', text: 'Suyak hajmi o‘lchanadi, reja va narx tuziladi.' },
  { icon: Syringe, step: '02', title: 'O‘rnatish · ~1 soat', text: 'Titan ildiz suyakka qo‘yiladi. Anesteziya bilan, og‘riqsiz.' },
  { icon: Hourglass, step: '03', title: 'Bitish · 2–4 oy', text: 'Suyak implant bilan birikadi. Vaqtinchalik tish bilan yurasiz.' },
  { icon: Gem, step: '04', title: 'Keramik tish · 1 hafta', text: 'Crown o‘rnatiladi — o‘z tishingizdan farq qilmaydi.' },
];

/** Everything implant: the 3D teardown, why an implant, the journey with
 * timings, what the price covers, who places it, and the questions. */
export function Implantation() {
  const { openConsultation, open3DViewer } = useClinicUI();
  return (
    <>
      <ImplantHero onOpenConsultation={openConsultation} onOpen3DViewer={open3DViewer} />

      {/* Interactive exploded 3D implant model (WebGL) */}
      <ProceduralExperience onOpenConsultation={openConsultation} />

      <ImplantCompare />

      <ProcessSection flow={FLOW.blue} eyebrow="Jarayon" title="Boshidan oxirigacha" steps={IMPLANT_STEPS} />

      <ImplantIncluded />

      <ImplantDoctor />

      <FAQ
        code="IMPLANT"
        eyebrow="SAVOL-JAVOB"
        title={
          <>
            Implant haqida <br />
            <span className="font-medium text-[#8fc7d4]">ko‘p so‘raladigan savollar.</span>
          </>
        }
        subtitle="Og‘riq, muddat, suyak va xizmat muddati."
      />

      <FinalCTA onOpenConsultation={openConsultation} />
    </>
  );
}
