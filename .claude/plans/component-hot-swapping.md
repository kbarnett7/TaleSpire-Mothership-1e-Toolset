# Plan: Hot-Swapping Step Components in `PlayerCharacterCreationWizard`

## Goal

In `new-player-character-page` (`src/components/pages/new-player-character/new-player-character.ts`), the `#stepDiv`
element should always contain the Web Component for whatever step `PlayerCharacterCreationWizard` is currently on.
Clicking **Next**/**Previous** should:

1. Persist the outgoing step component's current form values into the shared `PlayerCharacter`.
2. Ask the wizard to move (`moveNext()`/`movePrevious()`), which validates via `canMoveNext()`/`canMovePrevious()`.
3. If the move succeeded, swap `#stepDiv`'s contents to the new current step's component and pre-fill it from
   already-known `PlayerCharacter` data.
4. If the move was blocked, leave the current step's component in place (no swap).

## Current state (as of this plan)

- `new-player-character.ts:27-33` — `handlePreviousButtonClick`/`handleNextButtonClick` are stubs (`alert(...)`), never call into `this.wizard`.
- `new-player-character.html:4` — `#stepDiv` is a placeholder `<div>` with no real content.
- `PlayerCharacterCreationWizard` (`src/features/player-characters/player-character-creation-wizard/player-character-creation-wizard.ts`) extends `LinearWizardStateMachine` and holds 9 ordered steps (`RollStatsWizardStep`, `RollSavesWizardStep`, ... `FinishingWizardStep`). `moveNext()`/`movePrevious()` (`src/lib/wizard-state-machine/linear-wizard-state-machine.ts:19-41`) already gate on the current step's `canMoveNext()`/`canMovePrevious()` (`src/lib/wizard-state-machine/linear-wizard-step.ts`) but are never called anywhere today.
- Step classes (e.g. `RollStatsWizardStep`, `RollSavesWizardStep`) are pure state/validation objects — they hold no reference to which UI component renders them.
- `roll-stats` / `roll-saves` (`src/components/roll-stats/roll-stats.ts`, `src/components/roll-saves/roll-saves.ts`) are already form-associated custom elements exposing `get value()` (JSON via `StatsFormFieldsDto`/`SavesFormFieldsDto`) and `setInitialFormValues(dto)`, but nothing calls either yet, and their own HTML templates are still placeholders (`<div>ROLL STATS</div>` / `<div>ROLL SAVES</div>`).
- The other 7 step components (`RollHealthWizardStep`, `GainStressWizardStep`, `NoteTraumaResponseWizardStep`, `ChooseSkillsWizardStep`, `RollLoadoutWizardStep`, `ChooseClassWizardStep`, `FinishingWizardStep`) have **no corresponding Web Component built yet** at all.

---

## Decision 1: How does a step know which component tag to render?

### Option A — `component` tag name on the step class (RECOMMENDED)

Mirrors the existing precedent in `src/lib/pages/page-route-data.ts:1-13`, where `PageRouteData` carries a
`component: string` used by `PageRouterComponent.renderCorrectPage` (`src/components/page-router/page-router.ts:59-76`)
to `document.createElement(this.currentPage.component)`.

Add a `component: string` property to `WizardStepBase` (`src/lib/wizard-state-machine/wizard-step-base.ts`), set via
constructor, same as `title` is today. Each concrete step passes its tag name up through the constructor chain, e.g.:

```ts
// roll-stats-wizard-step.ts
constructor(playerCharacter: PlayerCharacter) {
    super(playerCharacter, "Roll Stats", "roll-stats");
}
```

**Pros**
- Consistent with the one existing precedent in this codebase for "string tag name lives on the data describing a navigable unit" (`PageRouteData`).
- The step object is self-describing — anything holding a `WizardStepBase` (current page, a future progress indicator, tests) can ask "what renders me?" without a side lookup.
- No risk of the map and the step list drifting out of sync (e.g. someone adds a new step subclass but forgets to add a lookup-table entry).
- Trivial to unit test in isolation (`src/lib/wizard-state-machine/*`, `src/features/player-characters/player-character-creation-wizard/*` are both within the Jest coverage scope per `.claude/docs/automated_testing_patterns.md:7`).

**Cons**
- Couples the generic `src/lib/wizard-state-machine/` library (currently framework-agnostic, no DOM knowledge) to the concept of a "component tag name," even though today it's only consumed by the player-character wizard.
- Every step subclass's constructor signature grows by one parameter; all 9 step subclass constructors (and `PlayerCharacterWizardStep`) need updating even for steps that don't have components yet (they'd pass `""` or a TBD tag name).

### Option B — Separate lookup map in the page component

Keep every class in `src/lib/wizard-state-machine/` and `player-character-creation-wizard/*` untouched. In
`new-player-character.ts`, add something like:

```ts
private static readonly stepComponentTags = new Map<Function, string>([
    [RollStatsWizardStep, "roll-stats"],
    [RollSavesWizardStep, "roll-saves"],
    // ...
]);
```

keyed by `step.constructor` (or a `stepType` enum if preferred over reflection on the constructor).

**Pros**
- Zero changes to the wizard-state-machine library or any step class — keeps that layer purely about state/validation, no UI concerns.
- The map lives right next to the one place that currently cares about tag names (the page component), so there's only one file to open to understand the wiring.

**Cons**
- New precedent instead of reusing the existing `PageRouteData`-style pattern — inconsistent with how the codebase already solves "string identifier -> tag name."
- Keying off `step.constructor` is reflection-ish and easy to get subtly wrong (e.g. forgetting `.name` vs the class reference itself, or breaking if a step is subclassed later); keying off an enum requires yet another property on the step class anyway, which erodes most of the "zero changes" benefit.
- The map and the step list in `PlayerCharacterCreationWizard`'s constructor are two independent sources of truth that must be kept in sync by hand — nothing enforces it, so adding a step and forgetting the map entry fails silently (falls through to a default/undefined tag) rather than a compile error.

### Recommendation

**Option A.** The `component` property costs one constructor parameter per step class, all of which need touching anyway to
eventually build their real components. In exchange it removes an entire category of "the map and the steps array
disagree" bugs and matches the one existing convention (`PageRouteData`) this codebase already has for exactly this
problem. Concrete steps in the "Implementation Steps" section below use Option A.

---

## Decision 2: How does `#stepDiv` physically swap components?

### Option A — Create/destroy on navigation, à la `page-router.ts` (RECOMMENDED)

`PageRouterComponent.renderCorrectPage()` (`src/components/page-router/page-router.ts:59-76`) removes the previous
page's element from the shadow root, then does:

```ts
const newPage = document.createElement(this.currentPage.component);
newPage.id = elementId;
this.shadow.appendChild(newPage);
```

Applied here: on every successful `moveNext()`/`movePrevious()`, remove `#stepDiv`'s current child, create the new
step's component by tag name, populate it via `setInitialFormValues(...)`, and append it into `#stepDiv`.

**Pros**
- Directly reuses an established, already-reviewed pattern from this exact codebase (`page-router.ts`) — a reviewer/future maintainer who knows that code immediately recognizes this one.
- Only one step component is ever instantiated/connected at a time — no wasted `connectedCallback()` work or hidden DOM for the 8 steps the user isn't currently looking at.
- Works for the wizard today even though only 2 of 9 step components (`roll-stats`, `roll-saves`) exist yet — no need to stub out placeholder markup for the other 7 up front.

**Cons**
- Component state (e.g. any in-progress typing not yet persisted) is destroyed on every navigation — but this plan already requires reading `.value` and persisting to `PlayerCharacter` *before* the swap (see Decision-adjacent "Data persistence" below), so this is a non-issue as long as that persistence step isn't skipped.
- Each `document.createElement(tagName)` is effectively an `any`-typed element until cast, same weak typing already accepted in `page-router.ts:68`.

### Option B — Pre-declare all step components in HTML, toggle `.hidden`, à la `gear-item.ts`

`GearItemComponent` (`src/components/pages/gear-item/gear-item.ts:41-51,137-148`) declares `#armorFields`,
`#weaponFields`, `#equipmentFields` all in its HTML template up front, and `updateFieldDivVisiblities()` just
toggles a `.hidden` class based on `this.selectedCategory`. Applied here: `new-player-character.html` would declare
all 9 step components inside `#stepDiv` (or 9 sibling divs), and navigation would just add/remove `.hidden` on the
outgoing/incoming step element.

**Pros**
- Component instances persist across navigation — no need to explicitly re-hydrate `setInitialFormValues` on every single visit if a step is revisited (though this plan calls for doing that anyway per the "Data persistence" answer, to guarantee the shown values match `PlayerCharacter`'s current truth).
- Simpler code path: no dynamic `document.createElement`/tag-name lookup logic, just a class toggle, matching `gear-item.ts`'s existing style.

**Cons**
- Only works for a small, known, fixed category set (`gear-item.ts` only ever toggles between 2-3 categories that already exist). Here it means all 9 step components must exist and be declared in markup *now*, including 7 that don't exist yet — this plan would either have to stub out 7 placeholder components just to satisfy the template, or leave `#stepDiv` half-built until those land, which contradicts doing this work incrementally per step.
- All 9 components get constructed and `connectedCallback()`-run on page load, even though the user will see at most one of them per visit — needless work multiplied by however heavy those components get once fully built out (dice-rolling widgets, etc.).
- Doesn't match the `component: string` tag-name-driven design from Decision 1 (Option A there assumes dynamic `createElement`); would need Decision 1 to also go with Option B (a static map/switch keyed however) to stay consistent, since there's no per-step "tag name" concept needed if everything's already in the DOM.

### Recommendation

**Option A.** It matches Decision 1 Option A's dynamic-tag-name design, matches the more directly-analogous existing
precedent (`page-router.ts`, which is also about swapping "the one active screen out of several," vs. `gear-item.ts`
which toggles between a handful of always-relevant sibling forms), and doesn't force building out 7 not-yet-existing
placeholder components today. Concrete steps below use Option A.

---

## Data persistence between steps (confirmed: yes, save on every navigation)

Before swapping away from a step, read the outgoing component's `.value` and persist it into the shared
`PlayerCharacter` via the corresponding `PlayerCharacterCreationWizard` setter (`setBaseStats`, `setBaseSaves`, ...),
then when creating the *new* step's component, call `setInitialFormValues(...)` with whatever's already on
`PlayerCharacter` (so revisiting a step via Previous/Next shows previously-entered data, not a blank form).

This requires a small addition: currently `PlayerCharacterCreationWizard.setBaseStats`/`setBaseSaves` only *write*
`PlayerCharacter` fields — there's no DTO-shaped *read* accessor to feed `setInitialFormValues`. This plan adds a thin
per-step "hydrate" step, described in Implementation Steps below.

## Validation gating (confirmed: wire up now)

`moveNext()`/`movePrevious()` already return `boolean` and internally check `canMoveNext()`/`canMovePrevious()`
(`src/lib/wizard-state-machine/linear-wizard-state-machine.ts:19-41`). The button handlers must check that return
value and only perform the DOM swap when `true`. When `false`, no swap happens — this plan does not scope *how*
the user is told why (e.g. a validation message component); it only guarantees navigation doesn't silently proceed
to a step that shouldn't be reachable yet. Surfacing a specific validation message is out of scope (see "Out of
scope" below).

---

## Implementation Steps

### 1. Add `component` to the wizard-state-machine library

`src/lib/wizard-state-machine/wizard-step-base.ts`:
```ts
export class WizardStepBase {
    private _title: string;
    private _component: string;

    public get title(): string {
        return this._title;
    }

    public get component(): string {
        return this._component;
    }

    constructor(title?: string, component?: string) {
        this._title = title ?? "";
        this._component = component ?? "";
    }
}
```

`src/lib/wizard-state-machine/linear-wizard-step.ts` — pass `component` through:
```ts
constructor(title?: string, component?: string) {
    super(title, component);
}
```

### 2. Thread `component` through the player-character wizard step classes

`src/features/player-characters/player-character-creation-wizard/player-character-wizard-step.ts`:
```ts
export class PlayerCharacterWizardStep extends LinearWizardStepBase {
    protected playerCharacter: PlayerCharacter;

    constructor(playerCharacter: PlayerCharacter, title?: string, component?: string) {
        super(title, component);
        this.playerCharacter = playerCharacter;
    }
}
```

Update each concrete step's `super(...)` call to pass its tag name, e.g.:
- `roll-stats-wizard-step.ts`: `super(playerCharacter, "Roll Stats", "roll-stats");`
- `roll-saves-wizard-step.ts`: `super(playerCharacter, "Roll Saves", "roll-saves");`
- The remaining 7 steps (`RollHealthWizardStep`, `GainStressWizardStep`, `NoteTraumaResponseWizardStep`, `ChooseSkillsWizardStep`, `RollLoadoutWizardStep`, `ChooseClassWizardStep`, `FinishingWizardStep`) don't have components yet — pass `""` for now (or, if their tag names are already decided even though the component isn't built, pass the real intended tag name so the page component's `document.createElement` calls fail loudly/visibly once the user reaches that step, rather than silently).

### 3. Add DTO hydration helpers to `PlayerCharacterCreationWizard`

Add read-side accessors alongside the existing write-side `setBaseStats`/`setBaseSaves`, so the page component can
pre-fill a freshly-created step component:

```ts
public getBaseStatsFormFields(): StatsFormFieldsDto {
    return new StatsFormFieldsDto(
        this.playerCharacter.baseStrength?.toString() ?? "",
        this.playerCharacter.baseSpeed?.toString() ?? "",
        this.playerCharacter.baseIntellect?.toString() ?? "",
        this.playerCharacter.baseCombat?.toString() ?? ""
    );
}

public getBaseSavesFormFields(): SavesFormFieldsDto {
    return new SavesFormFieldsDto(
        this.playerCharacter.baseSanity?.toString() ?? "",
        this.playerCharacter.baseFear?.toString() ?? "",
        this.playerCharacter.baseBody?.toString() ?? ""
    );
}
```

(Exact field names/nullability to be checked against `PlayerCharacter` — confirm `baseStrength` etc. types when
implementing.)

### 4. Wire up `new-player-character.ts`

```ts
public handlePreviousButtonClick(event: MouseEvent) {
    this.persistCurrentStepValue();

    if (this.wizard.movePrevious()) {
        this.renderCurrentStep();
    }
}

public handleNextButtonClick(event: MouseEvent) {
    this.persistCurrentStepValue();

    if (this.wizard.moveNext()) {
        this.renderCurrentStep();
    }
}

private persistCurrentStepValue() {
    const currentStepElement = this.stepDiv.firstElementChild as (HTMLElement & { value?: string }) | null;

    if (!currentStepElement || currentStepElement.value === undefined) return;

    // Dispatch on tag name (or on the outgoing wizard step type) to call the matching
    // wizard setter, e.g.:
    if (currentStepElement.tagName.toLowerCase() === "roll-stats") {
        const dto = StatsFormFieldsDto.createFromJson(currentStepElement.value);
        this.wizard.setBaseStats(Number(dto.strength), Number(dto.speed), Number(dto.intellect), Number(dto.combat));
    } else if (currentStepElement.tagName.toLowerCase() === "roll-saves") {
        const dto = SavesFormFieldsDto.createFromJson(currentStepElement.value);
        this.wizard.setBaseSaves(Number(dto.sanity), Number(dto.fear), Number(dto.body));
    }
    // ... one branch per step component that exists today; extend as more steps get built.
}

private renderCurrentStep() {
    const step = this.wizard.getCurrentStep();
    if (!step || !step.component) return;

    this.stepDiv.replaceChildren();

    const stepElement = document.createElement(step.component);
    this.hydrateStepElement(stepElement, step);
    this.stepDiv.appendChild(stepElement);
}

private hydrateStepElement(element: HTMLElement, step: WizardStepBase) {
    if (step.component === "roll-stats") {
        (element as RollStatsComponent).setInitialFormValues(this.wizard.getBaseStatsFormFields());
    } else if (step.component === "roll-saves") {
        (element as RollSavesComponent).setInitialFormValues(this.wizard.getBaseSavesFormFields());
    }
    // ... one branch per step component that exists today.
}

private get stepDiv(): HTMLElement {
    return this.shadow.getElementById("stepDiv") as HTMLElement;
}
```

And in `connectedCallback`, after `this.render(html)`, call `this.renderCurrentStep()` once so `roll-stats` is
present by default on first load:

```ts
public async connectedCallback() {
    await super.connectedCallback();
    this.render(html);
    this.renderCurrentStep();
}
```

`new-player-character.html:4` — remove the placeholder text so `#stepDiv` is genuinely empty until JS populates it:
```html
<div id="stepDiv"></div>
```

**Known rough edge to resolve during implementation:** the `persistCurrentStepValue`/`hydrateStepElement` methods above
use `if/else` chains on tag name, which will grow one branch per step and start to smell as more steps get built out
(7 more components are coming per the wizard's step list). If/when that becomes unwieldy, consider whether each step
component should expose a common interface (e.g. `IWizardStepComponent { value: string; setInitialFormValues(json: string): void }`)
so the page component can call `element.setInitialFormValues(json)` uniformly without per-tag branching — deliberately
not designing that abstraction now, per the project's guidance against generalizing before there's enough concrete
cases to see the right shape.

### 5. Tests

Within Jest's coverage scope (`src/features/**/*`, `src/lib/**/*` per `.claude/docs/automated_testing_patterns.md:7`):

- `tests/pcs/...` (mirroring `src/features/player-characters/`): extend or add tests asserting `RollStatsWizardStep`/`RollSavesWizardStep` expose `component === "roll-stats"` / `"roll-saves"` respectively.
- Add/extend a `LinearWizardStateMachine` test verifying `moveNext()`/`movePrevious()` behavior is unaffected by the new `component` field (regression coverage for Decision 1's change to `WizardStepBase`'s constructor signature).
- If `PlayerCharacterCreationWizard` already has tests, add cases for the new `getBaseStatsFormFields()`/`getBaseSavesFormFields()` accessors (AAA style, per `.claude/docs/automated_testing_patterns.md:29-46`).
- `src/components/**/*` is outside Jest's coverage scope and has no existing test precedent in this codebase — manual verification of the swap behavior via `npm run serve` is the expected validation method for `new-player-character.ts` itself, consistent with how other page components (e.g. `gear-item.ts`) are currently validated.

---

## Out of scope for this plan

- Building the actual `roll-stats.html` / `roll-saves.html` form markup (currently placeholder `<div>ROLL STATS</div>` / `<div>ROLL SAVES</div>`) or wiring their commented-out `handleOnShotsInputChanged`/`setInitialFormValues` bodies — that's the components' own internal implementation, not the swapping mechanism.
- Building the 7 not-yet-existing step components (`roll-health`, `gain-stress`, `note-trauma-response`, `choose-skills`, `roll-loadout`, `choose-class`, `finishing`) and their tag names/markup.
- Any visible feedback when `moveNext()`/`movePrevious()` returns `false` (e.g. inline validation messages, disabling the Next button preemptively) — this plan only guarantees the swap doesn't happen, not what the user sees instead.
- A generalized `IWizardStepComponent` interface to replace the tag-name `if/else` branching in `persistCurrentStepValue`/`hydrateStepElement` — flagged above as a likely future refactor once more step components exist, but not designed now.
- A step-progress indicator (e.g. "Step 2 of 9") — not requested, though `stepsCount`/`getCurrentStep()` on `WizardStateMachineBase` already provide what such a feature would need.
