export const pastelColors = [
  "#F9D5E5", "#C2E0C6", "#FFF2CC", "#E1D5F0", "#FFE4E1",
  "#D4F1F4", "#F0E68C", "#DDA0DD", "#F5DEB3", "#E0E6FF",
  "#FFE4CD", "#D1F2EB", "#FFEAA7", "#E6B3FF", "#F0F8E8",
  "#FFB6C1", "#B0E0E6", "#FFFFE0", "#E6E6FA", "#FFF8DC",
  "#F0FFF0", "#FFFACD", "#F5F5DC", "#E0FFFF", "#FAFAFA",
  "#F8F8FF", "#FFF5EE", "#F0FFFF", "#FFFAF0", "#FDF5E6",
  "#FAF0E6", "#FFEFD5", "#FFE4E1", "#F0F0F0", "#F5FFFA",
  "#F0F8E8", "#FFF0F5", "#E0F6FF", "#FFEFD5", "#F5F0FF"
];

export function getRandomPastelColor(): string {
  return pastelColors[Math.floor(Math.random() * pastelColors.length)];
}

export function getShuffledPastelColors(): string[] {
  return [...pastelColors].sort(() => Math.random() - 0.5);
}

export function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}
