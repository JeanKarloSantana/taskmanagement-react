# Setup From Scratch

Use this guide when:
- Creating a **new feature** with clean architecture from the ground up
- Adding clean architecture to an **existing feature** that doesn't have it yet

This creates a **module** (business logic: domain, application, infrastructure, optional state) and a **feature folder** (presentation layer: pages, components, view models, routes).

---

## Step 1: Identify the Module and Feature Names

Get both names from the user before proceeding:

- **Module name** — the business domain name used for `modules/<module-name>/` (e.g., `countries`, `accounts`, `transfers`)
- **Feature name** — the UI feature name used for `features/<feature-name>/` (e.g., `account-origination`, `transfers`, `user-profile`)

These can be the same (e.g., both `transfers`) or different when a module serves multiple UI features.

---

## Step 2: Create the Folder Structure

> **Reference:** See [layers-overview.md](layers-overview.md#folder-structure-convention) for the complete folder structure template and what belongs in each layer.

Create both the module and feature folders:

```
modules/<module-name>/
├── domain/
│   ├── entities/
│   └── repositories/
├── application/
│   └── use-cases/
├── infrastructure/
│   ├── contracts/
│   ├── mappers/
│   └── repositories/
└── index.ts

features/<feature-name>/
├── pages/
├── components/
├── view-models/
├── mappers/
└── <feature-name>.routes.ts
```

Add `state/` inside the module only if this entity data will be shared across multiple features in the same session.

---

## Step 3: Create Module Barrel Export

Create **one** `index.ts` at the **module root** that exports the module's public API:

```typescript
// modules/<module-name>/index.ts

// Domain Layer
export * from './domain/entities/country';
export * from './domain/repositories/country.repository';

// Application Layer
export * from './application/use-cases/get-countries.use-case';

// Infrastructure Layer
export * from './infrastructure/repositories/country-concrete.repository';
export * from './infrastructure/contracts/country.response';
export * from './infrastructure/mappers/country.mapper';

// State Layer (if applicable)
// export * from './state/country.facade';
```

When adding new files, place exports under the corresponding layer comment. The feature folder (presentation) is not exported from the module — it consumes the module, it doesn't expose it.

---

## Step 4: Create Entry Component and Wire Dependencies

Create the feature's home page and routes file. **Confirm the feature name with the user** before generating.

> **Framework:** Routing syntax, lazy loading, and DI wiring syntax are framework-specific. Consult your framework skill (e.g., `angular-developer`) for the exact implementation.

**Routes file** — `features/<feature-name>/<feature-name>.routes.ts`:

This file has two responsibilities:
1. **Register providers** — bind abstract repositories (domain) to concrete implementations (infrastructure) and register use cases
2. **Lazily load** the home page component

```
// Pseudocode — consult your framework skill for syntax
routes = [
  {
    path: '',
    lazyLoad: () => import('./pages/<feature-name>-page.component'),
    providers: [
      { bind: CountryRepository, to: CountryConcreteRepository },
      GetCountriesUseCase,
    ],
  },
];
```

**Home page component** — `features/<feature-name>/pages/<feature-name>-page.component.ts`:

The home page component is lazily loaded via the route. Additional pages added later inherit providers from the route and do not re-declare them.

---

## Step 5: Verify Structure and Wiring

**Confirm the folder structure has been created correctly:**

- [ ] `modules/<module-name>/domain/entities/` and `domain/repositories/` exist
- [ ] `modules/<module-name>/application/use-cases/` exists
- [ ] `modules/<module-name>/infrastructure/contracts/`, `mappers/`, and `repositories/` exist
- [ ] `modules/<module-name>/index.ts` barrel export created
- [ ] `features/<feature-name>/pages/`, `components/`, `view-models/`, and `mappers/` exist
- [ ] `features/<feature-name>/<feature-name>.routes.ts` created with providers wired from the module
- [ ] Home page component created at `features/<feature-name>/pages/<feature-name>-page.component.ts`

**Verify dependency flow:**

1. The component injects the **Use Case** (Application layer)
2. The Use Case injects the **Abstract Repository** (Domain layer)
3. The DI container resolves the abstract repository to the **Concrete Repository** (Infrastructure layer)

```
Component → inject(GetCountriesUseCase)
                    ↓
            inject(CountryRepository)  ← abstract
                    ↓
            DI resolves → CountryConcreteRepository (infrastructure)
```

> **Framework:** Consult your framework skill for the exact injection syntax.

---

## Checklist

- [ ] User intent clarified (new feature or add CA to existing)
- [ ] Module name and feature name confirmed with user
- [ ] Module folder structure created (`domain/`, `application/`, `infrastructure/`)
- [ ] Module `index.ts` barrel export created with layer comments
- [ ] Feature folder structure created (`pages/`, `components/`, `view-models/`, `mappers/`)
- [ ] Feature routes file created with providers wired from module
- [ ] Home page component created at `features/<feature-name>/pages/<feature-name>-page.component.ts`
- [ ] `state/` added to module only if entity data is shared across multiple features
- [ ] Build passes
