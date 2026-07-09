# ChurchTools Extension Boilerplate

A small starter monorepo for building [ChurchTools](https://church.tools/) extensions with Vue 3, TypeScript, Vite, Tailwind CSS, PrimeVue/Volt components, and reusable ChurchTools helper packages.

It contains one working demo extension and the shared packages that are useful for most extensions.

## Quick start

```bash
pnpm install
pnpm dev --filter ct-demo-extension
```

Open the Vite URL from the terminal. The demo also works outside ChurchTools for UI development.

For local development against a real ChurchTools instance, copy the demo env file and fill in your instance URL/login:

```bash
cp extensions/demo-extension/.env.example extensions/demo-extension/.env.development.local
```

If you need HTTPS locally, create certificates as described in [docs/local-https.md](./docs/local-https.md).

## What is included

```text
churchtools-extension-boilderplate-bothomas/
├── extensions/
│   └── demo-extension/       # Small working extension example
├── packages/
│   ├── build-tools/          # ZIP packaging, release helper, version-info Vite plugin
│   ├── ct-utils/             # ChurchTools client helpers and API types
│   ├── persistance/          # CRUD helper for Custom Module data categories
│   ├── prime-volt/           # Themed PrimeVue/Volt components
│   └── shared-styles/        # Tailwind, Prime icons, shared design tokens
├── docs/
│   ├── local-https.md
│   └── release.md
└── releases/                 # Created by package/release commands
```

## Common commands

```bash
# Run the demo extension
pnpm dev --filter ct-demo-extension

# Type-check everything
pnpm type-check

# Build everything
pnpm build

# Create an installable ZIP in releases/
pnpm --filter ct-demo-extension package

# Run the interactive release flow
pnpm release
```

## Create your own extension

1. Copy `extensions/demo-extension` to a new folder.
2. Change the package name in the copied `package.json`.
3. Set `VITE_KEY` in the copied `.env.development.local` and/or the fallback in `vite.config.ts`/`src/config.ts` to your ChurchTools extension key.
4. Keep `src/App.vue` as the small tab shell and replace `src/views/DemoView.vue` / `src/views/SettingsView.vue` with your feature pages.
5. Keep using the shared packages instead of re-creating setup code.

## Shared packages

| Package                                 | Why you want it                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------ |
| `@churchtools-extensions/build-tools`   | Adds `ct-package`, `ct-release`, and the `virtual:extension-info` Vite module. |
| `@churchtools-extensions/ct-utils`      | ChurchTools API types and Custom Module/KV helper functions.                   |
| `@churchtools-extensions/persistance`   | Simple CRUD wrapper for Custom Module data categories.                         |
| `@churchtools-extensions/prime-volt`    | Themed PrimeVue components for a consistent ChurchTools-like UI.               |
| `@churchtools-extensions/shared-styles` | Tailwind setup, Prime icons, and shared design tokens.                         |

## Release flow

The release tooling from the source project is kept. In short:

- `pnpm --filter ct-demo-extension package` builds one extension ZIP into `releases/`.
- `pnpm release` starts the interactive multi-extension release helper.

See [docs/release.md](./docs/release.md) for the details.
