import { GradientStop } from '../types';
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from '../util';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function interpolateColor(gradient: GradientStop[], temp: number) {
  const stops = [...gradient].sort((a, b) => a.temp - b.temp);
  if (temp <= stops[0].temp) return stops[0].color.toUpperCase();
  if (temp >= stops[stops.length - 1].temp) return stops[stops.length - 1].color.toUpperCase();
  let left = stops[0];
  let right = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (temp >= stops[i].temp && temp <= stops[i + 1].temp) {
      left = stops[i];
      right = stops[i + 1];
      break;
    }
  }
  const t = (temp - left.temp) / (right.temp - left.temp);
  // interpolate in HSL
  const lr = hexToRgb(left.color);
  const rr = hexToRgb(right.color);
  const lh = rgbToHsl(lr.r, lr.g, lr.b);
  const rh = rgbToHsl(rr.r, rr.g, rr.b);
  const ih = {
    h: lerp(lh.h, rh.h, t),
    s: lerp(lh.s, rh.s, t),
    l: lerp(lh.l, rh.l, t),
  };
  const rgb = hslToRgb(ih.h, ih.s, ih.l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}
