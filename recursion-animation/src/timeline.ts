export const FPS = 30;
export const INTRO = 75;
export const BEAT = 75;
export const OUTRO = 750;
export const DURATION = 840;

export const steps = [
  { n: 4, kind: "call", result: 0, previous: 0 },
  { n: 3, kind: "call", result: 0, previous: 0 },
  { n: 2, kind: "call", result: 0, previous: 0 },
  { n: 1, kind: "call", result: 0, previous: 0 },
  { n: 0, kind: "base", result: 1, previous: 0 },
  { n: 1, kind: "return", result: 1, previous: 1 },
  { n: 2, kind: "return", result: 2, previous: 1 },
  { n: 3, kind: "return", result: 6, previous: 2 },
  { n: 4, kind: "return", result: 24, previous: 6 },
] as const;

export const chapters = [
  { frame: 0, label: "The question" },
  { frame: INTRO, label: "Smaller calls" },
  { frame: INTRO + 4 * BEAT, label: "The base case" },
  { frame: INTRO + 5 * BEAT, label: "Returning answers" },
  { frame: OUTRO, label: "The result" },
];

export function getStep(frame: number) {
  const index = Math.max(
    0,
    Math.min(steps.length - 1, Math.floor((frame - INTRO) / BEAT)),
  );
  return { ...steps[index], index, start: INTRO + index * BEAT };
}

export function getChapter(frame: number) {
  for (let i = chapters.length - 1; i >= 0; i--) {
    if (frame >= chapters[i].frame) return i;
  }
  return 0;
}

export function getExplanation(frame: number) {
  if (frame < INTRO)
    return {
      title: "How do we find 4!?",
      description:
        "Factorial multiplies the integers from 1 through a number. To find 4!, we could calculate 4 × 3 × 2 × 1. Recursion gives us another way to organize exactly that work.",
      equation: "factorial(4) = ?",
      insight:
        "A recursive function delegates part of the work to another call of the same function.",
    };
  if (frame >= OUTRO)
    return {
      title: "The answer returns to the start.",
      description:
        "The original call receives 6 from factorial(3), multiplies it by 4, and returns 24. Every waiting call has finished. The computation is complete.",
      equation: "factorial(4) = 24",
      insight:
        "Five calls, one base case. We go down by making calls, then back up by returning answers.",
    };
  const step = getStep(frame);
  if (step.kind === "call")
    return {
      title: `Same question. Now with ${step.n - 1}.`,
      description: `factorial(${step.n}) needs factorial(${step.n - 1}) before it can finish. It makes that smaller call and waits. Its own value of n and the unfinished multiplication stay in a stack frame.`,
      equation: `${step.n}! = ${step.n} × ${step.n - 1}!`,
      insight:
        "The input decreases by 1 on every call, so it moves toward zero.",
    };
  if (step.kind === "base")
    return {
      title: "Here is the answer we already know.",
      description:
        "factorial(0) returns 1 directly. It makes no recursive call. This is the base case: the simplest case that anchors the definition and stops the descent.",
      equation: "0! = 1",
      insight:
        "The base value is 1, not 0. Returning 0 would make every multiplication above it equal zero.",
    };
  return {
    title: "One answer unlocks the next.",
    description: `factorial(${step.n - 1}) has returned ${step.previous}. Now factorial(${step.n}) can finish: ${step.n} × ${step.previous} = ${step.result}. It returns ${step.result}${step.n === 4 ? " as the final answer" : ` to factorial(${step.n + 1})`}.`,
    equation: `${step.n} × ${step.previous} = ${step.result}`,
    insight:
      "Calls return in the opposite order to their arrival. The newest waiting call finishes first.",
  };
}
