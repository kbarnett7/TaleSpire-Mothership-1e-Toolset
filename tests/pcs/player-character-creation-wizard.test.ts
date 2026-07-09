import { PlayerCharacter } from "../../src/features/player-characters/player-character";
import { PlayerCharacterCreationWizard } from "../../src/features/player-characters/player-character-creation-wizard/player-character-creation-wizard";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { DataAccessUtils } from "../data-access/data-access-utils";

describe("PlayerCharacterCreationWizard", () => {
    let unitOfWork: UnitOfWork;
    let playerCharacter: PlayerCharacter;
    let stateMachine: PlayerCharacterCreationWizard;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);

        playerCharacter = getFullyValidPlayerCharacter();

        stateMachine = new PlayerCharacterCreationWizard(playerCharacter, unitOfWork);
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

    it("Should not move to step 2 when the PC's strength stat has not been set", () => {
        // Arrange
        playerCharacter.strength = -1;

        // Act
        const result = stateMachine.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    it("Should not move to step 2 when the PC's speed stat has not been set", () => {
        // Arrange
        playerCharacter.speed = -1;

        // Act
        const result = stateMachine.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    it("Should not move to step 2 when the PC's intellect stat has not been set", () => {
        // Arrange
        playerCharacter.intellect = -1;

        // Act
        const result = stateMachine.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    it("Should not move to step 2 when the PC's combat stat has not been set", () => {
        // Arrange
        playerCharacter.combat = -1;

        // Act
        const result = stateMachine.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    it("Should move to step 2 when all the PC's base stats have been set", () => {
        // Arrange
        const expectedStrength = 10;
        const expectedSpeed = 20;
        const expectedIntellect = 30;
        const expectedCombat = 40;
        playerCharacter.strength = -1;
        playerCharacter.speed = -1;
        playerCharacter.intellect = -1;
        playerCharacter.combat = -1;
        const firstResult = stateMachine.moveNext();

        // Act
        stateMachine.setBaseStats(expectedStrength, expectedSpeed, expectedIntellect, expectedCombat);

        const secondResult = stateMachine.moveNext();

        // Assert
        expect(firstResult).toBe(false);
        expect(secondResult).toBe(true);
        expect(playerCharacter.strength).toBe(expectedStrength);
        expect(playerCharacter.speed).toBe(expectedSpeed);
        expect(playerCharacter.intellect).toBe(expectedIntellect);
        expect(playerCharacter.combat).toBe(expectedCombat);
    });

    it("Should not move to step 3 when the PC's sanity save has not been set", () => {
        // Arrange
        playerCharacter.sanity = -1;
        moveForwardXSteps(1);

        // Act
        const result = stateMachine.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    it("Should not move to step 3 when the PC's fear save has not been set", () => {
        // Arrange
        playerCharacter.fear = -1;
        moveForwardXSteps(1);

        // Act
        const result = stateMachine.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    it("Should not move to step 3 when the PC's body save has not been set", () => {
        // Arrange
        playerCharacter.body = -1;
        moveForwardXSteps(1);

        // Act
        const result = stateMachine.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    it("Should not move to step 4 when the PC's character class has not been set", () => {
        // Arrange
        playerCharacter.characterClassId = 0;
        moveForwardXSteps(2);

        // Act
        const result = stateMachine.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    function moveForwardXSteps(numberOfSteps: number) {
        for (let currentStep = 0; currentStep < numberOfSteps; currentStep++) {
            stateMachine.moveNext();
        }
    }

    function getFullyValidPlayerCharacter(): PlayerCharacter {
        return new PlayerCharacter(1, "Jane Doe", 1, "A fully created player character.", 25, 30, 35, 40, 10, 15, 20);
    }
});
