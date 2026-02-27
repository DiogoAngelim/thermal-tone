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
