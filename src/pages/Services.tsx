import { PageHero } from '../components/layout/PageHero';
import { ServicesSection } from '../components/sections/ServicesSection';
import { FinalCTA } from '../components/sections/FinalCTA';
import { SERVICES } from '../lib/services';
import { useClinicUI } from '../lib/uiContext';

export function Services() {
  const { openConsultation } = useClinicUI();
  return (
    <>
      <PageHero
        eyebrow="Xizmatlar"
        title="Barcha stomatologik xizmatlar"
        subtitle="Profilaktika, davolash, estetika, ortodontiya va jarrohlik — tishga oid barcha proseduralar bitta klinikada, zamonaviy standartlar asosida."
      />
      <ServicesSection
        services={SERVICES}
        eyebrow="To‘liq ro‘yxat"
        title="Nimalarni taklif qilamiz"
        detailed
      />
      <FinalCTA onOpenConsultation={openConsultation} />
    </>
  );
}
