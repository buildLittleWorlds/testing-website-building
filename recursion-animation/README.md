# Recursion animation

A 28-second Remotion composition follows `factorial(4)` through its calls,
the `factorial(0) = 1` base case, and the return journey to `24`.
`src/timeline.ts` defines the timing and accompanying explanation;
`src/Composition.tsx` draws the animation; `src/player.tsx` embeds it on the site.

From this directory:

```sh
npm ci
npm run lint
npm run build
npm run dev
```

`npm run dev` opens Remotion Studio without launching a system browser.
Choose the **Recursion** composition to edit and preview it.
`npm run build` updates `../assets/recursion-player.js` and its license notices.
Commit the generated assets whenever you change the animation.

The website needs no server-side runtime, CDN, or GitHub Actions build. GitHub
Pages can publish the repository root, including `animation.html` and `assets/`,
directly. For local website testing, run `python3 -m http.server 8000` from the
repository root and open `animation.html` on that server.

The player starts paused, supports keyboard-accessible playback and seeking,
and synchronizes the written explanation with the current frame. A static
walkthrough on the page also explains the full computation without JavaScript.
