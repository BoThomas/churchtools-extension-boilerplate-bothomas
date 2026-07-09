# Demo Extension

This is the starter extension included with the boilerplate.

It demonstrates:

- Vue 3 `<script setup>` and TypeScript
- ChurchTools base URL/login wiring in `src/main.ts`
- shared Tailwind styles from `@churchtools-extensions/shared-styles`
- reusable UI components from `@churchtools-extensions/prime-volt`
- build metadata from `virtual:extension-info`

## Run it

```bash
pnpm install
pnpm dev --filter ct-demo-extension
```

## Configure it

The demo falls back to `demoextension` when no `VITE_KEY` is set. For local ChurchTools API access, copy `.env.example` to `.env.development.local` and fill in your ChurchTools URL, credentials, and extension key.

## Package it

```bash
pnpm --filter ct-demo-extension package
```

The ZIP is written to the root `releases/` folder.
