export const pastelColors = [
  '#FFE4E1', // Misty Rose
  '#E6E6FA', // Lavender
  '#F0F8FF', // Alice Blue
  '#F5FFFA', // Mint Cream
  '#FFF8DC', // Cornsilk
  '#FFEFD5', // Papaya Whip
  '#FFE4CD', // Bisque
  '#E0FFFF', // Light Cyan
  '#F0FFFF', // Azure
  '#F5F5DC', // Beige
  '#FDF5E6', // Old Lace
  '#FAF0E6', // Linen
  '#FFF5EE', // Seashell
  '#F8F8FF', // Ghost White
  '#FFFACD', // Lemon Chiffon
  '#FAFAD2', // Light Goldenrod Yellow
  '#FFE4B5', // Moccasin
  '#FFDEAD', // Navajo White
  '#FFE4C4', // Bisque
  '#FFEBCD', // Blanched Almond
];

export function getShuffledPastelColors(): string[] {
  const shuffled = [...pastelColors];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}