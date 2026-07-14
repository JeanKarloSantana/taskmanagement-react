# Entity Creation Guide

When the user wants to create a new entity, follow this workflow to gather information, scaffold files, and wire all layers.

---

## Workflow: Information Gathering

Before creating any files, follow these steps:

### 1. Ask the user for entity information

Ask the user:
- **Entity name** (e.g., `Country`, `AccountPurpose`, `PayrollCompany`)
- **Properties** — name and type of each field
- **Repository methods** — what operations does this entity need? (e.g., getAll, getById, create)
- **API details** — endpoint, HTTP method, request/response shape
- **Target page** — which presentation page will consume this entity?

### 2. Handle missing information

- **If the user provides an existing interface/service:** Analyze it, extract as much information as possible (properties, API shape, methods). If anything is still unclear, ask before proceeding.
- **If the user says "I don't have it yet":** Create template files with `// TODO:` placeholders so the user can fill in details later.
- **If this is a refactor/migration:** Do NOT ask for methods — infer them from the existing code. Only ask if something is ambiguous.

---

## Step 1: Domain Entity (Rich Entity)

Create in `domain/entities/<entity-name>.ts`.

Entities are **not plain interfaces** — they are **rich classes** with a constructor and methods to modify their state when applicable.

```typescript
// domain/entities/country.ts
export class Country {
  constructor(
    public readonly code: string,
    public readonly name: string,
  ) {}
}
```

For entities with mutable state:

```typescript
// domain/entities/account.ts
export class Account {
  constructor(
    public readonly id: string,
    public readonly productNumber: string,
    private _alias: string,
    private _balance: number,
    public readonly currency: string,
    public readonly type: string,
  ) {}

  get alias(): string {
    return this._alias;
  }

  get balance(): number {
    return this._balance;
  }

  updateAlias(newAlias: string): void {
    this._alias = newAlias;
  }

  canWithdraw(amount: number): boolean {
    return amount > 0 && amount <= this._balance;
  }
}
```

**Rules:**
- Use `readonly` for immutable properties
- Use private fields with getters for mutable state
- Add state-mutation methods when the business requires it
- If the entity is purely read-only (e.g., a catalog like Country), a simple class with readonly constructor params is fine
- No Angular decorators, no framework imports
- **Do NOT create a domain entity class if the object is only built to send data to an API and is never read back or reused.** In that case, define an input interface in the domain (e.g., `AccountApplicantSubmission`) and let the infrastructure mapper translate it directly to the API request. The abstract repository accepts the domain interface, and the concrete repository + mapper handle the API shape. This avoids dead-end data-shuttle classes with zero behavior.

---

## Step 2: Abstract Repository

Create in `domain/repositories/<entity-name>.repository.ts`. Always an **abstract class**.

```typescript
// domain/repositories/country.repository.ts
import { Country } from '../entities/country';

export abstract class CountryRepository {
  abstract getAll(): Promise<Country[]>;
}
```

**Common method signatures:**
- `getAll(): Promise<T[]>`
- `getById(id: string): Promise<T>`
- `create(entity: T): Promise<T>`
- `update(entity: T): Promise<T>`
- `delete(id: string): Promise<void>`

Only define methods the user has specified or that the existing code already uses.

---

## Step 3: Infrastructure Contracts (Request/Response)

Create in `infrastructure/contracts/`.

### Response — always required for HTTP methods

```typescript
// infrastructure/contracts/country.response.ts
export interface CountryResponse {
  CTY_COUNTRY_CODE: string;
  CTY_COUNTRY_NAME: string;
}
```

### Request — only when the API needs a non-primitive body

```typescript
// infrastructure/contracts/account.request.ts
export interface CreateAccountRequest {
  documentNumber: string;
  email: string;
  phone: string;
  accountPurpose: string;
}
```

**When to skip the request file:**
- The API method only takes a single primitive parameter (e.g., `getById(id: string)`)

**If the user cannot provide the response shape**, ask: _"Do you want to provide the response fields, or should I create a template?"_ If template, use:

```typescript
// infrastructure/contracts/country.response.ts
export interface CountryResponse {
  // TODO: Add API response fields here
  id: string;
  name: string;
}
```

---

## Step 4: Infrastructure Mapper

Create in `infrastructure/mappers/<entity-name>.mapper.ts`.

The mapper is a **class with a static `toDomain` method** that takes the response and builds the domain entity.

```typescript
// infrastructure/mappers/country.mapper.ts
import { Country } from '../../domain/entities/country';
import { CountryResponse } from '../contracts/country.response';

export class CountryMapper {
  static toDomain(response: CountryResponse): Country {
    return new Country(
      response.CTY_COUNTRY_CODE,
      response.CTY_COUNTRY_NAME,
    );
  }
}
```

For entities with mutable state:

```typescript
// infrastructure/mappers/account.mapper.ts
import { Account } from '../../domain/entities/account';
import { AccountResponse } from '../contracts/account.response';

export class AccountMapper {
  static toDomain(response: AccountResponse): Account {
    return new Account(
      response.accountId,
      response.productNo,
      response.accountAlias || response.productNo,
      response.availableBalance,
      response.currencyCode,
      response.accountType,
    );
  }
}
```

---

## Step 5: Concrete Repository (Infrastructure)

Create in `infrastructure/repositories/<entity-name>-concrete.repository.ts`.

This extends the abstract repository and uses the mapper. The HTTP call lives here.

> **Framework:** HTTP client injection and DI registration are framework-specific. Consult your framework skill (e.g., `angular-developer`) for the exact syntax.

```typescript
// modules/<module-name>/infrastructure/repositories/country-concrete.repository.ts
export class CountryConcreteRepository extends CountryRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async getAll(): Promise<Country[]> {
    // Use your framework's HTTP client — consult your framework skill
    const response = await this.httpClient.get(COUNTRY_ENDPOINT);
    return response.map((dto: CountryResponse) => CountryMapper.toDomain(dto));
  }
}
```

**Rules:**
- Do not register with DI here — wiring is done at the feature route level
- Use the mapper's static `toDomain` — never map inline
- Only add methods the user specified or that existing code requires
- If this is a scaffold/refactor with no explicit methods, create the class with the abstract methods implemented as `// TODO:` stubs

---

## Step 6: Application Use Case

Create in `application/use-cases/<entity-name>.use-case.ts`.

**Naming convention based on the operation:**

| HTTP Method | Operation | File Name Example |
|---|---|---|
| GET (list) | Query/fetch | `get-countries.use-case.ts` |
| GET (single) | Query by ID | `get-country-by-id.use-case.ts` |
| POST (create) | Create new | `create-account.use-case.ts` |
| PUT/PATCH | Update/activate | `update-account.use-case.ts` |
| DELETE | Remove | `delete-account.use-case.ts` |
| Multiple ops | Group related | `country.use-case.ts` |

> **Framework:** DI registration and injection syntax are framework-specific. Consult your framework skill (e.g., `angular-developer`).

```typescript
// modules/<module-name>/application/use-cases/get-countries.use-case.ts
export class GetCountriesUseCase {
  constructor(private readonly countryRepository: CountryRepository) {}

  async execute(): Promise<Country[]> {
    const countries = await this.countryRepository.getAll();
    return this.sortByName(countries);
  }

  private sortByName(countries: Country[]): Country[] {
    return [...countries].sort((a, b) => a.name.localeCompare(b.name));
  }
}
```

---

## Step 7: View Model

Create in `features/<feature-name>/view-models/<entity-name>.view-model.ts`.

The view model contains **only the properties the page needs to display**. This decouples the UI from the full domain entity.

```typescript
// features/<feature-name>/view-models/country.view-model.ts
export interface CountryViewModel {
  code: string;
  name: string;
}
```

For entities where only a subset is needed:

```typescript
// features/<feature-name>/view-models/account.view-model.ts
export interface AccountViewModel {
  productNumber: string;
  alias: string;
  formattedBalance: string;
}
```

If the view model is identical to the entity (all properties are needed), you can skip this step and use the domain entity directly in the page.

---

## Step 8: View Mapper

Create in `features/<feature-name>/mappers/<entity-name>-view.mapper.ts`.

The view mapper converts **domain entities → view models**. This is the counterpart to the infrastructure mapper (which converts contracts → domain). The view mapper lives in the feature folder (presentation layer) because it knows about view model shapes.

```typescript
// features/<feature-name>/mappers/country-view.mapper.ts
import { Country } from '@app/modules/countries';
import { SelectViewModel } from '../view-models/select.view-model';

export class CountryViewMapper {
  static toViewModel(countries: Country[]): SelectViewModel[] {
    return countries.map((country) => ({
      keyValue: { key: country.code, value: country.name }
    }));
  }
}
```

**Rules:**
- Static methods only (like infrastructure mappers)
- Named `<entity-name>-view.mapper.ts` to distinguish from infrastructure mapper
- Can map to shared view models (e.g., `SelectViewModel`) or entity-specific ones
- If the view model is identical to the domain entity, skip the view mapper

---

## Step 9: Presentation Page

The page component is the **smart component**. It:
1. Injects the use case (providers are wired in `<feature-name>.routes.ts`, not the component)
2. Calls the use case in `ngOnInit` and **maps the result through the view mapper** before assigning it to the component property
3. Passes the mapped data to child (dumb) components via inputs

If the user provides the page, use that. If this is a refactor, determine the page from the existing code. Otherwise, ask the user or skip.

> **Framework:** Component creation, routing, and DI wiring syntax are framework-specific. Consult your framework skill (e.g., `angular-developer`) for the exact implementation.

**Routes file** — `features/<feature-name>/<feature-name>.routes.ts`:
```
// Pseudocode — consult your framework skill for syntax
routes = [
  {
    path: '',
    lazyLoad: () => import('./pages/country-page.component'),
    providers: [
      { bind: CountryRepository, to: CountryConcreteRepository },
      GetCountriesUseCase,
    ],
  },
];
```

**Page component** — `features/<feature-name>/pages/country-page.component.ts`:
```typescript
// Component creation is framework-specific — consult your framework skill
// Logic pattern (framework-agnostic):
export class CountryPageComponent {
  // Injected at route level — consult framework skill for injection syntax
  private readonly getCountriesUseCase: GetCountriesUseCase;

  public countryList: SelectOption[] = [];

  onInit(): void {
    this.getCountriesUseCase
      .execute()
      .then((countries) => {
        this.countryList = CountryViewMapper.toViewModel(countries).map((c) => c.keyValue);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });
  }
}
```

**Key pattern:** The use case returns domain entities. The page **always** maps them through the view mapper before assigning to a component property. The dumb component only receives the view model shape — never domain entities.

When multiple use cases are needed on the same page, use `Promise.all`:

```typescript
ngOnInit(): void {
  Promise.all([
    this.getCountriesUseCase.execute().then((countries) => {
      this.countryList = CountryViewMapper.toViewModel(countries).map((c) => c.keyValue);
    }),
    this.getCitiesUseCase.execute().then((cities) => {
      this.cityList = CityViewMapper.toViewModel(cities).map((c) => c.keyValue);
    }),
  ])
    .catch((error) => {
      console.error('Error fetching form data:', error);
    })
    .finally(() => {
      // Update UI state (hide loading, mark form ready, etc.)
    });
}
```

---

## Step 10: Update Module Barrel Export

Add the new entity's exports to the **module's** `index.ts`. Place exports under the corresponding layer comment:

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
```

The feature folder (presentation) is not exported from the module index. View models, view mappers, and page components live in `features/<feature-name>/` and are consumed directly by templates and routes.

If the `index.ts` doesn't exist yet, see [setup-from-scratch.md](setup-from-scratch.md#step-3-create-module-barrel-export) for the initial setup.

---

## Folder Structure Summary

```
modules/<module-name>/
├── domain/
│   ├── entities/
│   │   └── <entity-name>.ts              ← Rich class with constructor
│   └── repositories/
│       └── <entity-name>.repository.ts    ← Abstract class
├── application/
│   └── use-cases/
│       └── get-<entity-name>.use-case.ts  ← Named by operation
├── infrastructure/
│   ├── contracts/
│   │   ├── <entity-name>.response.ts  ← API response shape
│   │   └── <entity-name>.request.ts   ← Only if non-primitive body
│   ├── mappers/
│   │   └── <entity-name>.mapper.ts        ← Static toDomain method
│   └── repositories/
│       └── <entity-name>-concrete.repository.ts
├── state/                                 ← Optional: cross-feature caching
└── index.ts                               ← Module public API

features/<feature-name>/                   ← Presentation Layer
├── pages/
│   └── <page-name>.component.ts           ← Smart: injects use case
├── components/
│   └── <component-name>.component.ts      ← Dumb: inputs/outputs only
├── view-models/
│   └── <entity-name>.view-model.ts        ← UI-only properties
├── mappers/
│   └── <entity-name>-view.mapper.ts       ← Static toViewModel method
└── <feature-name>.routes.ts               ← Lazy-loaded routes + providers
```

---

## Quick Reference: File Naming

| Layer | File | Naming Pattern |
|---|---|---|
| Domain | Entity | `<name>.ts` (class) |
| Domain | Repository | `<name>.repository.ts` (abstract class) |
| Infrastructure | Response | `<name>.response.ts` |
| Infrastructure | Request | `<name>.request.ts` (optional) |
| Infrastructure | Mapper | `<name>.mapper.ts` (class, static toDomain) |
| Infrastructure | Concrete Repo | `<name>-concrete.repository.ts` |
| Application | Use Case | `get-<name>.use-case.ts` / `create-<name>.use-case.ts` |
| Feature (Presentation) | View Model | `<name>.view-model.ts` |
| Feature (Presentation) | View Mapper | `<name>-view.mapper.ts` (class, static toViewModel) |
| Feature (Presentation) | Page | `<page-name>.component.ts` |
| Feature (Presentation) | Routes | `<feature-name>.routes.ts` |

---

## Checklist

- [ ] Information gathered (entity properties, methods, API details)
- [ ] Domain entity class created (rich, with constructor)
- [ ] Abstract repository created
- [ ] Infrastructure response contract created
- [ ] Infrastructure request contract created (if needed)
- [ ] Mapper class created with static `toDomain`
- [ ] Concrete repository created (extends abstract, uses mapper)
- [ ] Use case created (named by operation)
- [ ] View model created in `features/<feature-name>/view-models/` (if subset of entity needed)
- [ ] View mapper created in `features/<feature-name>/mappers/` (if view model differs from entity)
- [ ] Page component created in `features/<feature-name>/pages/`, injects use case (no providers)
- [ ] Providers wired in `features/<feature-name>/<feature-name>.routes.ts`
- [ ] Module barrel export updated (`modules/<module-name>/index.ts`)
- [ ] Build passes
