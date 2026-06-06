## Root cause

`vite-plugin-prerender.ts` calls `require("fs").statSync(...)` inside the preview server handler. When Vite loads `vite.config.ts`, esbuild bundles it (and the imported plugin) as ESM for Node. Dynamic `require()` is not valid inside that ESM bundle, so esbuild's shim throws `Dynamic require of "fs" is not supported` the moment the plugin module is evaluated — which happens on every build and on `vite preview`. The deployed output is therefore broken (or a stale/empty shell), and every route shows that error.

The plugin is already build-only (`apply: "build"`) and is only imported from `vite.config.ts`, so it does not actually ship to the client. The fix is just to stop using `require()` inside an ESM module.

## Fix (minimal, keeps prerender working)

Edit `vite-plugin-prerender.ts`:

1. Add `statSync` to the existing top-level import:
   ```ts
   import { writeFileSync, mkdirSync, existsSync, readFileSync, statSync } from "fs";
   ```
2. Replace `const stat = require("fs").statSync(filePath);` with `const stat = statSync(filePath);`.
3. Audit the file for any other `require(...)` calls and convert them to static ESM imports (none expected besides the one above; `puppeteer` and `http` are already dynamic `await import(...)` which is fine inside ESM).

That single change unblocks `vite.config.ts` evaluation, the build completes, and the deployed site stops throwing.

## Verification before declaring done

1. Run a production build locally / in preview and confirm no "Dynamic require" error.
2. Load `https://mrcap1.com/` and one deep route (e.g. `/discography`) — both must return real HTML, not the error page.
3. Re-run the 5-route curl diff (`/`, `/discography`, `/who-is-mr-cap`, `/booking`, `/art-of-ism`) to confirm prerender still produces per-route title / description / canonical.

## Fallback (only if step 1 still fails)

If for any reason the build still errors after the `require` fix, temporarily remove the `prerender({...})` entry from `vite.config.ts` plugins array and ship without prerender to restore the site. We can reinstate it in a follow-up once the build is green. Site uptime takes priority over the per-route prerender feature.
