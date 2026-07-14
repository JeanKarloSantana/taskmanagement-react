# Layers Overview

Clean Architecture separates concerns into distinct layers. Dependencies **always point inward** — outer layers depend on inner layers, never the reverse.

The project is split into two areas:
- **Modules** (`modules/<module-name>/`) — own the business logic: Domain, Application, Infrastructure, and optionally State
- **Features** (`features/<feature-name>/`) — the Presentation layer; the feature folder itself contains pages, components, view models, and view mappers (no `presentation/` subfolder)

```
┌────────────────────────────────────────────────────────┐
│  features/<feature-name>/   (Presentation Layer)       │
│  (Pages, Components, View Models, View Mappers, Routes) │
├────────────────────────────────────────────────────────┤
│  modules/<module-name>/                                 │
│  ├── State Layer (optional)                             │
│  │   (Session Caching, State Management)                │
│  ├── Infrastructure Layer                               │
│  │   (HTTP, Contracts, Mappers, Concrete Repos)         │
│  ├── Application Layer                                  │
│  │   (Use Cases, Orchestration, Transforms)             │
│  └── Domain Layer (inner core)                          │
│      (Entities, Abstract Repositories, Value Objects)   │
└────────────────────────────────────────────────────────┘
```

---

## 1. Domain Layer (Inner Core)

**Purpose:** Pure business logic. No framework dependencies.

### Contains

- **Entities** — Rich TypeScript classes with constructors and state-mutation methods
- **Abstract Repositories** — Contracts (abstract classes) defining data operations
- **Value Objects** — Immutable types with business meaning (e.g., `Currency`, `PhoneNumber`)
- **Enums** — Business-level enumerations

### Rules

| Allowed | Forbidden |
|---|---|
| Pure TypeScript classes | Angular decorators (except `@Injectable` for abstract class DI) |
| Abstract classes | HTTP/Store/third-party imports |
| Business enums and constants | UI framework types (SelectItem, etc.) |
| Constructor + state methods | Direct dependency on infrastructure |

### Example

```typescript
// domain/entities/country.ts
export class Country {
  constructor(
    public readonly code: string,
    public readonly name: string,
  ) {}
}

// domain/repositories/country.repository.ts
import { Country } from '../entities/country';

export abstract class CountryRepository {
  abstract getAll(): Promise<Country[]>;
}
```

---

## 2. Application Layer (Middle)

**Purpose:** Orchestrate business logic. Coordinates repositories, applies business rules, transforms data for the UI.

### Contains

- **Use Case Services** — One class per business operation or group of related operations
- **Business Transformations** — Map domain entities to UI-friendly formats
- **Business Validations** — Rules that go beyond simple field validation
- **Orchestration** — Combine multiple repository calls

### Rules

| Allowed | Forbidden |
|---|---|
| Inject abstract repositories | Direct HTTP/Store access |
| Business filtering and sorting | DTO mapping (that's infrastructure) |
| Transform entities → UI formats | Framework-specific concerns |
| Combine multiple repo calls | Direct infrastructure imports |

> **Framework:** DI registration and injection syntax are framework-specific. Consult your framework skill (e.g., `angular-developer`).

### Example

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

## 3. Infrastructure Layer (Outer)

**Purpose:** Communicate with the outside world. Implements repository contracts using concrete technologies.

### Contains

- **Concrete Repositories** — Implementations of abstract repositories (`infrastructure/repositories/`)
- **Contracts** — Request/Response interfaces matching API shapes (`infrastructure/contracts/`)
- **Mappers** — Classes with static `toDomain` methods (`infrastructure/mappers/`)
- **API configuration** — Endpoints, headers, interceptors

### Rules

| Allowed | Forbidden |
|---|---|
| Extend abstract repositories | Business logic (filtering, validation) |
| HTTP calls via framework HTTP client | UI transformations |
| Response → Entity mapping via Mapper | Direct use from components |
| Error handling (network, parsing) | Exposing contracts outside this layer |

> **Framework:** HTTP client usage and DI registration are framework-specific. Consult your framework skill (e.g., `angular-developer`).

### Example

```typescript
// modules/<module-name>/infrastructure/contracts/country.response.ts
export interface CountryResponse {
  CTY_COUNTRY_CODE: string;
  CTY_COUNTRY_NAME: string;
}

// modules/<module-name>/infrastructure/mappers/country.mapper.ts
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

// modules/<module-name>/infrastructure/repositories/country-concrete.repository.ts
// HTTP client injected via your framework's DI — consult your framework skill
export class CountryConcreteRepository extends CountryRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async getAll(): Promise<Country[]> {
    const response = await this.httpClient.get(COUNTRY_ENDPOINT);
    return response.map((dto: CountryResponse) => CountryMapper.toDomain(dto));
  }
}
```

---

## 4. State Layer (Optional)

**Location:** `modules/<module-name>/state/`

**Purpose:** Session-scoped state management. Caches entity data so multiple features can access it without re-fetching within the same session.

### When to add

Only add when the same entity data is consumed by multiple features and re-fetching on each navigation would be wasteful. Not every module needs state.

### Contains

- **Store** — State container (NgRx, signals-based, or equivalent)
- **Actions** — Events that trigger state changes
- **Reducers/Updaters** — Pure functions that produce the new state
- **Selectors** — Queries into the state tree
- **Effects/Service** — Side effects that call the concrete repository and dispatch results into state
- **Facade** (optional) — Simplifies store interaction for the presentation layer

### Rules

| Allowed | Forbidden |
|---|---|
| Inject abstract repositories | Business logic |
| Dispatch actions, select state | Direct HTTP calls |
| State container registration (framework-specific) | UI transformations |

---

## 5. Feature Folder — Presentation Layer (Outermost)

**Location:** `features/<feature-name>/`

**Purpose:** Handle all UI concerns. The feature folder **is** the presentation layer — there is no `presentation/` subfolder. Pages, components, view models, view mappers, and the routes file all live here.

### Contains

- **Page Components** — Smart/container components that inject use cases and manage page-level state (`pages/`)
- **UI Components** — Dumb/presentational components that receive data via inputs and emit events via outputs (`components/`)
- **View Models** — Interfaces with only the properties the UI needs (`view-models/`)
- **View Mappers** — Classes with static `toViewModel` methods that convert domain entities → view models (`mappers/`)
- **Routes file** — `<feature-name>.routes.ts` — lazy-loaded route config that wires providers from the module
- **Forms** — Form setup, validation display, user input handling
- **UI State** — Loading flags, error messages, visibility toggles

### Rules

| Allowed | Forbidden |
|---|---|
| Angular components, directives, pipes | Direct HTTP/Store access |
| Inject Use Cases (Application layer) | Import from Infrastructure layer |
| Template logic (`@if`, `@for`) | Business logic (filtering, calculations) |
| Signal-based local state | DTO knowledge |
| Design system components (BHD DS) | Repository implementations |
| Form handling and validation display | Data mapping |

### Example

```typescript
// features/countries/pages/country-page.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { GetCountriesUseCase } from '@app/modules/countries';
import { CountryListComponent } from '../components/country-list.component';

// Providers wired in features/countries/countries.routes.ts — see setup-from-scratch.md Step 4
@Component({
  selector: 'app-country-page',
  standalone: true,
  imports: [CountryListComponent],
  template: `
    @if (loading()) {
      <p>Cargando...</p>
    } @else {
      <app-country-list [countries]="countries()" />
    }
  `,
})
export class CountryPageComponent implements OnInit {
  private readonly getCountriesUseCase = inject(GetCountriesUseCase);

  countries = signal<Country[]>([]);
  loading = signal(true);

  async ngOnInit() {
    this.countries.set(await this.getCountriesUseCase.execute());
    this.loading.set(false);
  }
}
```

```typescript
// features/countries/components/country-list.component.ts
import { Component, input } from '@angular/core';
import { Country } from '@app/modules/countries';

@Component({
  selector: 'app-country-list',
  standalone: true,
  template: `
    @for (country of countries(); track country.code) {
      <div>{{ country.name }}</div>
    }
  `,
})
export class CountryListComponent {
  countries = input.required<Country[]>();
}
```

### Smart vs Dumb Components

| Type | Responsibility | Injects Use Cases? |
|---|---|---|
| **Page (Smart)** | Fetches data, manages state, wires providers | Yes |
| **UI (Dumb)** | Renders data, emits user events | No — receives via props/inputs |

**Rule of thumb:** Only page/container components inject use cases. Child components receive data via inputs and communicate back via outputs.

---

## Folder Structure Convention

Business logic lives in modules; presentation lives in features:

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
├── state/             ← optional
└── index.ts

features/<feature-name>/    ← IS the Presentation Layer
├── pages/
├── components/
├── view-models/
├── mappers/
└── <feature-name>.routes.ts
```

**Key points:**
- Module's `index.ts` exports the domain, application, and infrastructure public API
- Feature folder imports from the module via `@app/modules/<module-name>`
- Providers are wired in `<feature-name>.routes.ts` using route-level DI
- Contracts are flat inside `contracts/`: `contracts/<entity-name>.response.ts`
- `state/` is optional — only add when multiple features share the same entity data in a session

---

## Dependency Flow

```
Presentation (Component) → UseCaseService (Application) → AbstractRepository (Domain)
                                                                   ↑
                                                      ConcreteService (Infrastructure) implements it
```

The DI container wires abstract repositories to concrete implementations at the route or component level. See [setup-from-scratch.md](setup-from-scratch.md#step-4-create-entry-component-and-wire-dependencies) for wiring patterns. Consult your framework skill for the exact DI syntax.

Presentation components **never** import from Infrastructure directly. They only interact with Application layer services.
