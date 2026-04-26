"use client";

import type { MouseEvent, PointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const VOLUME = 0.18;
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "touchstart"] as const;

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ctrlDownRef = useRef(false);
  const hoverRef = useRef(false);
  const pointerToggleRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [volume, setVolume] = useState(VOLUME);

  const playAudio = useCallback(async () => {
    const audio = audioRef.current;

    if (!audio) {
      return false;
    }

    try {
      await audio.play();
      setIsAutoplayBlocked(false);
      setIsPlaying(true);
      return true;
    } catch {
      setIsAutoplayBlocked(true);
      setIsPlaying(false);
      return false;
    }
  }, []);

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
  }

  function toggleFromPointer(event: PointerEvent) {
    if (event.button !== 0) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();
    pointerToggleRef.current = true;
    void toggleAudio();
  }

  function handleContainerPointerToggle(
    event: PointerEvent<HTMLFieldSetElement>
  ) {
    if (event.target !== event.currentTarget) {
      return;
    }

    toggleFromPointer(event);
  }

  function handleButtonPointerToggle(event: PointerEvent<HTMLButtonElement>) {
    toggleFromPointer(event);
  }

  function handleClickToggle() {
    if (pointerToggleRef.current) {
      pointerToggleRef.current = false;
      return;
    }

    void toggleAudio();
  }

  function handleButtonClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    handleClickToggle();
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

  return (
    <fieldset
      className="audio-toggle"
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
      onPointerDown={handleContainerPointerToggle}
    >
      <legend className="audio-toggle__legend">Music controls</legend>
      <audio
        ref={audioRef}
        src="/audio/trevisoft.mp3"
        autoPlay
        loop
        preload="auto"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => {
          setIsAutoplayBlocked(false);
          setIsPlaying(true);
        }}
      >
        <track kind="captions" />
      </audio>
      <button
        className="audio-toggle__button"
        type="button"
        onClick={handleButtonClick}
        onPointerDown={handleButtonPointerToggle}
        aria-label={
          isPlaying
            ? "Turn music off"
            : isAutoplayBlocked
              ? "Start music"
              : "Turn music on"
        }
        aria-pressed={isPlaying}
        data-state={
          isPlaying ? "playing" : isAutoplayBlocked ? "waiting" : "paused"
        }
      >
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
