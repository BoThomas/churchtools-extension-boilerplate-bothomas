# ChurchTools Extension Boilerplate

See `README.md` first for setup, commands, package purposes, extension-copy steps, and release docs.

## Project shape

- pnpm/Turborepo monorepo: apps in `extensions/*`, shared packages in `packages/*`.
- Extensions are Vue 3 + TypeScript + Vite apps; use `<script setup lang="ts">` for Vue components.
- Keep reusable ChurchTools logic in workspace packages instead of duplicating it in an extension.
- Import workspace packages by package name, not relative paths across package boundaries.

## Local conventions

- Prefer `@churchtools-extensions/prime-volt` components over direct PrimeVue component imports.
- Use `@churchtools-extensions/ct-utils` for ChurchTools API/KV helpers and `@churchtools-extensions/persistance` for Custom Module CRUD.
- Shared styling comes from `@churchtools-extensions/shared-styles`; avoid one-off global styling unless it belongs to a specific extension.
- Keep changes small and boilerplate-friendly: the demo extension should stay easy to copy.

## Useful checks

- `pnpm type-check` checks the workspace.
- `pnpm build` builds all packages/extensions.
- `pnpm --filter ct-demo-extension package` creates a demo ZIP in `releases/`.
