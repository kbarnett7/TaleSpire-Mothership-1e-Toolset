# Plan: Player Character List Page

## Context
The Characters page (`/`) is currently a placeholder stub. This plan implements a full player character (PC) list with filtering, sorting, CRUD, and a detail dialog — mirroring the NPC list pattern. User answers: PCs have only `name`, `characterClass`, `description` for now; class dropdown uses `custom-select` populated dynamically from DB; sortable by name + class only; create/edit uses a separate page route; all PCs are deletable (no sourceId concept); no source filter — just name search + class dropdown.

---

## Files to Modify

| File | Change |
|---|---|
| `src/features/player-characters/player-character.ts` | Add `validate()`, `saveToDatabase()`, `deleteFromDatabase()` |
| `src/components/pages/characters/characters.ts` | Convert to PC list page; listen for add-new button |
| `src/components/pages/characters/characters.html` | Layout: filter bar, list, add button |
| `src/components/player-characters/player-character-list/player-character-list.ts` | Full implementation |
| `src/components/player-characters/player-character-list/player-character-list.html` | Table + dialog element |
| `src/lib/pages/page-router-service.ts` | Add `playerCharacterPage` route |
| `src/lib/localization/message-keys.ts` | Add 3 PC message keys |
| `src/lib/localization/en.json` | Add 3 PC localization strings |

---

## Files to Create

### Features
- `src/features/player-characters/player-character-form-fields-dto.ts`
- `src/features/player-characters/player-character-map.ts`
- `src/features/player-characters/get-player-character-by-id/get-player-character-by-id-request.ts`
- `src/features/player-characters/get-player-character-by-id/get-player-character-by-id-feature.ts`
- `src/features/player-characters/filter-player-characters-list/filter-player-characters-list-request.ts`
- `src/features/player-characters/filter-player-characters-list/filter-player-characters-list-feature.ts`
- `src/features/player-characters/sort-player-characters-list/sort-player-characters-list-request.ts`
- `src/features/player-characters/sort-player-characters-list/sort-player-characters-list-feature.ts`
- `src/features/player-characters/save-player-character/save-player-character-request.ts`
- `src/features/player-characters/save-player-character/save-player-character-feature.ts`
- `src/features/player-characters/delete-player-character/delete-player-character-request.ts`
- `src/features/player-characters/delete-player-character/delete-player-character-feature.ts`

### Events
- `src/lib/events/player-character-filter-changed-event.ts` — carries `search: string`, `characterClass: string`
- `src/lib/events/player-character-deleted-event.ts`

### Components
- `src/components/player-characters/player-character-list-filter-bar/player-character-list-filter-bar.ts`
- `src/components/player-characters/player-character-list-filter-bar/player-character-list-filter-bar.html`
- `src/components/player-characters/player-character-display-dialog/player-character-display-dialog.ts`
- `src/components/player-characters/player-character-display-dialog/player-character-display-dialog.html`
- `src/components/player-characters/player-character-display/player-character-display.ts`
- `src/components/player-characters/player-character-display/player-character-display.html`
- `src/components/player-characters/player-character-form-fields/player-character-form-fields.ts`
- `src/components/player-characters/player-character-form-fields/player-character-form-fields.html`
- `src/components/pages/player-character/player-character.ts`
- `src/components/pages/player-character/player-character.html`

### Tests
- `tests/pcs/get-player-character-by-id-feature.test.ts`
- `tests/pcs/filter-player-characters-list-feature.test.ts`
- `tests/pcs/sort-player-characters-list-feature.test.ts`
- `tests/pcs/save-player-character-feature.test.ts`
- `tests/pcs/delete-player-character-feature.test.ts`

---

## Implementation Steps

### Step 1 — Extend `PlayerCharacter` domain model
File: `src/features/player-characters/player-character.ts`

Add three methods (follow the `Npc` pattern, but simpler — no `sourceId`, no `canBeDeleted`, all PCs are deletable):
- `validate(unitOfWork)`: validates name (non-empty, ≤100 chars, unique), characterClass (non-empty, ≤100 chars), description (≤5000 chars). Returns `string[]`.
- `saveToDatabase(unitOfWork)`: if `id===0` generate id via `generateId(repo)` and call `repo.add(this)`; else find existing and call `repo.update(existing, this)`.
- `deleteFromDatabase(unitOfWork)`: calls `unitOfWork.repo(PlayerCharacter).remove(this)`.

### Step 2 — PlayerCharacterFormFieldsDto
File: `src/features/player-characters/player-character-form-fields-dto.ts`

```typescript
class PlayerCharacterFormFieldsDto {
  name: string;
  characterClass: string;
  description: string;
  toJson(): string
  static createFromJson(jsonStr: string): PlayerCharacterFormFieldsDto
}
```

### Step 3 — PlayerCharacterMap
File: `src/features/player-characters/player-character-map.ts`

```typescript
class PlayerCharacterMap {
  static fromFormFields(dto: PlayerCharacterFormFieldsDto): PlayerCharacter
    // returns new PlayerCharacter(0, dto.name, dto.characterClass, dto.description)
}
```

### Step 4 — GetPlayerCharacterByIdFeature
Mirror `GetNpcByIdFeature`. Returns `PlayerCharacter` by id, or empty `new PlayerCharacter()` if not found.

### Step 5 — FilterPlayerCharactersListFeature
Extends `FilterListFeature`. Request has `search: string`, `characterClass: string` (empty = all).
- Applies `applySearchFilter` on `item.name`
- Applies class filter: if `characterClass !== ""`, filter `item.characterClass === characterClass`
- Returns `Result<PlayerCharacterListItem[]>`

### Step 6 — SortPlayerCharactersListFeature
Extends `SortListFeature`. Static fields: `fieldId="id"`, `fieldName="name"`, `fieldClass="characterClass"`.
- `SortDirection.None` → sort by id
- `fieldName` → `sortByStringField(a.name, b.name, ...)`
- `fieldClass` → `sortByStringField(a.characterClass, b.characterClass, ...)`
- Returns `Result<PlayerCharacterListItem[]>`

### Step 7 — SavePlayerCharacterFeature
Extends `SaveDbEntityFeature`. Async. Request has `id: number`, `formFields: PlayerCharacterFormFieldsDto`.
- Maps form fields → `PlayerCharacter` via `PlayerCharacterMap.fromFormFields()`
- Sets `pc.id = request.id`
- Calls `pc.validate(unitOfWork)` → fails if validation errors
- Calls `pc.saveToDatabase(unitOfWork)`, then `await unitOfWork.saveChanges()`
- Returns `Result<PlayerCharacter>`

### Step 8 — DeletePlayerCharacterFeature
Request has `id: number`. Finds PC by id; if not found, returns success (idempotent). Otherwise calls `pc.deleteFromDatabase(unitOfWork)` then `await unitOfWork.saveChanges()`. Returns `Result<number>`.

**Note:** No `canBeDeleted()` check — all PCs are deletable.

### Step 9 — Events
- `PlayerCharacterFilterChangedEvent(search: string, characterClass: string)` — extends `AppEvent`
- `PlayerCharacterDeletedEvent()` — extends `AppEvent`

### Step 10 — Localization

`src/lib/localization/message-keys.ts` — add:
```typescript
static createPlayerCharacterFailed: string = "createPlayerCharacterFailed";
static editPlayerCharacterFailed: string = "editPlayerCharacterFailed";
static deletePlayerCharacterFailed: string = "deletePlayerCharacterFailed";
```

`src/lib/localization/en.json` — add:
```json
"createPlayerCharacterFailed": "Failed to create player character.",
"editPlayerCharacterFailed": "Failed to edit player character.",
"deletePlayerCharacterFailed": "Failed to delete player character."
```

### Step 11 — Page Router
`src/lib/pages/page-router-service.ts` — add static field and route:
```typescript
public static playerCharacterPage: string = "Player Character";

// in populatePageMetaDataMap():
this._pages.set(
    PageRouterService.playerCharacterPage,
    new PageRouteData("/player-character/#", "player-character-page",
        PageRouterService.playerCharacterPage, true)
);
```

### Step 12 — PlayerCharacterListFilterBarComponent
Extends `BaseListFilterBarComponent` to reuse search box behavior.
- HTML: `id="searchBox"` input + `custom-select id="classFilter"` (no `#sourcesFilter`)
- `connectedCallback()`: render, then `configureClassFilter()`
- `configureClassFilter()`: query distinct `characterClass` values from `unitOfWork.repo(PlayerCharacter).list()`, prepend `SelectOption("", "All")`, call `classFilterElement.populateOptions(...)`
- `dispatchFilterChangedEvent()`: emit `PlayerCharacterFilterChangedEvent(currentSearch, currentCharacterClass)`
- `currentCharacterClass: string` property (private, set by class select callback)

### Step 13 — PlayerCharacterListComponent
Extends `BaseListComponent`. Table headers: `fieldName="Name"`, `fieldClass="Class"`.
- `connectedCallback()`: load all PCs, sort, populate headers + rows, register events
- `createTableRowElement(pc)`: `<td>` for name and class; click → open display dialog
- `sortItems()`: uses `SortPlayerCharactersListFeature`
- Events: `PlayerCharacterFilterChangedEvent` → run `FilterPlayerCharactersListFeature`, re-sort, re-render; `PlayerCharacterDeletedEvent` → re-apply current filters

`player-character-list.html`:
```html
<table id="list-container" class="w-full mb-18 text-left border-collapse border-3 border-black">
    <thead class="text-white bg-black"></thead>
    <tbody></tbody>
</table>
<player-character-display-dialog id="playerCharacterDisplayDialog"></player-character-display-dialog>
```

### Step 14 — PlayerCharacterDisplayComponent
Simple read-only display. `setPlayerCharacter(pc: PlayerCharacter)` updates: name paragraph, class paragraph, description paragraph.

### Step 15 — PlayerCharacterDisplayDialogComponent
Mirrors `NpcDisplayDialogComponent`.
- `setPlayerCharacter(id)`: loads PC via `GetPlayerCharacterByIdFeature`, updates display element
- Edit + Delete buttons always visible (all PCs are deletable, unlike NPCs)
- Edit click: navigates to `playerCharacterPage` with pc.id
- Delete click: opens confirmation dialog
- On confirm: calls `DeletePlayerCharacterFeature`, dispatches `PlayerCharacterDeletedEvent` on success

### Step 16 — PlayerCharacterFormFieldsComponent
Form-associated (uses `ElementInternals`). Fields: name input, characterClass `<select>`, description textarea.
- `connectedCallback()`: render, populate class `<select>` from DB, call `updateFormValue()`
- `setInitialFormValues(pc: PlayerCharacter)`: sets all inputs, updates DTO, calls `updateFormValue()`
- Change handlers for each field sync the DTO and call `updateFormValue()`

### Step 17 — PlayerCharacterPage component (create/edit)
`src/components/pages/player-character/player-character.ts` — mirrors `NpcComponent`.
- Reads id from URL; if `id > 0`, calls `GetPlayerCharacterByIdFeature` and passes result to form component
- Form submit: calls `SavePlayerCharacterFeature`; on success navigates to `charactersPage`
- Cancel: navigates to `charactersPage`

`player-character.html` — mirrors `npc.html`:
```html
<error-panel></error-panel>
<form id="playerCharacterForm" class="mb-18" onsubmit="this.handleFormSubmit(event)">
    <player-character-form-fields id="playerCharacterFields" name="playerCharacterFields"></player-character-form-fields>
    <div class="flex justify-center-safe">
        <button type="submit" class="...">Save</button>
        <secondary-button onclick="this.handleCancelButtonClick(event)">Cancel</secondary-button>
    </div>
</form>
```

### Step 18 — CharactersComponent (the list page at "/")
`src/components/pages/characters/characters.ts`:
- Remove placeholder code
- Listen for `AddNewEntityButtonClicked` → navigate to `playerCharacterPage` with id "0"
- Unregister in `disconnectedCallback()`

`src/components/pages/characters/characters.html`:
```html
<error-panel></error-panel>
<player-character-list-filter-bar></player-character-list-filter-bar>
<player-character-list></player-character-list>
<floating-add-new-entity-button></floating-add-new-entity-button>
```

### Step 19 — Tests

All tests in `tests/pcs/`. Uses existing helpers: `DataAccessUtils`, `DatabaseTestUtils`, `AssertUtils`, `ValueUtils`, `PlayerCharacterTestUtils`.

**`get-player-character-by-id-feature.test.ts`**
- id=0 returns empty PC
- Valid ids return correct PC with all fields

**`filter-player-characters-list-feature.test.ts`**
- Exception handling (mock throws)
- Empty search returns all PCs
- Case-insensitive name search
- Regex special characters escaped
- Empty `characterClass` returns all PCs
- Specific class returns only PCs of that class
- Invalid class returns all PCs

**`sort-player-characters-list-feature.test.ts`**
- Exception handling
- Invalid field returns original order
- `SortDirection.None` → id order
- `fieldName` Ascending/Descending
- `fieldClass` Ascending/Descending

**`save-player-character-feature.test.ts`**
- Exception handling → `Result.failure`
- id=0 → `ErrorCode.CreateError`; id>0 → `ErrorCode.EditError`
- Validation: empty name, name >100 chars, duplicate name, empty class, class >100 chars, description >5000 chars
- Successful create: count+1, id generated, values correct
- Successful edit: count unchanged, values updated
- id>0 for non-existent PC → creates new

**`delete-player-character-feature.test.ts`**
- Non-existent id → success (idempotent)
- Existing PC → count-1, no longer in repo

---

## Key Reused Patterns / Utilities
- `FilterListFeature` (`src/lib/common/features/filter-list-feature.ts`) — base for filter feature
- `SortListFeature` (`src/lib/common/features/sort-list-feature.ts`) — base for sort feature
- `SaveDbEntityFeature` (`src/lib/common/features/save-db-entity-feature.ts`) — base for save feature
- `BaseListComponent` (`src/components/base-list/base-list-component.ts`) — base for list component
- `BaseListFilterBarComponent` (`src/components/base-list-filter-bar/base-list-filter-bar.ts`) — search box behavior
- `CustomSelectComponent` (`src/components/custom-select/custom-select.ts`) — class filter dropdown
- `ModalDialogComponent`, `ConfirmationDialogComponent` — for display dialog
- `DatabaseTestUtils`, `AssertUtils`, `ValueUtils`, `DataAccessUtils` — test helpers

---

## Verification
1. `npm test` — all new test suites pass (filter, sort, save, delete, get-by-id)
2. `npm run serve` — navigate to Characters page (`/`):
   - PC list displays with Name and Class columns
   - Name search filters correctly (case-insensitive)
   - Class dropdown filters to selected class; "All" shows all
   - Column headers sort by Name and Class (Asc/Desc toggle)
   - Click a row → display dialog opens showing name, class, description
   - Edit button → navigates to `/player-character/{id}`, form pre-populated
   - Save → returns to list, changes reflected
   - Delete button → confirmation dialog → PC removed from list
   - Floating add button → navigates to `/player-character/0` → fill form → Save → PC in list
   - Cancel on form → returns to Characters list
