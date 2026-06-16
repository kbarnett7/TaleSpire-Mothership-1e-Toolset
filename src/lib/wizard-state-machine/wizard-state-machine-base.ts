import { WizardStepBase } from "./wizard-step-base";

export abstract class WizardStateMachineBase {
    protected steps: WizardStepBase[];

    constructor(steps: WizardStepBase[]) {
        this.steps = steps;
    }

    public get stepsCount(): number {
        return this.steps.length;
    }

    public abstract getCurrentStep(): WizardStepBase | null;
}
