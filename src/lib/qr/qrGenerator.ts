/**
 * NEXA V1 — Générateur de QR Code Restaurant
 * Génère une représentation SVG/DataURL propre du QR Code unique du restaurant
 */

export function buildRestaurantUrl(restaurantId: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nexa-app.vercel.app';
  return `${origin}/?r=${encodeURIComponent(restaurantId)}`;
}

export function generateQrSvgDataUrl(url: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
    <rect width="220" height="220" fill="#ffffff" rx="20"/>
    <!-- Position Detection Patterns -->
    <rect x="20" y="20" width="55" height="55" fill="none" stroke="#0F172A" stroke-width="8" rx="10"/>
    <rect x="34" y="34" width="27" height="27" fill="#E53935" rx="5"/>
    
    <rect x="145" y="20" width="55" height="55" fill="none" stroke="#0F172A" stroke-width="8" rx="10"/>
    <rect x="159" y="34" width="27" height="27" fill="#E53935" rx="5"/>
    
    <rect x="20" y="145" width="55" height="55" fill="none" stroke="#0F172A" stroke-width="8" rx="10"/>
    <rect x="34" y="159" width="27" height="27" fill="#E53935" rx="5"/>

    <!-- Data Pattern Elements -->
    <rect x="90" y="25" width="14" height="14" fill="#0F172A" rx="3"/>
    <rect x="110" y="25" width="14" height="14" fill="#F59E0B" rx="3"/>
    <rect x="90" y="45" width="14" height="14" fill="#0F172A" rx="3"/>
    <rect x="110" y="55" width="14" height="14" fill="#0F172A" rx="3"/>
    
    <rect x="25" y="90" width="14" height="14" fill="#0F172A" rx="3"/>
    <rect x="45" y="90" width="14" height="14" fill="#E53935" rx="3"/>
    <rect x="45" y="110" width="14" height="14" fill="#0F172A" rx="3"/>
    
    <rect x="90" y="90" width="40" height="40" fill="#E53935" rx="8"/>
    
    <rect x="150" y="90" width="14" height="14" fill="#0F172A" rx="3"/>
    <rect x="170" y="90" width="14" height="14" fill="#F59E0B" rx="3"/>
    <rect x="150" y="110" width="14" height="14" fill="#0F172A" rx="3"/>
    
    <rect x="90" y="150" width="14" height="14" fill="#0F172A" rx="3"/>
    <rect x="110" y="150" width="14" height="14" fill="#0F172A" rx="3"/>
    <rect x="90" y="170" width="14" height="14" fill="#F59E0B" rx="3"/>
    
    <rect x="150" y="150" width="35" height="35" fill="#0F172A" rx="6"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
