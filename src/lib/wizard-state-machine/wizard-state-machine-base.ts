import { WizardStepBase } from "./wizard-step-base";

export abstract class WizardStateMachineBase {
    protected steps: WizardStepBase[];

    constructor(steps: WizardStepBase[]) {
        this.steps = steps;
    }

    public abstract getCurrentStep(): WizardStepBase | null;
}
