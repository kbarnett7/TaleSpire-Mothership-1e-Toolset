import { LinearWizardStepBase } from "../../src/lib/wizard-state-machine/linear-wizard-step";

export class TestStepOne extends LinearWizardStepBase {
    public canMoveToOtherStep: boolean;

    constructor(canMoveToNextStep?: boolean) {
        super("Test Step One");
        this.canMoveToOtherStep = canMoveToNextStep ?? false;
    }

    public override canMoveNext(): boolean {
        return this.canMoveToOtherStep;
    }

    public override canMovePrevious(): boolean {
        return this.canMoveToOtherStep;
    }
}
