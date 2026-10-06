import { Composition } from "remotion";
import { RecursionAnimation } from "./Composition";

export const RemotionRoot = () => (
  <Composition
    id="Recursion"
    component={RecursionAnimation}
    durationInFrames={840}
    fps={30}
    width={720}
    height={640}
  />
);
