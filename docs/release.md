# Release flow

The boilerplate keeps the release helper from the original extension monorepo.

## Package one extension locally

```bash
pnpm --filter ct-demo-extension package
```

This builds the extension and writes a ZIP file to `releases/`.

## Prepare a release

```bash
pnpm release
```

The interactive release command discovers all packages under `extensions/*`, offers a version bump, builds/packages the selected extension, and creates git tags/releases when you confirm the prompts.

Release tags are extension-specific, so multiple extensions can live in the same repository later.
