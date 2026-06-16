"use client";

import type { MouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import trevoPulseScore from "../content/trevo-pulse-108.json";
import {
  createPulseTimeline,
  getPulseEnergyAt,
  type PulseTimeline
} from "./pulse-grid";

const VOLUME = 0.18;
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "touchstart"] as const;
const AUDIO_ENERGY_PROPERTY = "--audio-energy";
const MIN_AUDIO_ENERGY = 0.004;
const FALLBACK_PULSE_DURATION_SECONDS = 300;

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const shellRef = useRef<HTMLElement | null>(null);
  const audioEnergyRef = useRef(0);
  const pulseTimelineRef = useRef<PulseTimeline | null>(null);
  const pulseTimelineDurationRef = useRef<number | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ctrlDownRef = useRef(false);
  const hoverRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [volume, setVolume] = useState(VOLUME);

  const getSiteShell = useCallback(() => {
    if (shellRef.current) {
      return shellRef.current;
    }

    const shell = audioRef.current?.closest(".site-shell");

    if (shell instanceof HTMLElement) {
      shellRef.current = shell;
      return shell;
    }

    return null;
  }, []);

  const writeAudioEnergy = useCallback(
    (value: number) => {
      getSiteShell()?.style.setProperty(
        AUDIO_ENERGY_PROPERTY,
        value.toFixed(3)
      );
    },
    [getSiteShell]
  );

  const resetAudioEnergy = useCallback(() => {
    audioEnergyRef.current = 0;
    writeAudioEnergy(0);
  }, [writeAudioEnergy]);

  const cancelAudioReactiveFrame = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const stopAudioReactiveGlow = useCallback(() => {
    cancelAudioReactiveFrame();
    resetAudioEnergy();
  }, [cancelAudioReactiveFrame, resetAudioEnergy]);

  const fadeAudioReactiveGlow = useCallback(() => {
    cancelAudioReactiveFrame();

    const decay = () => {
      const nextEnergy = audioEnergyRef.current * 0.9;

      audioEnergyRef.current = nextEnergy < MIN_AUDIO_ENERGY ? 0 : nextEnergy;
      writeAudioEnergy(audioEnergyRef.current);

      if (audioEnergyRef.current > 0) {
        animationFrameRef.current = requestAnimationFrame(decay);
        return;
      }

      animationFrameRef.current = null;
    };

    decay();
  }, [cancelAudioReactiveFrame, writeAudioEnergy]);

  const getPulseTimeline = useCallback((audio: HTMLAudioElement) => {
    const durationSeconds =
      Number.isFinite(audio.duration) && audio.duration > 0
        ? audio.duration
        : FALLBACK_PULSE_DURATION_SECONDS;

    if (
      pulseTimelineRef.current &&
      pulseTimelineDurationRef.current === durationSeconds
    ) {
      return pulseTimelineRef.current;
    }

    const timeline = createPulseTimeline(trevoPulseScore, durationSeconds);

    pulseTimelineRef.current = timeline;
    pulseTimelineDurationRef.current = durationSeconds;

    return timeline;
  }, []);

  const startAudioReactiveGlow = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      resetAudioEnergy();
      return;
    }

    cancelAudioReactiveFrame();

    const tick = () => {
      if (audio.paused) {
        fadeAudioReactiveGlow();
        return;
      }

      const nextEnergy = getPulseEnergyAt(
        getPulseTimeline(audio),
        audio.currentTime
      );

      audioEnergyRef.current = nextEnergy < MIN_AUDIO_ENERGY ? 0 : nextEnergy;
      writeAudioEnergy(audioEnergyRef.current);
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    tick();
  }, [
    cancelAudioReactiveFrame,
    fadeAudioReactiveGlow,
    getPulseTimeline,
    resetAudioEnergy,
    writeAudioEnergy
  ]);

  const playAudio = useCallback(async () => {
    const audio = audioRef.current;

    if (!audio) {
      return false;
    }

    try {
      await audio.play();
      setIsAutoplayBlocked(false);
      setHasStartedAudio(true);
      setIsPlaying(true);
      startAudioReactiveGlow();
      return true;
    } catch {
      setIsAutoplayBlocked(true);
      setIsPlaying(false);
      return false;
    }
  }, [startAudioReactiveGlow]);

  useEffect(() => {
    const audio = audioRef.current;
    const touchMedia = window.matchMedia("(hover: none), (pointer: coarse)");

    if (!audio) {
      return;
    }

    audio.volume = VOLUME;

    function unlockAudio(event: Event) {
      if (
        event.target instanceof Element &&
        event.target.closest(".audio-toggle")
      ) {
        return;
      }

      void playAudio();
    }

    void playAudio().then((hasStarted) => {
      if (hasStarted || !touchMedia.matches) {
        return;
      }

      for (const eventName of ACTIVITY_EVENTS) {
        window.addEventListener(eventName, unlockAudio, {
          capture: true,
          once: true,
          passive: true
        });
      }
    });

    return () => {
      for (const eventName of ACTIVITY_EVENTS) {
        window.removeEventListener(eventName, unlockAudio, {
          capture: true
        });
      }
    };
  }, [playAudio]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Control") {
        return;
      }

      ctrlDownRef.current = true;

      if (hoverRef.current) {
        if (closeTimerRef.current) {
          clearTimeout(closeTimerRef.current);
          closeTimerRef.current = null;
        }
        setIsVolumeOpen(true);
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === "Control") {
        ctrlDownRef.current = false;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  async function toggleAudio() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      await playAudio();
      return;
    }

    audio.pause();
    setIsAutoplayBlocked(false);
    setIsPlaying(false);
    fadeAudioReactiveGlow();
  }

  function handleButtonClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    void toggleAudio();
  }

  function updateVolume(value: string) {
    const nextVolume = Number(value) / 100;
    const audio = audioRef.current;

    setVolume(nextVolume);

    if (audio) {
      audio.volume = nextVolume;
    }
  }

  function cancelVolumeClose() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function scheduleVolumeClose() {
    cancelVolumeClose();
    closeTimerRef.current = setTimeout(() => setIsVolumeOpen(false), 700);
  }

  const audioState = isPlaying
    ? "playing"
    : hasStartedAudio
      ? "paused"
      : "waiting";

  useEffect(() => {
    const shell = getSiteShell();

    if (!shell) {
      return;
    }

    shell.dataset.audioState = audioState;

    if (audioState !== "playing") {
      fadeAudioReactiveGlow();
    }
  }, [audioState, fadeAudioReactiveGlow, getSiteShell]);

  useEffect(() => {
    return () => {
      stopAudioReactiveGlow();

      const shell = shellRef.current;

      shell?.style.removeProperty(AUDIO_ENERGY_PROPERTY);

      if (shell) {
        delete shell.dataset.audioState;
      }
    };
  }, [stopAudioReactiveGlow]);

  return (
    <fieldset
      className="audio-toggle"
      data-audio-controller="true"
      onPointerEnter={(event) => {
        hoverRef.current = true;
        cancelVolumeClose();
        if (event.ctrlKey || ctrlDownRef.current) {
          setIsVolumeOpen(true);
        }
      }}
      onPointerMove={(event) => {
        if (event.ctrlKey || ctrlDownRef.current) {
          cancelVolumeClose();
          setIsVolumeOpen(true);
        }
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
        scheduleVolumeClose();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          scheduleVolumeClose();
        }
      }}
    >
      <legend className="audio-toggle__legend">Music controls</legend>
      <audio
        ref={audioRef}
        src="/audio/trevisoft.mp3"
        autoPlay
        loop
        preload="auto"
        onEnded={() => setIsPlaying(false)}
        onPause={() => {
          setIsPlaying(false);
          fadeAudioReactiveGlow();
        }}
        onPlay={() => {
          setIsAutoplayBlocked(false);
          setHasStartedAudio(true);
          setIsPlaying(true);
          startAudioReactiveGlow();
        }}
      >
        <track kind="captions" />
      </audio>
      <button
        className="audio-toggle__button"
        type="button"
        onClick={handleButtonClick}
        aria-label={
          isPlaying
            ? "Turn music off"
            : isAutoplayBlocked
              ? "Start music"
              : "Turn music on"
        }
        aria-pressed={isPlaying}
        data-state={audioState}
      >
        {audioState === "waiting" ? (
          <span className="audio-toggle__beacon" aria-hidden="true">
            <span className="audio-toggle__beacon-ring audio-toggle__beacon-ring--inner" />
            <span className="audio-toggle__beacon-ring audio-toggle__beacon-ring--outer" />
          </span>
        ) : null}
        <span className="audio-toggle__ring" aria-hidden="true" />
        <span className="audio-toggle__bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
      {isVolumeOpen ? (
        <label
          className="audio-toggle__volume"
          onPointerEnter={cancelVolumeClose}
          onPointerLeave={scheduleVolumeClose}
        >
          <span>Secret Volume</span>
          <input
            type="range"
            min="0"
            max="40"
            value={Math.round(volume * 100)}
            onChange={(event) => updateVolume(event.currentTarget.value)}
            aria-label="Music volume"
          />
        </label>
      ) : null}
    </fieldset>
  );
}
