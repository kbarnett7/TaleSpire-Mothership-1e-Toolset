# Architectural Patterns

Patterns that appear across multiple files in this codebase.

---

## Feature Handler Pattern

Business logic is encapsulated in feature classes with a single `handle()` or `handleAsync()` method. This is the primary pattern for all operations.

**Interfaces:**
- `src/lib/common/features/feature-interface.ts` — `IFeature<TRequest, TResponse>`
- `src/lib/common/features/async-feature-interface.ts` — `IAsyncFeature<TRequest, TResponse>`
- `src/lib/common/features/empty-request.ts` — marker class for no-argument features

**Conventions:**
- Each feature lives in its own directory under `src/features/<domain>/<feature-name>/`
- The directory contains the feature class, a request class, and (if needed) a response class
- Sync features for pure computation; async for anything touching the database
- Dependencies are injected via constructor; the feature declares them with `static inject`

**Examples:**
- `src/features/gear/get-all-gear/get-all-gear-feature.ts`
- `src/features/npcs/get-all-npcs/get-all-npcs-feature.ts`
- `src/features/gear/filter-gear-list/filter-gear-list-feature.ts`

**Base classes** in `src/lib/common/features/` provide reusable logic for common operations:
- `FilterListFeature` — regex search across list items
- `SortListFeature` — field-based sorting with direction
- `SaveDbEntityFeature` — validation + persist pattern

---

## Repository + Unit of Work

All database access goes through a `UnitOfWork` which vends typed `IRepository<T>` instances. A single `saveChanges()` call persists all changes.

**Files:**
- `src/lib/data-access/unit-of-work.ts` — `UnitOfWork.repo(Type)` returns `IRepository<T>`; `saveChanges()` flushes to storage
- `src/lib/data-access/base-repository.ts` — CRUD: `list()`, `first(predicate)`, `add()`, `update()`, `remove()`
- `src/lib/common/data-access/repository-interface.ts` — `IRepository<T>` interface

**Usage pattern in features:**
```
const items = unitOfWork.repo(WeaponItem).list();
unitOfWork.repo(WeaponItem).add(newItem);
await unitOfWork.saveChanges();
```

---

## Dependency Injection

Uses `typed-inject` for constructor injection. All services declare their dependencies via a static `inject` property containing the token names.

**Registration:** `src/lib/infrastructure/app-injector.ts:14-22`

**Scopes:**
- `Scope.Singleton` — `AppSettings`, `BlobStorage`, `AppDatabaseContext`
- `Scope.Transient` — `UnitOfWork` (fresh instance per resolve)

**Declaring dependencies on a class:**
```typescript
export class MyFeature {
    public static inject = ["unitOfWork"] as const;
    constructor(private unitOfWork: IUnitOfWork) {}
}
```

---

## Result Pattern

Operations return `Result<T>` instead of throwing. Check `isSuccess`/`isFailure` before accessing `value` or `error`.

**File:** `src/lib/result/result.ts:18-52`

**Factory methods:**
- `Result.success(value?)` — wraps a successful value
- `Result.failure(ResultError)` — wraps an error; see `src/lib/result/result-error.ts`

**Error codes:** `src/lib/errors/error-code.ts`

---

## Event Bus

Components communicate by dispatching and listening to typed events through a global singleton event bus. This avoids direct component-to-component coupling.

**File:** `src/lib/events/event-bus.ts:11`

**API:** `EventBus.instance.register(type, callback)` / `unregister()` / `dispatch(event)`

**Base event:** `src/lib/events/app-event.ts`

**Convention:** Always call `unregister` in the component's cleanup/disconnectedCallback to avoid memory leaks. Event types live alongside their domain (e.g., `src/features/gear/` contains gear-related events).

---

## DTO + Mapper Pattern

Form data is captured in DTO classes with all-string fields (preserving raw input). Static mapper classes convert DTOs to domain objects, handling type coercion.

**DTOs (string fields, default values):**
- `src/features/gear/weapon-item-form-fields-dto.ts`
- `src/features/gear/armor-item-form-fields-dto.ts`
- `src/features/npcs/npc-form-fields-dto.ts`

**Mappers (static `fromFormFields()` method):**
- `src/features/gear/weapon-item-map.ts`
- `src/features/gear/gear-list-item-map.ts`
- `src/features/npcs/npc-map.ts`

---

## Fluent Validation Chain

Domain entities validate themselves via a chain of private methods that each return `this`. Errors accumulate in `validationResults` (inherited from base). The chain can also validate against the database (e.g., uniqueness checks).

**Example:** `src/features/gear/weapon-item.ts:49-55`
```typescript
public validate(unitOfWork: IUnitOfWork): string[] {
    super.validate(unitOfWork);
    this.validateCategory().validateRange().validateDamage()...;
    return this.validationResults;
}
```

NPC validation at `src/features/npcs/npc.ts:48-183` shows nested object validation (attacks, special abilities).

---

## Base Class Hierarchies

### Domain entities
- `src/lib/common/features/database-entity.ts` — `id` + `generateId()` + `validationResults`
- `src/features/gear/equipment-item.ts` — base gear with `name`, `cost`, `description`, `validate()`
- `src/features/gear/weapon-item.ts` / `armor-item.ts` — extend `EquipmentItem`

### Web Components
- `src/components/base.component.ts` — attaches Shadow DOM, renders templates, rewires `this.` callbacks via `window` namespace
- `src/components/pages/base-page.component.ts` — extends `BaseComponent`; waits for app initialization before rendering

---

## Singleton Services

Services that should have a single app-wide instance use the private constructor + static `instance` getter pattern.

**Examples:**
- `src/lib/events/event-bus.ts:11-33`
- `src/lib/logging/app-logger.ts`
- `src/lib/services/styles-service.ts`
- `src/features/sources/sources-service.ts`

---

## AppDatabaseContext (Entity Framework-inspired)

Central context mapping entity types to database collection names. All entity types must be registered here.

**File:** `src/lib/data-access/app-database-context.ts`

When adding a new entity type, register it in `AppDatabaseContext` and add its collection name to `src/lib/data-access/database-collection-names.ts`.
