---
applyTo: '**'
---

# ChurchTools Extension Boilerplate

This repository is a small pnpm/Turborepo starter for ChurchTools extensions.

- Extensions live in `extensions/*` and are Vue 3 + TypeScript + Vite apps.
- Shared packages live in `packages/*` and should be imported through workspace dependencies.
- Prefer `@churchtools-extensions/prime-volt` UI components over importing PrimeVue components directly.
- Use `@churchtools-extensions/ct-utils` and `@churchtools-extensions/persistance` for ChurchTools API / Custom Module storage.
- Use `<script setup>` in Vue components and keep TypeScript strict.
