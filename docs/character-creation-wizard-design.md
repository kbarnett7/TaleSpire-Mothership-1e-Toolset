# Character Creation Wizard Design Document

## Finite State Machine

| State                               | Next State | Skippable | Transition Conditions                                                           |
| ----------------------------------- | ---------- | --------- | ------------------------------------------------------------------------------- |
| Step 1: Roll Stats                  | Step 2     | No        | Strength, Speed, Intellect, and Combat have values between 0 and 100 inclusive. |
| Step 2: Roll Saves                  | Step 3     | No        | Sanity, Fear, and Body have values between 0 and 100 inclusive.                 |
| Step 3: Choose Class                | Step 4     | No        | A class has been selected.                                                      |
| Step 4: Roll Health                 | Step 5     | No        | Health has a value between 1 and 20. Wounds is between 0 and <MAX_WOUNDS>.      |
| Step 5: Gain Stress                 | Step 6     | No        | TBD                                                                             |
| Step 6: Note Trauma Response        | Step 7     | No        | TBD                                                                             |
| Step 7: Choose Skills               | Step 8     | No        | TBD                                                                             |
| Step 8: Loadout, Trinket, and Patch | Step 9     | Yes       | TBD                                                                             |
| Step 9: Finishing                   | N/A        | No        | TBD                                                                             |

## Code Design

### Logic Classes

WizardStateMachineBase

- LinearWizardStateMachine
    - PlayerCharacterCreationWizard

WizardStepBase

- PlayerCharacterStepBase
    - PlayerCharacterRollStatsAndSavesStep
    - PlayerCharacterChooseClassStep
    - PlayerCharacterRollHealthStep

### UI Classes

CreatePlayerCharacterPage

BasePlayerCharacterCreationWizardComponent

- PlayerCharacterRollStatsAndSavesComponent
- PlayerCharacterChooseClassComponent
- PlayerCharacterRollHealthComponent

### URL Path

**D&D Beyond Approach**

They use individual pages for each step and substep of the creation setup. Some fields, like name, remain on each page.

/characters/<id>/builder/<step>/<sub-step>

- /characters/12345/builder/home/basic
- /characters/12345/builder/class/choose
- /characters/12345/builder/class/manage
- /characters/12345/builder/description/manage
- /characters/12345/builder/species/choose
- /characters/12345/builder/species/manage
- /characters/12345/builder/ability-scores/manage
- /characters/12345/builder/equipment/manage
- /characters/12345/builder/whats-next

**Demiplane Approach**

For Pathfinder and Starfinder, they use a component-based approach. A single page where the components on the page dynamically change, but the page itself never experiences a full-page refresh. Some components on the page, such as stats and health and name, never change.

/character-builder/<id>

- /character-builder/123ab

## Links

**FSM and Wizards**

https://en.wikipedia.org/wiki/Finite-state_machine#Software_applications
https://brilliant.org/wiki/finite-state-machines/
https://medium.com/dailyjs/state-machines-to-the-rescue-of-complex-forms-867b75790455
https://www.jocheojeda.com/2025/03/02/state-machines-and-wizard-components-a-clean-implementation-approach/
https://jason-down.com/2015/04/30/dynamics-nav-wizard-finite-state-machine/
https://github.com/egarim/WizardStateMachineTest
https://oneuptime.com/blog/post/2026-01-30-typescript-type-safe-state-machines/view
