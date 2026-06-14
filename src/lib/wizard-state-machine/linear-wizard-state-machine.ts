import { WizardStateMachineBase } from "./wizard-state-machine-base";
import { WizardStepBase } from "./wizard-step-base";

export class LinearWizardStateMachine extends WizardStateMachineBase {
    private currentIndex: number;

    constructor(steps: WizardStepBase[]) {
        super(steps);
        this.currentIndex = 0;
    }

    public getCurrentStep(): WizardStepBase | null {
        if (this.steps.length === 0) return null;

        return this.steps[this.currentIndex];
    }

    public moveNext(): boolean {
        if (this.steps.length === 0 || this.currentIndex >= this.steps.length - 1) return false;

        this.currentIndex++;

        return true;
    }

    public movePrevious(): boolean {
        if (this.steps.length === 0 || this.currentIndex <= 0) return false;

        this.currentIndex--;

        return true;
    }
}
