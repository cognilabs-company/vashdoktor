export interface StoryScene {
  id: string;
  stepNumber: string;
  title: string;
  subtitle?: string;
  description: string;
  badge: string;
  specs?: { label: string; value: string; desc?: string }[];
  highlightPart?: 'all' | 'exploded' | 'titanium' | 'bone-insertion' | 'abutment' | 'crown';
}

export interface ClinicConfig {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  emergency: string;
  socials: {
    instagram: string;
    telegram: string;
    linkedin: string;
  };
  map?: { lat: number; lng: number; directions: string };
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  duration: string;
  details: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface ConsultationFormData {
  fullName: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  treatmentInterest: string;
  message?: string;
}
