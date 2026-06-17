import { LinearWizardStepBase } from "../../../lib/wizard-state-machine/linear-wizard-step";

export class FinishingWizardStep extends LinearWizardStepBase {
    constructor() {
        super("Finishing");
    }
}
