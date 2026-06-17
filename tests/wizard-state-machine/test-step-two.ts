import { LinearWizardStepBase } from "../../src/lib/wizard-state-machine/linear-wizard-step";

export class TestStepTwo extends LinearWizardStepBase {
    public canMoveToOtherStep: boolean;

    constructor(canMoveToOtherStep?: boolean) {
        super("Test Step Two");
        this.canMoveToOtherStep = canMoveToOtherStep ?? false;
    }

    public override canMoveNext(): boolean {
        return this.canMoveToOtherStep;
    }

    public override canMovePrevious(): boolean {
        return this.canMoveToOtherStep;
    }
}
