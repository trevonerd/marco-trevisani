const DEFAULT_DECAY_MS = 280;
const DEFAULT_HOLD_RELEASE_MS = 650;
const DEFAULT_INTENSITY = 1;
const DEFAULT_SLOW_HOLD_RELEASE_MS = 1400;
const DEFAULT_TIMELINE_SECONDS = 300;
const MAX_AUDIO_ENERGY = 1.35;
const MAX_PRE_GLOW_RATIO = 0.72;
const POSITION_PARTS = 3;

type PulseDuration = number | string;

export type PulseGridScore = {
  name: string;
  version: number;
  bpm: number;
  meter: readonly number[];
  downbeatAt: number;
  output: string;
  grid: string;
  defaults?: {
    decayMs?: number;
    intensity?: number;
  };
  patterns?: readonly PulsePattern[];
  events?: readonly PulseEvent[];
};

type PulsePattern = {
  id?: string;
  from: string;
  until?: string;
  every?: PulseDuration;
  meter?: readonly number[];
  type: string;
  intensity?: number;
  decayMs?: number;
  preGlow?: PulseDuration;
  preGlowMs?: number;
  preStartIntensity?: number;
  preIntensity?: number;
};

type PulseEvent = {
  at?: string;
  duration?: PulseDuration;
  durationMs?: number;
  from?: string;
  until?: string;
  slow?: boolean;
  type: string;
  intensity?: number;
  decayMs?: number;
  preGlow?: PulseDuration;
  preGlowMs?: number;
  preStartIntensity?: number;
  preIntensity?: number;
};

type PulseHitConfig = {
  decayMs?: number;
  duration?: PulseDuration;
  durationMs?: number;
  intensity?: number;
  preGlow?: PulseDuration;
  preGlowMs?: number;
  preStartIntensity?: number;
  preIntensity?: number;
  slow?: boolean;
  type: string;
};

export type PulseHit = {
  decayMs: number;
  holdMs: number;
  intensity: number;
  preGlowMs: number;
  preStartIntensity: number;
  preIntensity: number;
  source: string;
  timeSeconds: number;
};

export type PulsePause = {
  fromSeconds: number;
  untilSeconds: number;
};

export type PulseTimeline = {
  durationSeconds: number;
  hits: PulseHit[];
  pauses: PulsePause[];
  score: PulseGridScore;
};

export function gridPositionToSeconds(position: string, score: PulseGridScore) {
  const [bar, beat, step] = parseGridPosition(position);
  const beatsPerBar = getBeatsPerBar(score);
  const stepsPerBeat = getStepsPerBeat(score);

  if (beat > beatsPerBar) {
    throw new Error(`Beat ${beat} exceeds meter ${beatsPerBar}`);
  }

  if (step > stepsPerBeat) {
    throw new Error(`Step ${step} exceeds grid ${score.grid}`);
  }

  const beatsFromDownbeat =
    (bar - 1) * beatsPerBar +
    (beat - 1) +
    (step - 1) * gridUnitToBeats(score.grid, score);

  return score.downbeatAt + beatsFromDownbeat * secondsPerBeat(score);
}

export function createPulseTimeline(
  score: PulseGridScore,
  durationSeconds = DEFAULT_TIMELINE_SECONDS
): PulseTimeline {
  const safeDurationSeconds = Number.isFinite(durationSeconds)
    ? Math.max(0, durationSeconds)
    : DEFAULT_TIMELINE_SECONDS;
  const hits: PulseHit[] = [];
  const pauses: PulsePause[] = [];
  const mutedHitTimes = new Set<number>();

  for (const pattern of score.patterns ?? []) {
    if (pattern.type !== "hit") {
      continue;
    }

    const startSeconds = gridPositionToSeconds(pattern.from, score);
    const untilSeconds =
      pattern.until && pattern.until !== "end"
        ? gridPositionToSeconds(pattern.until, score)
        : safeDurationSeconds;
    const everySeconds =
      patternIntervalToBeats(pattern, score) * secondsPerBeat(score);

    if (everySeconds <= 0) {
      continue;
    }

    for (
      let timeSeconds = startSeconds;
      timeSeconds < Math.min(untilSeconds, safeDurationSeconds);
      timeSeconds += everySeconds
    ) {
      hits.push(
        createHit(
          score,
          timeSeconds,
          pattern,
          `pattern:${pattern.id ?? pattern.every ?? patternMeterId(pattern)}`
        )
      );
    }
  }

  for (const event of score.events ?? []) {
    if (event.type === "pause" && event.at) {
      mutedHitTimes.add(gridPositionToSeconds(event.at, score));
      continue;
    }

    if (event.type === "pause" && event.from && event.until) {
      pauses.push({
        fromSeconds: gridPositionToSeconds(event.from, score),
        untilSeconds:
          event.until === "end"
            ? safeDurationSeconds
            : gridPositionToSeconds(event.until, score)
      });
      continue;
    }

    if ((event.type === "hit" || event.type === "hold") && event.at) {
      hits.push(
        createHit(
          score,
          gridPositionToSeconds(event.at, score),
          event,
          `event:${event.at}`
        )
      );
    }
  }

  if (mutedHitTimes.size > 0) {
    removeMutedHits(hits, mutedHitTimes);
  }

  hits.sort((left, right) => left.timeSeconds - right.timeSeconds);
  pauses.sort((left, right) => left.fromSeconds - right.fromSeconds);

  return {
    durationSeconds: safeDurationSeconds,
    hits,
    pauses,
    score
  };
}

function removeMutedHits(hits: PulseHit[], mutedHitTimes: ReadonlySet<number>) {
  for (let index = hits.length - 1; index >= 0; index -= 1) {
    const hit = hits[index];

    if (hit && mutedHitTimes.has(hit.timeSeconds)) {
      hits.splice(index, 1);
    }
  }
}

export function getPulseEnergyAt(timeline: PulseTimeline, timeSeconds: number) {
  if (
    !Number.isFinite(timeSeconds) ||
    timeSeconds < timeline.score.downbeatAt
  ) {
    return 0;
  }

  if (isInsidePause(timeline.pauses, timeSeconds)) {
    return 0;
  }

  let energy = 0;

  for (const hit of timeline.hits) {
    if (hit.timeSeconds > timeSeconds) {
      energy = Math.max(energy, getPreGlowEnergy(hit, timeSeconds));
      continue;
    }

    const elapsedMilliseconds = (timeSeconds - hit.timeSeconds) * 1000;
    const releaseElapsedMilliseconds = Math.max(
      0,
      elapsedMilliseconds - hit.holdMs
    );
    const nextEnergy =
      hit.intensity * Math.exp(-releaseElapsedMilliseconds / hit.decayMs);

    energy = Math.max(energy, nextEnergy);
  }

  return Math.min(MAX_AUDIO_ENERGY, Math.max(0, energy));
}

function parseGridPosition(position: string) {
  const parts = position.split(".").map((part) => Number(part));

  if (
    parts.length !== POSITION_PARTS ||
    parts.some((part) => !Number.isInteger(part))
  ) {
    throw new Error(`Invalid pulse grid position: ${position}`);
  }

  const [bar, beat, step] = parts;

  if (bar < 1 || beat < 1 || step < 1) {
    throw new Error(`Invalid pulse grid position: ${position}`);
  }

  return [bar, beat, step] as const;
}

function createHit(
  score: PulseGridScore,
  timeSeconds: number,
  item: PulseHitConfig,
  source: string
): PulseHit {
  const holdMs = getHoldDurationMs(item, score);
  const preGlowMs = getPreGlowDurationMs(item, score);
  const intensity =
    item.intensity ?? score.defaults?.intensity ?? DEFAULT_INTENSITY;
  const preIntensity = getPreGlowIntensity(item, intensity);

  return {
    decayMs:
      item.decayMs ??
      (holdMs > 0
        ? item.slow
          ? DEFAULT_SLOW_HOLD_RELEASE_MS
          : DEFAULT_HOLD_RELEASE_MS
        : (score.defaults?.decayMs ?? DEFAULT_DECAY_MS)),
    holdMs,
    intensity,
    preGlowMs,
    preStartIntensity: getPreGlowStartIntensity(item, preIntensity),
    preIntensity,
    source,
    timeSeconds
  };
}

function getHoldDurationMs(item: PulseHitConfig, score: PulseGridScore) {
  if (item.type !== "hold") {
    return 0;
  }

  if (typeof item.durationMs === "number" && Number.isFinite(item.durationMs)) {
    return Math.max(0, item.durationMs);
  }

  if (item.duration) {
    return gridUnitToBeats(item.duration, score) * secondsPerBeat(score) * 1000;
  }

  return gridUnitToBeats("1/4", score) * secondsPerBeat(score) * 1000;
}

function getPreGlowDurationMs(item: PulseHitConfig, score: PulseGridScore) {
  if (typeof item.preGlowMs === "number" && Number.isFinite(item.preGlowMs)) {
    return Math.max(0, item.preGlowMs);
  }

  if (item.preGlow) {
    return gridUnitToBeats(item.preGlow, score) * secondsPerBeat(score) * 1000;
  }

  return 0;
}

function getPreGlowIntensity(item: PulseHitConfig, hitIntensity: number) {
  const requestedIntensity = item.preIntensity ?? hitIntensity * 0.4;
  const maxPreIntensity = hitIntensity * MAX_PRE_GLOW_RATIO;

  return Math.max(0, Math.min(requestedIntensity, maxPreIntensity));
}

function getPreGlowStartIntensity(item: PulseHitConfig, preIntensity: number) {
  return Math.max(0, Math.min(item.preStartIntensity ?? 0, preIntensity));
}

function getPreGlowEnergy(hit: PulseHit, timeSeconds: number) {
  if (hit.preGlowMs <= 0) {
    return 0;
  }

  const leadMilliseconds = (hit.timeSeconds - timeSeconds) * 1000;

  if (leadMilliseconds < 0 || leadMilliseconds > hit.preGlowMs) {
    return 0;
  }

  const progress = 1 - leadMilliseconds / hit.preGlowMs;
  const easedProgress = progress * progress * (3 - 2 * progress);

  return (
    hit.preStartIntensity +
    (hit.preIntensity - hit.preStartIntensity) * easedProgress
  );
}

function getBeatsPerBar(score: PulseGridScore) {
  const beatsPerBar = score.meter[0];

  if (!Number.isFinite(beatsPerBar) || beatsPerBar <= 0) {
    throw new Error("Pulse grid meter must declare beats per bar");
  }

  return beatsPerBar;
}

function getBeatUnit(score: PulseGridScore) {
  const beatUnit = score.meter[1];

  if (!Number.isFinite(beatUnit) || beatUnit <= 0) {
    throw new Error("Pulse grid meter must declare beat unit");
  }

  return beatUnit;
}

function getStepsPerBeat(score: PulseGridScore) {
  return Math.round(1 / gridUnitToBeats(score.grid, score));
}

function gridUnitToBeats(unit: PulseDuration, score: PulseGridScore) {
  if (typeof unit === "number") {
    return validatePositivePulseUnit(unit, String(unit));
  }

  const trimmedUnit = unit.trim();

  if (!trimmedUnit.includes("/")) {
    return validatePositivePulseUnit(Number(trimmedUnit), trimmedUnit);
  }

  const [numerator, denominator] = trimmedUnit
    .split("/")
    .map((part) => Number(part));

  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    numerator <= 0 ||
    denominator <= 0
  ) {
    throw new Error(`Invalid pulse grid unit: ${trimmedUnit}`);
  }

  return (numerator * getBeatUnit(score)) / denominator;
}

function validatePositivePulseUnit(value: number, unit: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Invalid pulse grid unit: ${unit}`);
  }

  return value;
}

function patternIntervalToBeats(pattern: PulsePattern, score: PulseGridScore) {
  if (pattern.every) {
    return gridUnitToBeats(pattern.every, score);
  }

  if (pattern.meter) {
    return gridUnitToBeats(`1/${getPatternBeatUnit(pattern)}`, score);
  }

  throw new Error("Pulse pattern must declare every or meter");
}

function patternMeterId(pattern: PulsePattern) {
  return pattern.meter ? pattern.meter.join("/") : "meter";
}

function getPatternBeatUnit(pattern: PulsePattern) {
  const beatUnit = pattern.meter?.[1];

  if (
    typeof beatUnit !== "number" ||
    !Number.isFinite(beatUnit) ||
    beatUnit <= 0
  ) {
    throw new Error("Pulse pattern meter must declare beat unit");
  }

  return beatUnit;
}

function isInsidePause(pauses: readonly PulsePause[], timeSeconds: number) {
  return pauses.some(
    (pause) =>
      timeSeconds >= pause.fromSeconds && timeSeconds < pause.untilSeconds
  );
}

function secondsPerBeat(score: PulseGridScore) {
  if (!Number.isFinite(score.bpm) || score.bpm <= 0) {
    throw new Error("Pulse grid BPM must be a positive number");
  }

  return 60 / score.bpm;
}
