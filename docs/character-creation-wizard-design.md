# Character Creation Wizard Design Document

## Finite State Machine

| State                               | Next State | Transition Conditions                                                           |
| ----------------------------------- | ---------- | ------------------------------------------------------------------------------- |
| Step 1: Roll Stats                  | Step 2     | Strength, Speed, Intellect, and Combat have values between 0 and 100 inclusive. |
| Step 2: Roll Saves                  | Step 3     | Sanity, Fear, and Body have values between 0 and 100 inclusive.                 |
| Step 3: Choose Class                | Step 4     | A class has been selected.                                                      |
| Step 4: Roll Health                 | Step 5     | Health has a value between 1 and 20. Wounds is between 0 and <MAX_WOUNDS>.      |
| Step 5: Gain Stress                 | Step 6     |
| Step 6: Note Trauma Response        | Step 7     |
| Step 7: Choose Skills               | Step 8     |
| Step 8: Loadout, Trinket, and Patch | Step 9     |
| Step 9: Finishing                   | N/A        |

## Links

**FSM and Wizards**

https://en.wikipedia.org/wiki/Finite-state_machine#Software_applications
https://brilliant.org/wiki/finite-state-machines/
https://medium.com/dailyjs/state-machines-to-the-rescue-of-complex-forms-867b75790455
https://www.jocheojeda.com/2025/03/02/state-machines-and-wizard-components-a-clean-implementation-approach/
https://jason-down.com/2015/04/30/dynamics-nav-wizard-finite-state-machine/
https://github.com/egarim/WizardStateMachineTest
https://oneuptime.com/blog/post/2026-01-30-typescript-type-safe-state-machines/view
