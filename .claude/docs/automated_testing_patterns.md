# Automated Testing Patterns

Conventions used consistently across the `tests/` directory.

**Framework:** Jest 29 + ts-jest + jsdom  
**Config:** `jest.config.js`  
**Coverage scope:** `src/features/**/*` and `src/lib/**/*`

---

## Test Organization

Tests live in `tests/` and mirror the `src/` structure:

```
tests/
  data-access/       # Repository, UoW, database tests
  gear/              # Gear feature tests
  npcs/              # NPC feature tests
  pcs/               # Player character tests
  helpers/           # Shared test utilities
  data/json/         # Seed JSON data for tests
```

Naming: `<feature-name>.test.ts`

---

## Arrange-Act-Assert (with explicit comments)

Every test uses explicit `// Arrange`, `// Act`, `// Assert` comments — even for trivial cases.

```typescript
it("dispatching an event triggers a callback", () => {
    // Arrange
    const event = new AppEvent("test-event");
    let wasCaught = false;
    EventBus.instance.register("test-event", () => { wasCaught = true; });

    // Act
    EventBus.instance.dispatch(event);

    // Assert
    expect(wasCaught).toBe(true);
});
```

Reference: `tests/event-bus.test.ts:19-36`

---

## Integration Test Setup (Real Database)

Feature tests use a real in-memory seeded database — no mocking of the data layer.

**Helper:** `tests/data-access/data-access-utils.ts`  
`DataAccessUtils.getInitializedDbContext()` creates a `SeedableJsonDatabase` backed by `window.localStorage` and populates it from `tests/data/json/database.json`.

**Standard `beforeEach`/`afterEach` pattern:**
```typescript
beforeEach(async () => {
    DataAccessUtils.clearLocalStorage();
    const dbContext = await DataAccessUtils.getInitializedDbContext();
    unitOfWork = new UnitOfWork(dbContext);
    feature = new MyFeature(unitOfWork);
});

afterEach(async () => {
    DatabaseTestUtils.resetDatabaseEntityCollection(unitOfWork.repo(MyEntity), largestSeedId);
    await unitOfWork.saveChanges();
});
```

`resetDatabaseEntityCollection` removes any entities added during the test (those with `id > largestSeedId`). Reference: `tests/helpers/database-test-utils.ts:5-19`

---

## Feature Test Pattern

All feature handler tests follow the same structure:

1. Create a request object
2. Call `feature.handle(request)` or `await feature.handleAsync(request)`
3. Assert on the returned `Result<T>`

```typescript
const request = new GetGearByIdRequest(1, EquipmentItem.gearCategory);
const result = await feature.handleAsync(request);

expect(result.isSuccess).toBe(true);
expect(result.value?.name).toBe("Assorted Tools");
```

---

## Parametrized Tests (`it.each`)

Use `it.each()` for data-driven cases instead of duplicating test bodies.

```typescript
it.each([
    [0, "0cr"],
    [1000, "1kcr"],
    [1000000, "1Mcr"],
])("abbreviate %i returns %s", (value: number, expected: string) => {
    // Arrange
    // Act
    const result = CreditsAbbreviator.instance.abbreviate(value);
    // Assert
    expect(result).toBe(expected);
});
```

Reference: `tests/credits-abbreviator.test.ts:4-33`

Also used for invalid-input validation: `tests/gear/save-custom-armor-item-feature.test.ts:144-166`

---

## Shared Assertion Helpers

Reusable helpers avoid duplicating multi-property assertions:

**`tests/helpers/assert-utils.ts`** — `AssertUtils.expectResultToBeFailure(result)` — checks `isFailure` and that `error` is populated

**`tests/gear/gear-test-utils.ts`** — `GearTestUtils.getGearItemByName(list, name)` and `GearTestUtils.expectItemToBe(item, ...props)` for asserting multiple gear fields at once

**`tests/npcs/npc-test-utils.ts`** — `NpcTestUtils.getNpcItemByName()` and `NpcTestUtils.expectNpcToBe()`

---

## Mock Pattern

Mocking is used **only** for `window`/global object properties that can't be set directly. Real implementations are always preferred.

```typescript
jest.spyOn(window, "location", "get").mockReturnValue({ href: url } as any);
```

Reference: `tests/path-service.test.ts:42-46`

For property getters that need to throw: `jest.spyOn(request, "formFields", "get").mockImplementation(() => { throw new Error("..."); })` — reference: `tests/gear/save-custom-armor-item-feature.test.ts:44-46`

---

## Singleton Instance Testing

Services with a singleton pattern are accessed via `.instance` in tests (not constructed):

```typescript
EventBus.instance.dispatch(event);
LocalizationService.instance.translate(key);
CreditsAbbreviator.instance.abbreviate(value);
```

No special setup is needed; the singleton initializes on first access.

---

## Test Data Utilities

**`tests/helpers/value-utils.ts`** — `getRandomCharacter()`, `getStringOfRandomCharacters(length)` for generating arbitrary string inputs (e.g., for boundary/overflow tests)
