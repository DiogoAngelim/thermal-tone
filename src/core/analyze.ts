import { computeIntensityForMessage } from '../analysis/intensity';
import { intensityToTemperature } from '../analysis/temperature';
import { DEFAULT_GRADIENT } from '../color/gradient';
import { interpolateColor } from '../color/interpolate';
import { mean } from '../util';
import type { ToneOptions, ToneResult, ToneMessage } from '../types';

export function analyzeThermalTone(messages: string[], options: ToneOptions = {}): ToneResult {
  const gradient = options.gradient ?? DEFAULT_GRADIENT;
  const minTemp = options.minTemp ?? 35;
  const maxTemp = options.maxTemp ?? 41;

  const breakdown: ToneMessage[] = messages.map(text => {
    const intensity = computeIntensityForMessage(text);
    const temperature = intensityToTemperature(intensity, minTemp, maxTemp);
    const colorHex = interpolateColor(gradient, temperature);
    return { text, intensity, temperature, colorHex };
  });

  const avgTemp = mean(breakdown.map(b => b.temperature));
  const avgIntensity = mean(breakdown.map(b => b.intensity));
  const colorHex = interpolateColor(gradient, avgTemp);

  const result: ToneResult = {
    averageTemperature: Number(avgTemp.toFixed(2)),
    normalizedIntensity: Number(avgIntensity.toFixed(3)),
    colorHex,
    messageBreakdown: breakdown,
    metadata: {
      scaleUsed: 'default-human-body-gradient',
      algorithmVersion: '1.0.0',
    },
  };
  return result;
}
