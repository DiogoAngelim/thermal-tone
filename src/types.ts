export type GradientStop = { temp: number; color: string };

// Types for the thermal-tone analysis API
export type ToneMessage = {
  text: string;
  temperature: number;
  intensity: number; // 0-1
  colorHex: string;
};

export type ToneResult = {
  averageTemperature: number;
  normalizedIntensity: number;
  colorHex: string;
  messageBreakdown: ToneMessage[];
  metadata: {
    scaleUsed: string;
    algorithmVersion: string;
  };
};

export type ToneOptions = {
  gradient?: GradientStop[];
  minTemp?: number;
  maxTemp?: number;
  smoothing?: boolean;
};
// Core types for Bidirectional Thermal Protocol (BTP)

export type ThermalResult = {
  temperature: number;
  hostilityScore: number;
  summary: string;
};

export type ThermalOptions = {
  aiEnabled?: boolean;
  deterministic?: boolean;
  abortController?: AbortController;
};

export type StabilizationOptions = ThermalOptions & {
  equilibriumTarget?: number; // default 36.8
  tolerance?: number; // default ±0.3°C
  maxIterations?: number; // default 3
  adaptiveStrength?: boolean;
  onIteration?: (iteration: ThermalIteration) => void;
  onStabilized?: (result: StabilizationResult) => void;
};

export type StabilizationResult = {
  initialTemperature: number;
  finalTemperature: number;
  stabilized: boolean;
  iterations: ThermalIteration[];
  equilibriumTarget: number;
};

export type ThermalIteration = {
  step: number;
  analysis: ThermalResult;
  generatedResponse?: string;
  resultingTemperature?: number;
};
