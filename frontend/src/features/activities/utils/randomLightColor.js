export function randomLightColor() {
  const rgb = [
    Math.floor(Math.random() * 76 + 180),
    Math.floor(Math.random() * 76 + 180),
    Math.floor(Math.random() * 76 + 180),
  ];
  const randomIndex = Math.floor(Math.random() * 3);
  rgb[randomIndex] = 180;
  let randomIndex2 = Math.floor(Math.random() * 3);
  while (randomIndex2 === randomIndex) {
    randomIndex2 = Math.floor(Math.random() * 3);
  }
  rgb[randomIndex2] = 255;
  return `#${rgb[0].toString(16)}${rgb[1].toString(16)}${rgb[2].toString(16)}`;
}
