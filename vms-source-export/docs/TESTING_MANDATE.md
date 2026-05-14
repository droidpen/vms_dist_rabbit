# Development & Testing Mandates

## Mandatory UI Verification (The "Blank Screen" Protocol)
Because Vite's fast-refresh and ESBuild can sometimes successfully compile code that contains runtime exceptions (e.g., missing React hook imports), **never declare a UI fix as "100% working" based solely on a successful `npm run build`.**

Before confirming a UI fix to the user, you **MUST** verify that the React tree actually mounts in the browser. 

### Verification Step:
1. Run a headless browser script (using Playwright) to hit `http://localhost:5173`.
2. Wait for `networkidle`.
3. Check the `innerHTML` length of `<div id="root">`.
4. If the length is `< 50` characters, the app has fatally crashed (Blank Screen). You must capture the `pageerror` and `console` events to diagnose the runtime crash.
5. Only proceed when the script confirms: `App mounted successfully.`

*A utility script `run_puppeteer.cjs` is located in the VMS directory for this exact purpose.*