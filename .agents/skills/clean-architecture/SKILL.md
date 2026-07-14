---
name: clean-architecture
description: Implements Clean Architecture in projects. Trigger when creating domain entities, use cases, repositories, infrastructure services, wiring layers together, migrating existing features to clean architecture, or setting up clean architecture from scratch in an existing app.
---

# Clean Architecture for Angular

Guide for implementing Clean Architecture in applications. Business logic lives in **modules** (`modules/<module-name>/`); presentation lives in **features** (`features/<feature-name>/`).

> **Framework Skills:** This skill is framework-agnostic and covers architecture patterns only. For framework-specific implementation (DI registration, component creation, routing, HTTP clients), consult the skill for your framework (e.g., `angular-developer` for Angular).

## Before You Start

**Step 1: Clarify User Intent**

Determine which scenario applies:

1. **New feature with clean architecture** — Scaffolding a brand-new feature from scratch
2. **Add clean architecture to existing feature** — Migrating an existing feature without clean architecture
3. **Add entity to existing feature** — Extending a feature that already has clean architecture

**Step 2: Get the Feature Path**

If the user hasn't specified the feature location, ask for the path before proceeding.

**Step 3: Route to Appropriate Workflow**

- For scenarios 1 or 2 → Read [setup-from-scratch.md](references/setup-from-scratch.md)
- For scenario 3 → Read [entity-creation.md](references/entity-creation.md)

## Architecture Overview

Read [layers-overview.md](references/layers-overview.md) for the full explanation of:

- **Modules** (`modules/<module-name>/`) — Domain, Application, Infrastructure, and optional State layers
- **Features** (`features/<feature-name>/`) — the Presentation layer: pages, components, view models, view mappers (no `presentation/` subfolder)
- Dependency flow and the Dependency Inversion Principle
- What belongs in each layer (rules and boundaries)
- Smart vs Dumb components
- Folder structure conventions

## Setting Up Clean Architecture From Scratch

When adding clean architecture to a new or existing feature, read [setup-from-scratch.md](references/setup-from-scratch.md) for:

- Creating the module folder (`modules/<module-name>/`) with domain, application, infrastructure layers
- Creating the feature folder (`features/<feature-name>/`) as the presentation layer
- Setting up the module's single barrel export (`index.ts`) with layer-organized comments
- Wiring providers via lazy-loaded routes (preferred for Angular 20+)

## Creating a New Entity (Full Wiring)

When the user wants to create a new entity or resource, read [entity-creation.md](references/entity-creation.md) for:

- **Information-gathering workflow** — Ask the user for entity name, properties, and API endpoint before generating code
- Rich domain entity class with constructor
- Abstract repository contract
- Infrastructure contract (request/response interfaces matching API shape)
- Mapper class with static `toDomain` method
- Concrete repository implementation
- Application use case named by operation (get-, create-, update-)
- View model with UI-only properties
- View mapper class with static `toViewModel` method (domain → view model)
- Wiring via providers

## Migrating Existing Features

When moving an existing feature to clean architecture, read [migration-guide.md](references/migration-guide.md) for:

- Identifying coupling in existing services
- Extracting domain entities from existing DTOs
- Creating abstract repositories from concrete services
- Preserving backward compatibility during migration
- Step-by-step migration checklist

## Key Principles

1. **Dependency Rule** — Dependencies point inward. Domain knows nothing about Infrastructure or UI.
2. **Dependency Inversion** — Domain defines abstract repositories; Infrastructure implements them.
3. **Single Responsibility** — Each layer has one job:
   - Feature folder (Presentation): UI rendering, user interaction, local UI state
   - Application: orchestration, business logic, transformations
   - Infrastructure: external communication (HTTP, APIs)
   - Domain: business entities and contracts
   - State (optional): session-scoped caching to avoid redundant API calls
4. **Testability** — Domain and Application layers are unit-testable without mocking Angular or HTTP.
5. **Module Cohesion** — Each module owns its domain/application/infrastructure/state stack. Features (presentation) consume modules via the module's public `index.ts`.

## Decision Guide

| User Request | Action |
|---|---|
| "Set up clean architecture" / "New feature" | → [setup-from-scratch.md](references/setup-from-scratch.md) |
| "Create a new entity/resource" | → [entity-creation.md](references/entity-creation.md) |
| "Migrate this service/feature" | → [migration-guide.md](references/migration-guide.md) |
| "Explain the layers" | → [layers-overview.md](references/layers-overview.md) |
