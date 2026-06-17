import { LinearWizardStateMachine } from "../../src/lib/wizard-state-machine/linear-wizard-state-machine";
import { LinearWizardStepBase } from "../../src/lib/wizard-state-machine/linear-wizard-step";
import { TestStepOne } from "./test-step-one";
import { TestStepTwo } from "./test-step-two";

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
        const stepOne = new LinearWizardStepBase();
        const stateMachine = new LinearWizardStateMachine([stepOne]);

        // Act
        const result = stateMachine.getCurrentStep();

        // Assert
        expect(result).toBe(stepOne);
    });

    it("Should return the first step object when getting the current step when the machine hasn't moved to the next step", () => {
        // Arrange
        const stepOne = new LinearWizardStepBase();
        const stepTwo = new LinearWizardStepBase();
        const stateMachine = new LinearWizardStateMachine([stepOne, stepTwo]);

        // Act
        const result = stateMachine.getCurrentStep();

        // Assert
        expect(result).toBe(stepOne);
    });

    it("Should return the second step object when getting the current step when the machine has moved once", () => {
        // Arrange
        const stepOne = new LinearWizardStepBase();
        const stepTwo = new LinearWizardStepBase();
        const stateMachine = new LinearWizardStateMachine([stepOne, stepTwo]);
        stateMachine.moveNext();

        // Act
        const result = stateMachine.getCurrentStep();

        // Assert
        expect(result).toBe(stepTwo);
    });

    it("Should return the first step object when getting the current step when the machine has moved once and back once", () => {
        // Arrange
        const stepOne = new LinearWizardStepBase();
        const stepTwo = new LinearWizardStepBase();
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
        const stepOne = new LinearWizardStepBase();
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
        const stepOne = new LinearWizardStepBase();
        const stateMachine = new LinearWizardStateMachine([stepOne]);

        // Act
        const result = stateMachine.movePrevious();

        // Assert
        expect(result).toBe(false);
    });

    it("Should return true when moving to the next step when the machine has multiple steps and hasn't reached the final step", () => {
        // Arrange
        const stepOne = new LinearWizardStepBase();
        const stepTwo = new LinearWizardStepBase();
        const stateMachine = new LinearWizardStateMachine([stepOne, stepTwo]);

        // Act
        const result = stateMachine.moveNext();

        // Assert
        expect(result).toBe(true);
    });

    it("Should return false when moving to the next step when the machine has multiple steps and has reached the final step", () => {
        // Arrange
        const stepOne = new LinearWizardStepBase();
        const stepTwo = new LinearWizardStepBase();
        const stateMachine = new LinearWizardStateMachine([stepOne, stepTwo]);
        stateMachine.moveNext();

        // Act
        const result = stateMachine.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    it("Should return true when moving to the previous step when the machine has multiple steps and has already moved to another step", () => {
        // Arrange
        const stepOne = new LinearWizardStepBase();
        const stepTwo = new LinearWizardStepBase();
        const stateMachine = new LinearWizardStateMachine([stepOne, stepTwo]);
        stateMachine.moveNext();

        // Act
        const result = stateMachine.movePrevious();

        // Assert
        expect(result).toBe(true);
    });

    it("Should return false when moving to the previous step when the machine has multiple steps and has already moved back to the first step", () => {
        // Arrange
        const stepOne = new LinearWizardStepBase();
        const stepTwo = new LinearWizardStepBase();
        const stateMachine = new LinearWizardStateMachine([stepOne, stepTwo]);
        stateMachine.moveNext();
        stateMachine.movePrevious();

        // Act
        const result = stateMachine.movePrevious();

        // Assert
        expect(result).toBe(false);
    });

    it("Should return false and return the first step when the state machine attempts to move to next step but the step's transition conditions aren't met", () => {
        // Arrange
        const stepOne = new TestStepOne(false);
        const stepTwo = new TestStepTwo(false);
        const stateMachine = new LinearWizardStateMachine([stepOne, stepTwo]);

        // Act
        const moveResult = stateMachine.moveNext();
        const currentStepresult = stateMachine.getCurrentStep();

        // Assert
        expect(moveResult).toBe(false);
        expect(currentStepresult).toBe(stepOne);
    });

    it("Should return true and return the second step when the state machine attempts to move to next step and the step's transition conditions are met", () => {
        // Arrange
        const stepOne = new TestStepOne(true);
        const stepTwo = new TestStepTwo(false);
        const stateMachine = new LinearWizardStateMachine([stepOne, stepTwo]);

        // Act
        const moveResult = stateMachine.moveNext();
        const currentStepresult = stateMachine.getCurrentStep();

        // Assert
        expect(moveResult).toBe(true);
        expect(currentStepresult).toBe(stepTwo);
    });

    it("Should return false and return the second step when the state machine attempts to move to previous step but the step's transition conditions aren't met", () => {
        // Arrange
        const stepOne = new TestStepOne(true);
        const stepTwo = new TestStepTwo(false);
        const stateMachine = new LinearWizardStateMachine([stepOne, stepTwo]);
        stateMachine.moveNext();

        // Act
        const moveResult = stateMachine.movePrevious();
        const currentStepresult = stateMachine.getCurrentStep();

        // Assert
        expect(moveResult).toBe(false);
        expect(currentStepresult).toBe(stepTwo);
    });

    it("Should return true and return the first step when the state machine attempts to move to previous step and the step's transition conditions are met", () => {
        // Arrange
        const stepOne = new TestStepOne(true);
        const stepTwo = new TestStepTwo(true);
        const stateMachine = new LinearWizardStateMachine([stepOne, stepTwo]);
        stateMachine.moveNext();

        // Act
        const moveResult = stateMachine.movePrevious();
        const currentStepresult = stateMachine.getCurrentStep();

        // Assert
        expect(moveResult).toBe(true);
        expect(currentStepresult).toBe(stepOne);
    });
});
