# Aphelion

Single Vite + React + Three.js + TypeScript SPA (not a monorepo). Each scene is a self-contained feature folder under `src/features/`.

- Use Bun for dependencies and package scripts.
- Use `@/` for `src/`-relative imports.
- For review, diagnosis, or planning, inspect only. For implementation, preserve unrelated user changes.

## Scene Layout
- `src/features/<scene>/`: `index.tsx` composes the hooks and renders `SceneLayout`.
- `hooks/{init,animate,controls,hud}.ts`, usually `update.ts`, sometimes `reset`/`timeline`. `init` builds Three objects via `setupScene()` and returns its `dispose`; `update` reacts to params; `animate` runs per frame via `useSceneAnimation`.
- `utils/`: mesh and material factories, GLSL inside ShaderMaterial. `types/index.ts`: `SceneRef`, `SceneParams`.
- `constants/index.ts`: `SCENE_PARAMS` defaults and tuning values. Keep tuning values out of hooks and components.
- Register new scenes in `src/utils/scene/index.ts` (`SCENES`, lazy imports).
- Shared UI goes in `src/components/ui/`, app chrome in `src/components/app/`. Each component is `index.tsx` + `index.module.css` (one CSS Module per component).
- Shared logic lives in `src/hooks/`, `src/utils/`, and shared types in `src/types/index.ts`.

## Implementation
Treat additional code as a cost.
Smallest change that solves the actual task.
Follow existing patterns.
No hypothetical future requirements, no unrelated refactors, no wrapper/factory/dependency for a single use unless it removes concrete complexity today.
Small duplication beats premature abstraction.
Default, not absolute — if the task genuinely needs structure, build it and say why in one line.
Scope is the task, nothing more.
Worth doing but out of scope → mention it, don't implement it.
If the issue is ambiguous, follow existing convention.

## Defensive Programming
Trust internal TypeScript invariants. No assertions/guards/validation/fallbacks for states this codebase already controls, unless you can name the concrete failure prevented. Validate only at real trust boundaries: user input, network/API responses, persisted data, platform APIs. Handle errors only with a real recovery path — otherwise let them propagate. Don't invent recovery, don't swallow, don't build infra for it.

## TypeScript / React
Precise types over runtime checks — no `any`, no unnecessary assertions, no non-null assertions where the type can be modeled correctly. No state unless it affects render/behavior. No derived state duplication. No effect where derivation works. No memoization without a concrete problem.
Keep hot-path animation state in refs, not React state. Don't allocate Three objects in the per-frame loop when they can be updated in place. Dispose what you replace (geometry, material, render target). Follow existing hook patterns.

## Stopping
Implement, verify with checks, stop. Don't keep hardening or generalizing once it's done — note anything extra you noticed, don't build it.

## Before Finishing
Verify with `bun run build` and `bun run check` (Biome).
Keep `docs/TODO.md` updated: remove completed work and add newly identified remaining work.
Commit in small, feature-based Conventional Commits (`fix(wormhole): …`, `refactor: …`); no attribution trailers.
Cut from your own diff: unneeded abstractions, redundant guards, one-use helpers, speculative config, unrelated changes, obvious-code comments. Equal correctness → ship the smaller one.
