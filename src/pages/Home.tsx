import { Hero } from '../procedural/Hero';
import { ProceduralExperience } from '../procedural/ProceduralExperience';
import { ProcedureSequence } from '../components/procedure/ProcedureSequence';
import { Technology } from '../components/sections/Technology';
import { VideoText } from '../components/sections/VideoText';
import { FAQ } from '../components/sections/FAQ';
import { FinalCTA } from '../components/sections/FinalCTA';
import { ServicesSection } from '../components/sections/ServicesSection';
import { DoctorsSection } from '../components/sections/DoctorsSection';
import { featuredServices } from '../lib/services';
import { DOCTORS } from '../lib/doctors';
import { useClinicUI } from '../lib/uiContext';

export function Home() {
  const { openConsultation } = useClinicUI();

  return (
    <>
      <Hero onOpenConsultation={openConsultation} />

      {/* After the hero "dive-in", the 3D dental model emerges and animates on scroll */}
      <ProcedureSequence />

      <ServicesSection
        services={featuredServices()}
        title="Butun oila uchun to‘liq stomatologik yordam"
        subtitle="Profilaktikadan murakkab implantatsiyagacha — bir joyda, zamonaviy jihozlar va tajribali shifokorlar bilan."
        cta={{ label: 'Barcha xizmatlarni ko‘rish', to: '/services' }}
      />

      {/* Interactive exploded 3D implant model (WebGL) */}
      <ProceduralExperience onOpenConsultation={openConsultation} />

      <Technology />
      <VideoText />

      <DoctorsSection
        doctors={DOCTORS}
        title="Tajribali shifokorlar jamoasi"
        subtitle="Har bir yo‘nalish bo‘yicha mutaxassislar — sizga va oilangizga g‘amxo‘rlik qiladi."
        cta={{ label: 'Barcha doktorlar', to: '/doctors' }}
      />

      <FAQ />
      <FinalCTA onOpenConsultation={openConsultation} />
    </>
  );
}
