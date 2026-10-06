import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Player,
  type CallbackListener,
  type PlayerRef,
} from "@remotion/player";
import { RecursionAnimation } from "./Composition";
import {
  DURATION,
  FPS,
  chapters,
  getChapter,
  getExplanation,
} from "./timeline";

function AnimationPage() {
  const player = useRef<PlayerRef>(null);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [error, setError] = useState(false);
  const chapter = getChapter(frame);
  const explanation = getExplanation(frame);

  useEffect(() => {
    const current = player.current;
    if (!current) return;
    const update: CallbackListener<"frameupdate" | "seeked"> = (e) =>
      setFrame(e.detail.frame);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => {
      setError(true);
      setPlaying(false);
    };
    current.addEventListener("frameupdate", update);
    current.addEventListener("seeked", update);
    current.addEventListener("play", onPlay);
    current.addEventListener("pause", onPause);
    current.addEventListener("ended", onPause);
    current.addEventListener("error", onError);
    return () => {
      current.removeEventListener("frameupdate", update);
      current.removeEventListener("seeked", update);
      current.removeEventListener("play", onPlay);
      current.removeEventListener("pause", onPause);
      current.removeEventListener("ended", onPause);
      current.removeEventListener("error", onError);
    };
  }, []);

  const seek = (position: number) => {
    player.current?.pause();
    player.current?.seekTo(position);
    setFrame(position);
  };
  const toggle = () => {
    if (frame >= DURATION - 1) player.current?.seekTo(0);
    player.current?.toggle();
  };

  return (
    <>
      <div className="watch-grid">
        <div className="animation-card">
          <div className="animation-bar">
            <span>
              <i /> A RECURSIVE JOURNEY
            </span>
            <span>4! · 28 seconds</span>
          </div>
          <div
            className="player-stage"
            role="img"
            aria-label="Animated factorial call stack; a written description of the current step is beside the animation"
            aria-describedby="current-description"
          >
            <Player
              ref={player}
              component={RecursionAnimation}
              durationInFrames={DURATION}
              fps={FPS}
              compositionWidth={720}
              compositionHeight={640}
              controls={false}
              autoPlay={false}
              clickToPlay={false}
              doubleClickToFullscreen={false}
              spaceKeyToPlayOrPause={false}
              moveToBeginningWhenEnded={false}
              playbackRate={speed}
              style={{ width: "100%" }}
              errorFallback={() => (
                <div className="player-error">
                  The animation couldn’t load. Read the complete walkthrough
                  below.
                </div>
              )}
            />
          </div>
          <div className="player-controls">
            <div className="control-row">
              <button
                type="button"
                className="play-control"
                onClick={toggle}
                disabled={error}
                aria-label={
                  playing
                    ? "Pause animation"
                    : frame >= DURATION - 1
                      ? "Replay animation"
                      : "Play animation"
                }
              >
                <span
                  className={playing ? "pause-icon" : "play-icon"}
                  aria-hidden="true"
                />
                {playing ? "Pause" : frame >= DURATION - 1 ? "Replay" : "Play"}
              </button>
              <button
                type="button"
                className="restart-control"
                onClick={() => seek(0)}
                disabled={error}
                aria-label="Restart animation"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 5a7 7 0 1 1-1 8M4 1v5H0"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
              </button>
              <span className="time" aria-hidden="true">
                0:{String(Math.floor(frame / FPS)).padStart(2, "0")} / 0:28
              </span>
              <label className="speed-label">
                Speed
                <select
                  aria-label="Playback speed"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                >
                  <option value="0.5">0.5×</option>
                  <option value="1">1×</option>
                  <option value="1.5">1.5×</option>
                  <option value="2">2×</option>
                </select>
              </label>
            </div>
            <input
              className="timeline"
              type="range"
              aria-label="Animation timeline"
              aria-valuetext={`${(frame / FPS).toFixed(1)} seconds. ${chapters[chapter].label}.`}
              min={0}
              max={DURATION - 1}
              value={frame}
              onChange={(e) => seek(Number(e.target.value))}
              disabled={error}
            />
          </div>
        </div>
        <aside
          className="explanation-panel"
          aria-label="Explanation alongside the animation"
        >
          <div className="overline">FOLLOW THE IDEA</div>
          <div className="chapter-count">
            {String(chapter + 1).padStart(2, "0")} <span>/ 05</span>
          </div>
          <div
            className="current-explanation"
            aria-live="polite"
            aria-atomic="true"
          >
            <h2>{explanation.title}</h2>
            <p id="current-description">{explanation.description}</p>
            <div className="current-equation">{explanation.equation}</div>
            <div className="insight">
              <span className="insight-label">THE KEY IDEA</span>
              <p>{explanation.insight}</p>
            </div>
          </div>
          <p className="sidebar-note">
            Pause any time. Use the timeline or the chapters below to take a
            closer look.
          </p>
        </aside>
      </div>
      <div
        className="chapter-list"
        role="group"
        aria-label="Jump to an animation chapter"
      >
        {chapters.map((item, i) => (
          <button
            type="button"
            key={item.frame}
            data-chapter={i}
            aria-pressed={chapter === i}
            onClick={() => seek(item.frame === 0 ? 0 : item.frame + 24)}
          >
            <span className="chapter-number">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{item.label}</span>
            <span className="chapter-time">
              0:{String(Math.floor(item.frame / FPS)).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

const root = document.getElementById("animation-root");
if (root) createRoot(root).render(<AnimationPage />);
