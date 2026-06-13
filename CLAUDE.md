# TaleSpire Mothership 1e Toolset

An unofficial TaleSpire Symbiote that recreates the Mothership 1e TTRPG character sheet inside TaleSpire's embedded browser. Built as a TypeScript single-page app using native Web Components.

## Tech Stack

- **Language:** TypeScript 5.8 (strict mode) — `tsconfig.json`
- **Bundler:** Webpack 5 — `webpack.config.js`
- **Styling:** Tailwind CSS 4 + PostCSS — `postcss.config.js`
- **Testing:** Jest 29 + ts-jest + jsdom — `jest.config.js`
- **Dependency Injection:** `typed-inject` — `src/lib/infrastructure/app-injector.ts`
- **UI:** Native Web Components (Shadow DOM) — no framework

## Key Directories

| Path | Purpose |
|------|---------|
| `src/components/` | Web Component UI elements (Shadow DOM) |
| `src/features/` | Business logic using the Feature Handler pattern |
| `src/lib/` | Infrastructure: DI container, data access, event bus, services |
| `src/lib/infrastructure/` | App startup, DI registration (`app-injector.ts`) |
| `src/lib/data-access/` | Repository, Unit of Work, database context |
| `src/lib/events/` | Event bus for cross-component communication |
| `src/lib/talespire/` | Wrappers for the TaleSpire `TS.*` Symbiote API |
| `src/lib/result/` | `Result<T>` type for error handling |
| `src/database/json/` | JSON seed data loaded into IndexedDB at startup |
| `tests/` | Jest tests — mirrors `src/` structure |
| `build/` | Post-processor that converts absolute bundle paths to relative paths for TaleSpire compatibility (`talespire-bundle-updater.js`) |

## Essential Commands

```bash
npm run serve              # Dev server at http://localhost:4000
npm run build:talespire    # Production build + path post-processing for TaleSpire
npm test                   # Run Jest tests
npm run test:coverage      # Jest with coverage report (output: .coverage/)
```

See `package.json:7-12` for all scripts.

## Development Workflow

UI development and testing is done in a plain browser at `http://localhost:4000`. TaleSpire integration testing is done separately using `build:talespire`.

## TaleSpire Symbiote API

Any code that interacts with the TaleSpire `TS.*` message-passing API **must** go through the wrappers in `src/lib/talespire/`. Do not call `TS.*` methods directly in components or features.

The `appsettings.json` `environment` field controls which blob storage implementation is used: `TaleSpireBlobStorage` in production, `BrowserBlobStorage` in development — see `src/lib/infrastructure/app-injector.ts:12`.

## Additional Documentation

When working in these areas, check the relevant doc:

- **[Architectural Patterns](.claude/docs/architectural_patterns.md)** — Feature Handler, Repository/UoW, DI, Result, Event Bus, DTO/Mapper, Validation, Base Classes
- **[Automated Testing Patterns](.claude/docs/automated_testing_patterns.md)** — AAA convention, integration test setup, parametrized tests, test helpers
