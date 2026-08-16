// Centralized Image Configuration for HealthFlow
// Real high-quality healthcare, wellness, and doctor images with offline fallback SVG data URIs.

export const IMAGES = {
  // Landing & Hero
  heroHealthcare: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
  heroWellness: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
  doctorConsultation: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
  modernClinic: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
  activeLiving: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
  
  // Onboarding Visuals
  onboardingHabits: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80',
  onboardingVitals: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80',
  onboardingCare: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80',
  onboardingMindfulness: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',

  // Avatars
  avatars: {
    firdavs: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    drChen: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
    drElena: 'https://images.unsplash.com/photo-1594824813538-4e892c90a187?auto=format&fit=crop&w=300&q=80',
    drMarcus: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80',
    drSophia: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    preset1: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    preset2: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    preset3: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    preset4: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
  },

  // Clinics & Facilities
  clinics: {
    cityCentral: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    wellnessHub: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80',
    urgentCare: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
    cardioSpecialty: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=600&q=80',
    pharmacy24: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',
  },

  // Empty States (Clean stylized SVG illustrations)
  emptyStates: {
    habits: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' fill='none'%3E%3Ccircle cx='100' cy='100' r='80' fill='%23F0FDF4' stroke='%23BBF7D0' stroke-width='3' stroke-dasharray='6 6'/%3E%3Cpath d='M70 100L90 120L135 75' stroke='%2310B981' stroke-width='8' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='145' cy='65' r='10' fill='%2334D399'/%3E%3C/svg%3E",
    medications: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' fill='none'%3E%3Ccircle cx='100' cy='100' r='80' fill='%23F0F9FF' stroke='%23BAE6FD' stroke-width='3' stroke-dasharray='6 6'/%3E%3Crect x='70' y='75' width='60' height='50' rx='10' fill='%230EA5E9'/%3E%3Cpath d='M100 60V75M85 100H115M100 85V115' stroke='white' stroke-width='6' stroke-linecap='round'/%3E%3C/svg%3E",
    appointments: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' fill='none'%3E%3Ccircle cx='100' cy='100' r='80' fill='%23FDF4FF' stroke='%23F5D0FE' stroke-width='3' stroke-dasharray='6 6'/%3E%3Crect x='65' y='65' width='70' height='70' rx='12' fill='%23A855F7'/%3E%3Ccircle cx='85' cy='95' r='5' fill='white'/%3E%3Ccircle cx='115' cy='95' r='5' fill='white'/%3E%3Cpath d='M80 115Q100 125 120 115' stroke='white' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E",
    insights: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' fill='none'%3E%3Ccircle cx='100' cy='100' r='80' fill='%23FFFBEB' stroke='%23FDE68A' stroke-width='3' stroke-dasharray='6 6'/%3E%3Cpath d='M65 130L90 100L115 115L140 70' stroke='%23F59E0B' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='140' cy='70' r='6' fill='%23D97706'/%3E%3C/svg%3E",
    emergency: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' fill='none'%3E%3Ccircle cx='100' cy='100' r='80' fill='%23FEF2F2' stroke='%23FECACA' stroke-width='3' stroke-dasharray='6 6'/%3E%3Cpath d='M100 65V115M100 135H100.02' stroke='%23EF4444' stroke-width='8' stroke-linecap='round'/%3E%3C/svg%3E",
  },

  // Fallback for avatar & generic images
  fallbackAvatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%230d9488'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23E0F2F1'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%230D9488'/%3E%3Cpath d='M20 85C20 68 33 60 50 60C67 60 80 68 80 85' fill='%230D9488'/%3E%3C/svg%3E",
  fallbackHealthcare: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%230f766e'%3E%3Crect width='400' height='300' fill='%23F0FDFA'/%3E%3Cpath d='M180 150H220M200 130V170' stroke='%230D9488' stroke-width='16' stroke-linecap='round'/%3E%3C/svg%3E"
};
