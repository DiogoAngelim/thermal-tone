export function intensityToTemperature(intensity: number, minTemp = 35, maxTemp = 41) {
  // clamp
  const t = Math.max(0, Math.min(1, intensity));
  return minTemp + t * (maxTemp - minTemp);
}
