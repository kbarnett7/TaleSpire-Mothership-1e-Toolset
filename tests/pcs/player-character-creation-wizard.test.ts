import { PlayerCharacterCreationWizard } from "../../src/features/player-characters/player-character-creation-wizard/player-character-creation-wizard";

describe("PlayerCharacterCreationWizard", () => {
    let stateMachine: PlayerCharacterCreationWizard;

    beforeEach(async () => {
        stateMachine = new PlayerCharacterCreationWizard();
    });

    it("Should have a total of nine steps.", () => {
        // Arrange
        // Act
        // Assert
        expect(stateMachine.stepsCount).toBe(9);
    });

    it("First step should be Roll Stats.", () => {
        // Arrange
        // Act
        const currentStep = stateMachine.getCurrentStep();

        // Assert
        expect(currentStep?.title).toBe("Roll Stats");
    });

    it("Second step should be Roll Saves.", () => {
        // Arrange
        moveForwardXSteps(1);

        // Act
        const currentStep = stateMachine.getCurrentStep();

        // Assert
        expect(currentStep?.title).toBe("Roll Saves");
    });

    it("Third step should be Choose Class.", () => {
        // Arrange
        moveForwardXSteps(2);

        // Act
        const currentStep = stateMachine.getCurrentStep();

        // Assert
        expect(currentStep?.title).toBe("Choose Class");
    });

    it("Fourth step should be Roll Health.", () => {
        // Arrange
        moveForwardXSteps(3);

        // Act
        const currentStep = stateMachine.getCurrentStep();

        // Assert
        expect(currentStep?.title).toBe("Roll Health");
    });

    it("Fifth step should be Gain Stress.", () => {
        // Arrange
        moveForwardXSteps(4);

        // Act
        const currentStep = stateMachine.getCurrentStep();

        // Assert
        expect(currentStep?.title).toBe("Gain Stress");
    });

    it("Sixth step should be Note Trauma Response.", () => {
        // Arrange
        moveForwardXSteps(5);

        // Act
        const currentStep = stateMachine.getCurrentStep();

        // Assert
        expect(currentStep?.title).toBe("Note Trauma Response");
    });

    it("Seventh step should be Choose Skills.", () => {
        // Arrange
        moveForwardXSteps(6);

        // Act
        const currentStep = stateMachine.getCurrentStep();

        // Assert
        expect(currentStep?.title).toBe("Choose Skills");
    });

    it("Eigth step should be Choose Skills.", () => {
        // Arrange
        moveForwardXSteps(7);

        // Act
        const currentStep = stateMachine.getCurrentStep();

        // Assert
        expect(currentStep?.title).toBe("Roll Loadout");
    });

    it("Ninth step should be Finishing.", () => {
        // Arrange
        moveForwardXSteps(8);

        // Act
        const currentStep = stateMachine.getCurrentStep();

        // Assert
        expect(currentStep?.title).toBe("Finishing");
    });

    function moveForwardXSteps(numberOfSteps: number) {
        for (let currentStep = 0; currentStep < numberOfSteps; currentStep++) {
            stateMachine.moveNext();
        }
    }
});
