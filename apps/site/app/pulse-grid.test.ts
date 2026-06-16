import { describe, expect, it } from "vitest";
import trevoPulseScore from "../content/trevo-pulse-108.json";
import {
  createPulseTimeline,
  getPulseEnergyAt,
  gridPositionToSeconds,
  type PulseGridScore
} from "./pulse-grid";

describe("pulse grid timing", () => {
  it("maps DAW-style bar.beat.step positions to seconds at 108 BPM", () => {
    expect(gridPositionToSeconds("1.1.1", trevoPulseScore)).toBe(0);
    expect(gridPositionToSeconds("1.2.1", trevoPulseScore)).toBeCloseTo(
      60 / 108
    );
    expect(gridPositionToSeconds("1.3.1", trevoPulseScore)).toBeCloseTo(
      (60 / 108) * 2
    );
    expect(gridPositionToSeconds("1.4.1", trevoPulseScore)).toBeCloseTo(
      (60 / 108) * 3
    );
    expect(gridPositionToSeconds("2.1.1", trevoPulseScore)).toBeCloseTo(
      (60 / 108) * 4
    );
    expect(gridPositionToSeconds("2.2.1", trevoPulseScore)).toBeCloseTo(
      (60 / 108) * 5
    );
  });

  it("rejects zero-based grid steps so JSON stays DAW-compatible", () => {
    expect(() => gridPositionToSeconds("1.1.0", trevoPulseScore)).toThrow(
      "Invalid pulse grid position"
    );
  });

  it("expands the default four-on-the-floor pattern on quarter notes", () => {
    const timeline = createPulseTimeline(
      {
        ...trevoPulseScore,
        events: [],
        patterns: [
          {
            id: "four-on-the-floor",
            from: "1.1.1",
            until: "end",
            every: "1/4",
            type: "hit",
            intensity: 1
          }
        ]
      },
      (60 / 108) * 8
    );
    const patternHits = timeline.hits.filter((hit) =>
      hit.source.startsWith("pattern:")
    );

    for (const [index, hit] of patternHits.slice(0, 8).entries()) {
      expect(hit.timeSeconds).toBeCloseTo(index * (60 / 108));
    }
  });

  it("supports meter shorthand for configured pattern ranges", () => {
    const scoreWithMeterPattern = {
      ...trevoPulseScore,
      events: [],
      patterns: [
        {
          id: "three-four-test",
          from: "1.1.1",
          until: "1.4.1",
          meter: [3, 4],
          type: "hit",
          intensity: 1
        }
      ]
    } satisfies PulseGridScore;
    const timeline = createPulseTimeline(scoreWithMeterPattern, 4);

    expect(timeline.hits.map((hit) => hit.timeSeconds)).toEqual([
      0,
      60 / 108,
      (60 / 108) * 2
    ]);
  });

  it("starts the trevo pulse at the DAW position 3.2.1", () => {
    const timeline = createPulseTimeline(trevoPulseScore, (60 / 108) * 14);
    const preGlowStart = gridPositionToSeconds("3.1.1", trevoPulseScore);

    expect(getPulseEnergyAt(timeline, preGlowStart - 0.01)).toBe(0);
    expect(
      getPulseEnergyAt(
        timeline,
        gridPositionToSeconds("3.1.4", trevoPulseScore)
      )
    ).toBeGreaterThan(0);
    expect(
      getPulseEnergyAt(
        timeline,
        gridPositionToSeconds("3.2.1", trevoPulseScore)
      )
    ).toBeGreaterThan(0.9);
  });

  it("keeps the trevo intro hits on their authored off-beat DAW positions", () => {
    const timeline = createPulseTimeline(
      trevoPulseScore,
      gridPositionToSeconds("4.1.1", trevoPulseScore)
    );
    const introHits = timeline.hits.filter(
      (hit) =>
        hit.timeSeconds >= gridPositionToSeconds("3.2.1", trevoPulseScore) &&
        hit.timeSeconds < gridPositionToSeconds("4.1.1", trevoPulseScore)
    );

    expect(
      introHits.map((hit) => ({
        source: hit.source,
        timeSeconds: hit.timeSeconds
      }))
    ).toEqual([
      {
        source: "event:3.2.1",
        timeSeconds: gridPositionToSeconds("3.2.1", trevoPulseScore)
      },
      {
        source: "event:3.2.3",
        timeSeconds: gridPositionToSeconds("3.2.3", trevoPulseScore)
      },
      {
        source: "event:3.3.3",
        timeSeconds: gridPositionToSeconds("3.3.3", trevoPulseScore)
      }
    ]);
  });

  it("does not add implicit four-on-the-floor hits before the first configured pattern range", () => {
    const firstPattern = trevoPulseScore.patterns[0];
    const firstPatternStart = firstPattern?.from;

    if (!firstPatternStart) {
      throw new Error("Expected trevo pulse score to define a pattern range");
    }

    const timeline = createPulseTimeline(
      trevoPulseScore,
      gridPositionToSeconds(firstPatternStart, trevoPulseScore)
    );
    const introPatternHits = timeline.hits.filter(
      (hit) =>
        hit.source.startsWith("pattern:") &&
        hit.timeSeconds <
          gridPositionToSeconds(firstPatternStart, trevoPulseScore)
    );

    expect(introPatternHits).toEqual([]);
  });

  it("only emits the four-on-the-floor pattern inside configured pattern ranges", () => {
    const patternRanges = trevoPulseScore.patterns.map((pattern) => ({
      fromSeconds: gridPositionToSeconds(pattern.from, trevoPulseScore),
      untilSeconds:
        pattern.until && pattern.until !== "end"
          ? gridPositionToSeconds(pattern.until, trevoPulseScore)
          : Number.POSITIVE_INFINITY
    }));
    const timeline = createPulseTimeline(
      trevoPulseScore,
      Math.min(
        gridPositionToSeconds("30.1.1", trevoPulseScore),
        patternRanges.at(-1)?.untilSeconds ?? 0
      )
    );
    const patternHits = timeline.hits.filter((hit) =>
      hit.source.startsWith("pattern:")
    );

    expect(patternHits.length).toBeGreaterThan(0);
    expect(
      patternHits.every((hit) =>
        patternRanges.some(
          (range) =>
            hit.timeSeconds >= range.fromSeconds &&
            hit.timeSeconds < range.untilSeconds
        )
      )
    ).toBe(true);
  });

  it("supports a single-position pause to remove one hit", () => {
    const scoreWithMutedKick = {
      ...trevoPulseScore,
      patterns: [
        {
          id: "four-on-the-floor",
          from: "1.1.1",
          until: "end",
          every: "1/4",
          type: "hit",
          intensity: 1
        }
      ],
      events: [{ at: "2.1.1", type: "pause" }]
    } satisfies PulseGridScore;
    const timeline = createPulseTimeline(scoreWithMutedKick, (60 / 108) * 12);
    const mutedHitTime = gridPositionToSeconds("2.1.1", scoreWithMutedKick);

    expect(
      getPulseEnergyAt(
        timeline,
        gridPositionToSeconds("1.4.1", scoreWithMutedKick)
      )
    ).toBeGreaterThan(0.9);
    expect(timeline.hits.some((hit) => hit.timeSeconds === mutedHitTime)).toBe(
      false
    );
    expect(getPulseEnergyAt(timeline, mutedHitTime)).toBeLessThan(0.2);
    expect(
      getPulseEnergyAt(
        timeline,
        gridPositionToSeconds("2.2.1", scoreWithMutedKick)
      )
    ).toBeGreaterThan(0.9);
  });

  it("adds configured grid hits between the main kick pulses", () => {
    const timeline = createPulseTimeline(trevoPulseScore, (60 / 108) * 20);
    const extraHit = timeline.hits.find((hit) => hit.source === "event:3.3.3");

    expect(extraHit).toMatchObject({
      intensity: 0.72,
      source: "event:3.3.3",
      timeSeconds: expect.closeTo((60 / 108) * 10.5)
    });
    expect(extraHit?.holdMs).toBeGreaterThan(0);
  });

  it("supports long hold events with a slow release", () => {
    const scoreWithHold = {
      ...trevoPulseScore,
      patterns: [],
      events: [
        {
          at: "1.1.1",
          type: "hold",
          intensity: 0.72,
          duration: "1/2",
          slow: true
        }
      ]
    } satisfies PulseGridScore;
    const timeline = createPulseTimeline(scoreWithHold, 4);
    const holdStart = gridPositionToSeconds("1.1.1", scoreWithHold);
    const holdEnd = gridPositionToSeconds("1.3.1", scoreWithHold);

    expect(getPulseEnergyAt(timeline, holdStart)).toBeCloseTo(0.72);
    expect(getPulseEnergyAt(timeline, holdEnd - 0.01)).toBeCloseTo(0.72);
    expect(getPulseEnergyAt(timeline, holdEnd + 0.25)).toBeGreaterThan(0.45);
    expect(getPulseEnergyAt(timeline, holdEnd + 1.5)).toBeLessThan(0.3);
  });

  it("ramps a configured pre glow before the hit lands", () => {
    const scoreWithPreGlow = {
      ...trevoPulseScore,
      patterns: [],
      events: [
        {
          at: "2.1.1",
          type: "hit",
          intensity: 1,
          preGlow: "1/2",
          preIntensity: 0.42
        }
      ]
    } satisfies PulseGridScore;
    const timeline = createPulseTimeline(scoreWithPreGlow, 4);
    const preGlowStart = gridPositionToSeconds("1.3.1", scoreWithPreGlow);
    const preGlowMiddle = gridPositionToSeconds("1.4.1", scoreWithPreGlow);
    const hitTime = gridPositionToSeconds("2.1.1", scoreWithPreGlow);

    expect(getPulseEnergyAt(timeline, preGlowStart - 0.01)).toBe(0);
    expect(getPulseEnergyAt(timeline, preGlowStart)).toBe(0);
    expect(getPulseEnergyAt(timeline, preGlowMiddle)).toBeGreaterThan(0.18);
    expect(getPulseEnergyAt(timeline, preGlowMiddle)).toBeLessThan(0.3);
    expect(getPulseEnergyAt(timeline, hitTime - 0.01)).toBeGreaterThan(0.39);
    expect(getPulseEnergyAt(timeline, hitTime)).toBeCloseTo(1);
  });

  it("keeps the landing hit stronger than the pre glow even when the pre glow is hot", () => {
    const scoreWithHotPreGlow = {
      ...trevoPulseScore,
      patterns: [],
      events: [
        {
          at: "2.1.1",
          type: "hit",
          intensity: 1,
          preGlow: "1",
          preIntensity: 1
        }
      ]
    } satisfies PulseGridScore;
    const timeline = createPulseTimeline(scoreWithHotPreGlow, 4);
    const hitTime = gridPositionToSeconds("2.1.1", scoreWithHotPreGlow);
    const justBeforeHit = getPulseEnergyAt(timeline, hitTime - 0.01);
    const landingHit = getPulseEnergyAt(timeline, hitTime);
    const justAfterHit = getPulseEnergyAt(timeline, hitTime + 0.016);

    expect(justBeforeHit).toBeGreaterThan(0.55);
    expect(justBeforeHit).toBeLessThan(0.82);
    expect(landingHit).toBeCloseTo(1);
    expect(justAfterHit).toBeGreaterThan(justBeforeHit);
  });

  it("supports a configured pre glow starting intensity", () => {
    const scoreWithPreGlowStart = {
      ...trevoPulseScore,
      patterns: [],
      events: [
        {
          at: "2.1.1",
          type: "hit",
          intensity: 1,
          preGlow: "1/2",
          preStartIntensity: 0.12,
          preIntensity: 0.42
        }
      ]
    } satisfies PulseGridScore;
    const timeline = createPulseTimeline(scoreWithPreGlowStart, 4);
    const preGlowStart = gridPositionToSeconds("1.3.1", scoreWithPreGlowStart);
    const preGlowMiddle = gridPositionToSeconds("1.4.1", scoreWithPreGlowStart);

    expect(getPulseEnergyAt(timeline, preGlowStart)).toBeCloseTo(0.12);
    expect(getPulseEnergyAt(timeline, preGlowMiddle)).toBeGreaterThan(0.24);
  });

  it("suppresses pulse energy inside configured pause ranges", () => {
    const scoreWithPauseRange = {
      ...trevoPulseScore,
      patterns: [
        {
          id: "four-on-the-floor",
          from: "1.1.1",
          until: "end",
          every: "1/4",
          type: "hit",
          intensity: 1
        }
      ],
      events: [
        {
          from: "3.1.1",
          until: "4.1.1",
          type: "pause"
        },
        {
          at: "4.1.1",
          type: "hit",
          intensity: 1.25
        }
      ]
    } satisfies PulseGridScore;
    const timeline = createPulseTimeline(scoreWithPauseRange, (60 / 108) * 14);
    const pausedEnergy = getPulseEnergyAt(
      timeline,
      gridPositionToSeconds("3.2.1", scoreWithPauseRange)
    );
    const returnHitEnergy = getPulseEnergyAt(
      timeline,
      gridPositionToSeconds("4.1.1", scoreWithPauseRange)
    );

    expect(pausedEnergy).toBe(0);
    expect(returnHitEnergy).toBeGreaterThan(1);
  });

  it("decays smoothly between hits instead of staying high", () => {
    const timeline = createPulseTimeline(trevoPulseScore, 8);
    const firstActiveHitTime = gridPositionToSeconds("3.2.1", trevoPulseScore);
    const firstHit = getPulseEnergyAt(timeline, firstActiveHitTime);
    const sixteenthAfterHit = getPulseEnergyAt(
      timeline,
      firstActiveHitTime + 60 / 108 / 4
    );
    const nextHit = getPulseEnergyAt(
      timeline,
      gridPositionToSeconds("3.2.3", trevoPulseScore)
    );

    expect(firstHit).toBeCloseTo(1);
    expect(sixteenthAfterHit).toBeLessThan(firstHit);
    expect(sixteenthAfterHit).toBeGreaterThan(0.25);
    expect(nextHit).toBeCloseTo(1);
  });

  it("is deterministic for seek and resume because it reads absolute audio time", () => {
    const timeline = createPulseTimeline(trevoPulseScore, 12);
    const seekTime = gridPositionToSeconds("3.3.3", trevoPulseScore);

    expect(getPulseEnergyAt(timeline, seekTime)).toBe(
      getPulseEnergyAt(timeline, seekTime)
    );
  });
});
