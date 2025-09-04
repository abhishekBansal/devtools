/**
 * Color conversion utilities for different color spaces
 */

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export interface HsvColor {
  h: number;
  s: number;
  v: number;
}

export interface CmykColor {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface ColorAnalysis {
  hex: string;
  rgb: RgbColor;
  hsl: HslColor;
  hsv: HsvColor;
  cmyk: CmykColor;
  luminance: number;
  contrast: {
    white: number;
    black: number;
  };
  accessibility: {
    aa: boolean;
    aaa: boolean;
  };
}

/**
 * Validates and normalizes a hex color string
 */
export function validateHexColor(hex: string): string {
  if (!hex || typeof hex !== 'string') {
    throw new Error('Hex color string is required');
  }

  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Validate format
  if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    throw new Error('Invalid hex color format. Use #RGB or #RRGGBB');
  }

  // Expand 3-digit hex to 6-digit
  if (cleanHex.length === 3) {
    return '#' + cleanHex.split('').map(char => char + char).join('').toUpperCase();
  }

  return '#' + cleanHex.toUpperCase();
}

/**
 * Validates RGB color values
 */
export function validateRgbColor(r: number, g: number, b: number): RgbColor {
  if (typeof r !== 'number' || typeof g !== 'number' || typeof b !== 'number') {
    throw new Error('RGB values must be numbers');
  }

  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    throw new Error('RGB values must be between 0 and 255');
  }

  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
}

/**
 * Converts hex color to RGB
 */
export function hexToRgb(hex: string): RgbColor {
  const validHex = validateHexColor(hex);
  const cleanHex = validHex.replace('#', '');
  
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  return { r, g, b };
}

/**
 * Converts RGB color to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const rgb = validateRgbColor(r, g, b);
  
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

/**
 * Converts RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): HslColor {
  const rgb = validateRgbColor(r, g, b);
  
  const rNorm = rgb.r / 255;
  const gNorm = rgb.g / 255;
  const bNorm = rgb.b / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Converts HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): RgbColor {
  if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) {
    throw new Error('HSL values out of range: H(0-360), S(0-100), L(0-100)');
  }
  
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  let r, g, b;
  
  if (sNorm === 0) {
    r = g = b = lNorm; // achromatic
  } else {
    const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
    const p = 2 * lNorm - q;
    r = hue2rgb(p, q, hNorm + 1/3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1/3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Converts RGB to HSV
 */
export function rgbToHsv(r: number, g: number, b: number): HsvColor {
  const rgb = validateRgbColor(r, g, b);
  
  const rNorm = rgb.r / 255;
  const gNorm = rgb.g / 255;
  const bNorm = rgb.b / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;
  
  let h = 0;
  const s = max === 0 ? 0 : delta / max;
  const v = max;
  
  if (delta !== 0) {
    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / delta) % 6;
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  
  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
}

/**
 * Converts RGB to CMYK
 */
export function rgbToCmyk(r: number, g: number, b: number): CmykColor {
  const rgb = validateRgbColor(r, g, b);
  
  const rNorm = rgb.r / 255;
  const gNorm = rgb.g / 255;
  const bNorm = rgb.b / 255;
  
  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  
  const c = (1 - rNorm - k) / (1 - k);
  const m = (1 - gNorm - k) / (1 - k);
  const y = (1 - bNorm - k) / (1 - k);
  
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}

/**
 * Converts CMYK to RGB
 */
export function cmykToRgb(c: number, m: number, y: number, k: number): RgbColor {
  if (c < 0 || c > 100 || m < 0 || m > 100 || y < 0 || y > 100 || k < 0 || k > 100) {
    throw new Error('CMYK values must be between 0 and 100');
  }
  
  const cNorm = c / 100;
  const mNorm = m / 100;
  const yNorm = y / 100;
  const kNorm = k / 100;
  
  const r = 255 * (1 - cNorm) * (1 - kNorm);
  const g = 255 * (1 - mNorm) * (1 - kNorm);
  const b = 255 * (1 - yNorm) * (1 - kNorm);
  
  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b)
  };
}

/**
 * Calculates relative luminance of a color
 */
export function calculateLuminance(r: number, g: number, b: number): number {
  const rgb = validateRgbColor(r, g, b);
  
  const toLinear = (value: number) => {
    const normalized = value / 255;
    return normalized <= 0.03928 
      ? normalized / 12.92 
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };
  
  return 0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b);
}

/**
 * Calculates contrast ratio between two colors
 */
export function calculateContrastRatio(luminance1: number, luminance2: number): number {
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Performs comprehensive color analysis
 */
export function analyzeColor(color: string | RgbColor): ColorAnalysis {
  let rgb: RgbColor;
  
  if (typeof color === 'string') {
    rgb = hexToRgb(color);
  } else {
    rgb = validateRgbColor(color.r, color.g, color.b);
  }
  
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  
  const luminance = calculateLuminance(rgb.r, rgb.g, rgb.b);
  const whiteLuminance = 1;
  const blackLuminance = 0;
  
  const contrastWhite = calculateContrastRatio(luminance, whiteLuminance);
  const contrastBlack = calculateContrastRatio(luminance, blackLuminance);
  
  return {
    hex,
    rgb,
    hsl,
    hsv,
    cmyk,
    luminance,
    contrast: {
      white: contrastWhite,
      black: contrastBlack
    },
    accessibility: {
      aa: Math.max(contrastWhite, contrastBlack) >= 4.5,
      aaa: Math.max(contrastWhite, contrastBlack) >= 7
    }
  };
}
