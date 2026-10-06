import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { BEAT, INTRO, OUTRO, getStep } from "./timeline";

const colors = {
  paper: "#f6f5ef",
  ink: "#242922",
  muted: "#697064",
  green: "#436343",
  lime: "#e4edcc",
  purple: "#77669b",
  lavender: "#ebe7f3",
  line: "#dcded3",
};
const serif = "Georgia, 'Times New Roman', serif";
const mono = "'SFMono-Regular', Consolas, 'Liberation Mono', monospace";
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.16, 1, 0.3, 1),
} as const;

const Opening = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ padding: 46, justifyContent: "center" }}>
      <div
        style={{
          fontFamily: mono,
          fontSize: 18,
          color: colors.green,
          letterSpacing: 2,
        }}
      >
        ONE QUESTION
      </div>
      <h1
        style={{
          margin: "20px 0 22px",
          fontFamily: serif,
          fontSize: 78,
          fontWeight: 400,
          lineHeight: 1.1,
        }}
      >
        What is <em style={{ color: colors.green }}>4!?</em>
      </h1>
      <div
        style={{
          fontFamily: mono,
          fontSize: 31,
          color: colors.muted,
          opacity: interpolate(frame, [8, 24], [0, 1], clamp),
          translate: interpolate(
            frame,
            [8, 24],
            ["0px 12px", "0px 0px"],
            clamp,
          ),
        }}
      >
        4 × 3 × 2 × 1 = <span style={{ color: colors.green }}>24</span>
      </div>
      <div
        style={{
          marginTop: 52,
          borderTop: `1px solid ${colors.line}`,
          paddingTop: 24,
          fontSize: 25,
          lineHeight: 1.6,
          opacity: interpolate(frame, [26, 43], [0, 1], clamp),
        }}
      >
        Let’s find the answer
        <br />
        one smaller question at a time.
      </div>
      <svg
        width="110"
        height="100"
        viewBox="0 0 110 100"
        style={{ position: "absolute", right: 46, top: 100, opacity: 0.7 }}
        aria-hidden="true"
      >
        <rect
          x="1"
          y="1"
          width="105"
          height="94"
          rx="9"
          fill={colors.lime}
          stroke="#a3b48d"
        />
        <rect
          x="18"
          y="19"
          width="70"
          height="58"
          rx="6"
          fill="#d8e3c3"
          stroke="#a3b48d"
        />
        <rect x="36" y="36" width="34" height="24" rx="4" fill={colors.green} />
      </svg>
    </AbsoluteFill>
  );
};

const CallStack = () => {
  const localFrame = useCurrentFrame();
  const frame = localFrame + INTRO;
  const step = getStep(frame);
  const returning = step.kind === "return";
  const color = returning ? colors.purple : colors.green;
  return (
    <AbsoluteFill style={{ padding: 38 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: mono,
          fontSize: 17,
          letterSpacing: 1,
        }}
      >
        <span style={{ color: colors.muted }}>FACTORIAL(4)</span>
        <span
          style={{
            color,
            padding: "7px 12px",
            background: returning ? colors.lavender : colors.lime,
            borderRadius: 5,
          }}
        >
          {step.kind === "base"
            ? "BASE CASE"
            : returning
              ? "RETURNING ↑"
              : "CALLING ↓"}
        </span>
      </div>
      <h2
        style={{
          margin: "20px 0 0",
          fontFamily: serif,
          fontSize: 39,
          fontWeight: 400,
        }}
      >
        {step.kind === "base"
          ? "A place to stop."
          : returning
            ? "Bring the answer back."
            : "A smaller version of the problem."}
      </h2>
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 38,
          right: 80,
          height: 338,
        }}
      >
        {[4, 3, 2, 1, 0].map((n) => {
          const arrival = (4 - n) * BEAT;
          const departure = (5 + n) * BEAT;
          if (localFrame < arrival || (n < 4 && localFrame >= departure + 18))
            return null;
          const leaving = n < 4 && localFrame >= departure;
          const active = n === step.n;
          return (
            <div
              key={n}
              data-stack-n={n}
              style={{
                position: "absolute",
                top: (4 - n) * 67,
                left: (4 - n) * 15,
                right: 0,
                height: 57,
                border: `1.5px solid ${active ? (returning ? "#ac99c3" : "#9db183") : "#d8dece"}`,
                borderRadius: 8,
                background: active
                  ? returning
                    ? colors.lavender
                    : colors.lime
                  : "#fafaf6",
                fontFamily: mono,
                padding: "0 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                color: active ? color : colors.muted,
                opacity: leaving
                  ? interpolate(
                      localFrame,
                      [departure, departure + 18],
                      [1, 0],
                      clamp,
                    )
                  : interpolate(
                      localFrame,
                      [arrival, arrival + 16],
                      [0, 1],
                      clamp,
                    ),
                translate: leaving
                  ? interpolate(
                      localFrame,
                      [departure, departure + 18],
                      ["0px 0px", "0px -18px"],
                      clamp,
                    )
                  : interpolate(
                      localFrame,
                      [arrival, arrival + 16],
                      ["0px -12px", "0px 0px"],
                      clamp,
                    ),
              }}
            >
              <span style={{ fontSize: 24 }}>factorial({n})</span>
              <span style={{ fontSize: 18 }}>
                {active
                  ? step.kind === "base"
                    ? "returns 1"
                    : returning
                      ? `${n} × ${step.previous} = ${step.result}`
                      : `needs ${n - 1}!`
                  : leaving
                    ? "returned"
                    : `waiting for ${n - 1}!`}
              </span>
            </div>
          );
        })}
      </div>
      <svg
        width="40"
        height="340"
        viewBox="0 0 40 340"
        style={{ position: "absolute", right: 27, top: 161 }}
        aria-hidden="true"
      >
        <path
          d={returning ? "M20 310V20m-8 8 8-8 8 8" : "M20 20v290m-8-8 8 8 8-8"}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray="5 6"
        />
      </svg>
      {returning && (
        <div
          style={{
            position: "absolute",
            right: 25,
            top: 405 - step.n * 56,
            borderRadius: 50,
            background: colors.purple,
            color: "white",
            fontFamily: mono,
            fontSize: 20,
            padding: "7px 12px",
            opacity: interpolate(
              frame,
              [step.start, step.start + 8, step.start + 50, step.start + 65],
              [0, 1, 1, 0],
              clamp,
            ),
            translate: interpolate(
              frame,
              [step.start, step.start + 65],
              ["0px 18px", "0px -25px"],
              clamp,
            ),
          }}
        >
          {step.result}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: 31,
          left: 38,
          right: 38,
          borderTop: `1px solid ${colors.line}`,
          paddingTop: 20,
          fontFamily: mono,
          fontSize: 22,
          color,
        }}
      >
        {step.kind === "base"
          ? "0! = 1. No more calls."
          : returning
            ? `${step.n}! = ${step.n} × ${step.previous} = ${step.result}`
            : `${step.n}! = ${step.n} × ${step.n - 1}!`}
        <div
          style={{
            color: colors.muted,
            fontFamily: "Arial, sans-serif",
            fontSize: 19,
            marginTop: 9,
          }}
        >
          {step.kind === "base"
            ? "The known answer starts the return journey."
            : returning
              ? "Finish this multiplication. Return to the caller."
              : "Keep this call on the stack while its child runs."}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Closing = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ padding: 46, justifyContent: "center" }}>
      <div
        style={{ font: `18px ${mono}`, letterSpacing: 2, color: colors.green }}
      >
        BACK AT THE BEGINNING
      </div>
      <div
        style={{
          fontFamily: serif,
          fontSize: 108,
          lineHeight: 1.1,
          marginTop: 23,
          color: colors.green,
          opacity: interpolate(frame, [0, 14], [0, 1], clamp),
          scale: interpolate(frame, [0, 20], [0.94, 1], clamp),
        }}
      >
        4! = 24
      </div>
      <p style={{ fontSize: 26, margin: "20px 0 35px", color: colors.muted }}>
        Every waiting call has its answer.
      </p>
      <div
        style={{
          borderTop: `1px solid ${colors.line}`,
          paddingTop: 24,
          opacity: interpolate(frame, [14, 32], [0, 1], clamp),
        }}
      >
        <div style={{ fontFamily: serif, fontSize: 33, marginBottom: 15 }}>
          Same problem. Smaller input.
          <br />A place to stop.
        </div>
        <div style={{ fontFamily: mono, fontSize: 20, color: colors.green }}>
          4 → 3 → 2 → 1 → 0 <span style={{ color: colors.muted }}>calls</span>
        </div>
        <div
          style={{
            fontFamily: mono,
            fontSize: 20,
            color: colors.purple,
            marginTop: 8,
          }}
        >
          1 → 1 → 2 → 6 → 24{" "}
          <span style={{ color: colors.muted }}>answers</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const RecursionAnimation = () => (
  <AbsoluteFill
    style={{
      background: colors.paper,
      color: colors.ink,
      fontFamily: "Arial, sans-serif",
    }}
  >
    <Sequence name="The question" durationInFrames={75}>
      <Opening />
    </Sequence>
    <Sequence
      name="Calls, base case, and returns"
      from={75}
      durationInFrames={675}
    >
      <CallStack />
    </Sequence>
    <Sequence name="The result" from={750} durationInFrames={90}>
      <Closing />
    </Sequence>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 4,
        background: "#e5e9dc",
      }}
    >
      <TimelineProgress />
    </div>
  </AbsoluteFill>
);

const TimelineProgress = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        height: 4,
        background:
          frame >= OUTRO
            ? colors.green
            : getStep(frame).kind === "return"
              ? colors.purple
              : colors.green,
        width: `${interpolate(frame, [0, 839], [0, 100], { extrapolateRight: "clamp" })}%`,
      }}
    />
  );
};
