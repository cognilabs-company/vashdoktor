import { PageHero } from '../components/layout/PageHero';
import { DoctorsSection } from '../components/sections/DoctorsSection';
import { FinalCTA } from '../components/sections/FinalCTA';
import { DOCTORS } from '../lib/doctors';
import { useClinicUI } from '../lib/uiContext';

export function Doctors() {
  const { openConsultation } = useClinicUI();
  return (
    <>
      <PageHero
        eyebrow="Jamoa"
        title="Bizning shifokorlarimiz"
        subtitle="Har bir yo‘nalish bo‘yicha sertifikatlangan mutaxassislar. Tajriba, g‘amxo‘rlik va zamonaviy yondashuv — sizning sog‘lom tabassumingiz uchun."
      />
      <DoctorsSection
        doctors={DOCTORS}
        eyebrow="Mutaxassislar"
        title="Tanishing"
      />
      <FinalCTA onOpenConsultation={openConsultation} />
    </>
  );
}
