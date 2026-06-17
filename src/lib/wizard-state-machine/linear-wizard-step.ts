import { WizardStepBase } from "./wizard-step-base";

export class LinearWizardStepBase extends WizardStepBase {
    constructor(title?: string) {
        super(title);
    }

    public canMoveNext(): boolean {
        return true;
    }

    public canMovePrevious(): boolean {
        return true;
    }
}
