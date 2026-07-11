import { PlayerCharacter } from "../../src/features/player-characters/player-character";
import { PlayerCharacterCreationWizard } from "../../src/features/player-characters/player-character-creation-wizard/player-character-creation-wizard";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { PlayerCharacterTestUtils } from "./player-character-test-utils";

describe("PlayerCharacterCreationWizard", () => {
    let unitOfWork: UnitOfWork;
    let playerCharacter: PlayerCharacter;
    let wizard: PlayerCharacterCreationWizard;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);

        playerCharacter = PlayerCharacterTestUtils.getFullyValidPlayerCharacter();

        wizard = new PlayerCharacterCreationWizard(playerCharacter, unitOfWork);
    });

    it("Should have a total of nine steps.", () => {
        // Arrange
        // Act
        // Assert
        expect(wizard.stepsCount).toBe(9);
    });

    it("First step should be Roll Stats.", () => {
        // Arrange
        // Act
        const currentStep = wizard.getCurrentStep();

        // Assert
        expect(currentStep?.title).toBe("Roll Stats");
    });

    it("Second step should be Roll Saves.", () => {
        // Arrange
        moveForwardXSteps(1);

        // Act
        const currentStep = wizard.getCurrentStep();

        // Assert
        expect(currentStep?.title).toBe("Roll Saves");
    });

    it("Third step should be Choose Class.", () => {
        // Arrange
        moveForwardXSteps(2);

        // Act
        const currentStep = wizard.getCurrentStep();

        // Assert
        expect(currentStep?.title).toBe("Choose Class");
    });

    it("Fourth step should be Roll Health.", () => {
        // Arrange
        moveForwardXSteps(3);

        // Act
        const currentStep = wizard.getCurrentStep();

        // Assert
        expect(currentStep?.title).toBe("Roll Health");
    });

    it("Fifth step should be Gain Stress.", () => {
        // Arrange
        moveForwardXSteps(4);

        // Act
        const currentStep = wizard.getCurrentStep();

        // Assert
        expect(currentStep?.title).toBe("Gain Stress");
    });

    it("Sixth step should be Note Trauma Response.", () => {
        // Arrange
        moveForwardXSteps(5);

        // Act
        const currentStep = wizard.getCurrentStep();

        // Assert
        expect(currentStep?.title).toBe("Note Trauma Response");
    });

    it("Seventh step should be Choose Skills.", () => {
        // Arrange
        moveForwardXSteps(6);

        // Act
        const currentStep = wizard.getCurrentStep();

        // Assert
        expect(currentStep?.title).toBe("Choose Skills");
    });

    it("Eigth step should be Choose Skills.", () => {
        // Arrange
        moveForwardXSteps(7);

        // Act
        const currentStep = wizard.getCurrentStep();

        // Assert
        expect(currentStep?.title).toBe("Roll Loadout");
    });

    it("Ninth step should be Finishing.", () => {
        // Arrange
        moveForwardXSteps(8);

        // Act
        const currentStep = wizard.getCurrentStep();

        // Assert
        expect(currentStep?.title).toBe("Finishing");
    });

    it("Should not move to step 2 when the PC's strength stat has not been set", () => {
        // Arrange
        playerCharacter.baseStrength = -1;

        // Act
        const result = wizard.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    it("Should not move to step 2 when the PC's speed stat has not been set", () => {
        // Arrange
        playerCharacter.baseSpeed = -1;

        // Act
        const result = wizard.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    it("Should not move to step 2 when the PC's intellect stat has not been set", () => {
        // Arrange
        playerCharacter.baseIntellect = -1;

        // Act
        const result = wizard.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    it("Should not move to step 2 when the PC's combat stat has not been set", () => {
        // Arrange
        playerCharacter.baseCombat = -1;

        // Act
        const result = wizard.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    it("Should move to step 2 when all the PC's base stats have been set", () => {
        // Arrange
        const expectedStrength = 10;
        const expectedSpeed = 20;
        const expectedIntellect = 30;
        const expectedCombat = 40;
        playerCharacter.baseStrength = -1;
        playerCharacter.baseSpeed = -1;
        playerCharacter.baseIntellect = -1;
        playerCharacter.baseCombat = -1;
        const firstResult = wizard.moveNext();

        // Act
        wizard.setBaseStats(expectedStrength, expectedSpeed, expectedIntellect, expectedCombat);

        const secondResult = wizard.moveNext();

        // Assert
        expect(firstResult).toBe(false);
        expect(secondResult).toBe(true);
        expect(playerCharacter.baseStrength).toBe(expectedStrength);
        expect(playerCharacter.baseSpeed).toBe(expectedSpeed);
        expect(playerCharacter.baseIntellect).toBe(expectedIntellect);
        expect(playerCharacter.baseCombat).toBe(expectedCombat);
    });

    it("Should not move to step 3 when the PC's sanity save has not been set", () => {
        // Arrange
        playerCharacter.baseSanity = -1;
        moveForwardXSteps(1);

        // Act
        const result = wizard.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    it("Should not move to step 3 when the PC's fear save has not been set", () => {
        // Arrange
        playerCharacter.baseFear = -1;
        moveForwardXSteps(1);

        // Act
        const result = wizard.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    it("Should not move to step 3 when the PC's body save has not been set", () => {
        // Arrange
        playerCharacter.baseBody = -1;
        moveForwardXSteps(1);

        // Act
        const result = wizard.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    it("Should move to step 3 when all the PC's base saves have been set", () => {
        // Arrange
        const expectedSanity = 10;
        const expectedFear = 20;
        const expectedBody = 30;
        playerCharacter.baseSanity = -1;
        playerCharacter.baseFear = -1;
        playerCharacter.baseBody = -1;
        moveForwardXSteps(1);
        const firstResult = wizard.moveNext();

        // Act
        wizard.setBaseSaves(expectedSanity, expectedFear, expectedBody);

        const secondResult = wizard.moveNext();

        // Assert
        expect(firstResult).toBe(false);
        expect(secondResult).toBe(true);
        expect(playerCharacter.baseSanity).toBe(expectedSanity);
        expect(playerCharacter.baseFear).toBe(expectedFear);
        expect(playerCharacter.baseBody).toBe(expectedBody);
    });

    it("Should not move to step 4 when the PC's character class has not been set", () => {
        // Arrange
        playerCharacter.characterClassId = 0;
        moveForwardXSteps(2);

        // Act
        const result = wizard.moveNext();

        // Assert
        expect(result).toBe(false);
    });

    it("Should move to step 4 when the PC class has been set", () => {
        // Arrange
        const expectedCharacterClassId = 2;
        playerCharacter.characterClassId = -1;
        moveForwardXSteps(2);
        const firstResult = wizard.moveNext();

        // Act
        wizard.setCharacterClass(expectedCharacterClassId);

        const secondResult = wizard.moveNext();

        // Assert
        expect(firstResult).toBe(false);
        expect(secondResult).toBe(true);
        expect(playerCharacter.characterClassId).toBe(expectedCharacterClassId);
    });

    function moveForwardXSteps(numberOfSteps: number) {
        for (let currentStep = 0; currentStep < numberOfSteps; currentStep++) {
            wizard.moveNext();
        }
    }
});
