import { LinearWizardStateMachine } from "../../src/lib/wizard-state-machine/linear-wizard-state-machine";
import { WizardStepBase } from "../../src/lib/wizard-state-machine/wizard-step-base";

describe("LinearWizardStateMachine", () => {
    it("Should return null when getting the current step when the machine has no steps", () => {
        // Arrange
        const stateMachine = new LinearWizardStateMachine([]);

        // Act
        const result = stateMachine.getCurrentStep();

        // Assert
        expect(result).toBeNull();
    });

    it("Should return a step object when getting the current step when the machine has at least one step", () => {
        // Arrange
        const stepOne = new WizardStepBase();
        const stateMachine = new LinearWizardStateMachine([stepOne]);

        // Act
        const result = stateMachine.getCurrentStep();

        // Assert
        expect(result).toBe(stepOne);
    });

    it("Should return the first step object when getting the current step when the machine hasn't moved to the next step", () => {
        // Arrange
        const stepOne = new WizardStepBase();
        const stepTwo = new WizardStepBase();
        const stateMachine = new LinearWizardStateMachine([stepOne, stepTwo]);

        // Act
        const result = stateMachine.getCurrentStep();

        // Assert
        expect(result).toBe(stepOne);
    });

    it("Should return the second step object when getting the current step when the machine has moved once", () => {
        // Arrange
        const stepOne = new WizardStepBase();
        const stepTwo = new WizardStepBase();
        const stateMachine = new LinearWizardStateMachine([stepOne, stepTwo]);
        stateMachine.moveNext();

        // Act
        const result = stateMachine.getCurrentStep();

        // Assert
        expect(result).toBe(stepTwo);
    });

    it("Should return the first step object when getting the current step when the machine has moved once and back once", () => {
        // Arrange
        const stepOne = new WizardStepBase();
        const stepTwo = new WizardStepBase();
        const stateMachine = new LinearWizardStateMachine([stepOne, stepTwo]);
        stateMachine.moveNext();
        stateMachine.movePrevious();

        // Act
        const result = stateMachine.getCurrentStep();

        // Assert
        expect(result).toBe(stepOne);
    });

    it("Should return false when moving to the next step when the machine has no steps", () => {
        // Arrange
        const stateMachine = new LinearWizardStateMachine([]);

        // Act
        const result = stateMachine.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    it("Should return false when moving to the next step when the machine has only a single step", () => {
        // Arrange
        const stepOne = new WizardStepBase();
        const stateMachine = new LinearWizardStateMachine([stepOne]);

        // Act
        const result = stateMachine.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    it("Should return false when moving to the previous step when the machine has no steps", () => {
        // Arrange
        const stateMachine = new LinearWizardStateMachine([]);

        // Act
        const result = stateMachine.movePrevious();

        // Assert
        expect(result).toBe(false);
    });

    it("Should return false when moving to the previous step when the machine has only a single step", () => {
        // Arrange
        const stepOne = new WizardStepBase();
        const stateMachine = new LinearWizardStateMachine([stepOne]);

        // Act
        const result = stateMachine.movePrevious();

        // Assert
        expect(result).toBe(false);
    });

    it("Should return true when moving to the next step when the machine has multiple steps and hasn't reached the final step", () => {
        // Arrange
        const stepOne = new WizardStepBase();
        const stepTwo = new WizardStepBase();
        const stateMachine = new LinearWizardStateMachine([stepOne, stepTwo]);

        // Act
        const result = stateMachine.moveNext();

        // Assert
        expect(result).toBe(true);
    });

    it("Should return false when moving to the next step when the machine has multiple steps and has reached the final step", () => {
        // Arrange
        const stepOne = new WizardStepBase();
        const stepTwo = new WizardStepBase();
        const stateMachine = new LinearWizardStateMachine([stepOne, stepTwo]);
        stateMachine.moveNext();

        // Act
        const result = stateMachine.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    it("Should return true when moving to the previous step when the machine has multiple steps and has already moved to another step", () => {
        // Arrange
        const stepOne = new WizardStepBase();
        const stepTwo = new WizardStepBase();
        const stateMachine = new LinearWizardStateMachine([stepOne, stepTwo]);
        stateMachine.moveNext();

        // Act
        const result = stateMachine.movePrevious();

        // Assert
        expect(result).toBe(true);
    });

    it("Should return false when moving to the previous step when the machine has multiple steps and has already moved back to the first step", () => {
        // Arrange
        const stepOne = new WizardStepBase();
        const stepTwo = new WizardStepBase();
        const stateMachine = new LinearWizardStateMachine([stepOne, stepTwo]);
        stateMachine.moveNext();
        stateMachine.movePrevious();

        // Act
        const result = stateMachine.movePrevious();

        // Assert
        expect(result).toBe(false);
    });
});
