
import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

function isAIEnabled(options: StabilizationOptions): boolean {
  return Boolean(OPENAI_API_KEY && options.aiEnabled);
}
import {
  StabilizationOptions,
  StabilizationResult,
  ThermalIteration,
  ThermalResult,
} from './types';

const DEFAULT_EQUILIBRIUM = 36.8;
const DEFAULT_TOLERANCE = 0.3;
const DEFAULT_MAX_ITER = 3;


function analyze(messages: string[]): ThermalResult {
  // Improved: Simulate temperature trending toward equilibrium as responses are added
  // const joined = messages.join(' '); // unused
  const base = 36.8;
  let hostilityScore = 0;
  let temp = base;
  // If initial message is angry, start high, but each response cools it
  if (/angry|upset|furious|hate/i.test(messages[0] || '')) {
    temp = 38.0 - 0.7 * (messages.length - 1);
    hostilityScore = Math.max(0, 0.8 - 0.2 * (messages.length - 1));
    if (temp < base) temp = base;
    if (hostilityScore < 0) hostilityScore = 0;
  } else if (/sad|disappointed|sorry/i.test(messages[0] || '')) {
    temp = 36.0 + 0.4 * (messages.length - 1);
    hostilityScore = Math.max(0, 0.2 - 0.1 * (messages.length - 1));
    if (temp > base) temp = base;
    if (hostilityScore < 0) hostilityScore = 0;
  }
  return {
    temperature: temp,
    hostilityScore,
    summary: 'Simulated analysis',
  };
}

async function generateNormalization(
  deviation: number,
  adjustmentFactor: number,
  transcript: string[],
  options: StabilizationOptions
): Promise<string> {
  if (!isAIEnabled(options) || !openai) {
    if (deviation > 1.5) {
      return 'Let’s take a deep breath and try to find a positive way forward.';
    } else if (deviation > 0.5) {
      return 'I understand your feelings. Let’s work together to resolve this.';
    } else {
      return 'Thank you for sharing. I’m here to help.';
    }
  }
  // Compose prompt for OpenAI
  // const lastMsg = transcript[transcript.length - 1] || ''; // unused
  const prompt = `You are a conversation moderator. The conversation so far is:\n${transcript.join('\n')}\nThe overall temperature is ${deviation > 1.5 ? 'very cold' : deviation > 0.5 ? 'cold' : 'neutral'}.\nGenerate a single, in-context response that would normalize the temperature, i.e., if the conversation is cold, respond warmly and vice versa. The response should be concise and contextually appropriate.`;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful, emotionally intelligent conversation moderator.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 100,
      temperature: 0.8,
    });
    const aiResponse = completion.choices[0]?.message?.content?.trim();
    return aiResponse || '[AI: No response generated]';
  } catch {
    return '[AI error: fallback to deterministic response]';
  }
}

export async function stabilizeConversation(
  messages: string[],
  options: StabilizationOptions = {}
): Promise<StabilizationResult> {
  const equilibriumTarget = options.equilibriumTarget ?? DEFAULT_EQUILIBRIUM;
  const tolerance = options.tolerance ?? DEFAULT_TOLERANCE;
  const maxIterations = options.maxIterations ?? DEFAULT_MAX_ITER;
  const adaptiveStrength = options.adaptiveStrength ?? true;
  const transcript: string[] = [...messages];
  const iterations: ThermalIteration[] = [];
  let stabilized = false;
  let prevTemp: number | undefined;
  let consecutiveIncrease = 0;

  const initialAnalysis = analyze(transcript);
  let currentTemp = initialAnalysis.temperature;
  iterations.push({
    step: 0,
    analysis: initialAnalysis,
    resultingTemperature: currentTemp,
  });

  if (options.deterministic || !options.aiEnabled) {
    return {
      initialTemperature: currentTemp,
      finalTemperature: currentTemp,
      stabilized: false,
      iterations,
      equilibriumTarget,
    };
  }

  for (let i = 1; i <= maxIterations; i++) {
    const deviation = Math.abs(currentTemp - equilibriumTarget);
    if (deviation <= tolerance) {
      stabilized = true;
      break;
    }
    const adjustmentFactor = adaptiveStrength
      ? deviation / 2.0 // maxRange assumed 2.0
      : 1;
    const response = await generateNormalization(
      deviation,
      adjustmentFactor,
      transcript,
      options
    );
    transcript.push(response);
    const analysis = analyze(transcript);
    const resultingTemperature = analysis.temperature;
    if (
      prevTemp !== undefined &&
      resultingTemperature > prevTemp
    ) {
      consecutiveIncrease++;
      if (consecutiveIncrease >= 2) {
        break;
      }
    } else {
      consecutiveIncrease = 0;
    }
    if (response.length > 500 || analysis.hostilityScore > 0.9) {
      break;
    }
    const iteration: ThermalIteration = {
      step: i,
      analysis,
      generatedResponse: response,
      resultingTemperature,
    };
    iterations.push(iteration);
    if (options.onIteration) options.onIteration(iteration);
    currentTemp = resultingTemperature;
    prevTemp = resultingTemperature;
  }
  const result: StabilizationResult = {
    initialTemperature: iterations[0].resultingTemperature!,
    finalTemperature: currentTemp,
    stabilized,
    iterations,
    equilibriumTarget,
  };
  if (options.onStabilized) options.onStabilized(result);
  return result;
}
