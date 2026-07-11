import { CharacterClass } from "../../src/features/character-class/character-class";
import { PlayerCharacter } from "../../src/features/player-characters/player-character";
import { PlayerCharacterCreationWizard } from "../../src/features/player-characters/player-character-creation-wizard/player-character-creation-wizard";
import { Stat } from "../../src/features/stat-modifiers/stat";
import { StatModifier } from "../../src/features/stat-modifiers/stat-modifier";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { DataAccessUtils } from "../data-access/data-access-utils";
import { PlayerCharacterTestUtils } from "./player-character-test-utils";

describe("Player Character Calculated Stats", () => {
    let unitOfWork: UnitOfWork;
    let playerCharacter: PlayerCharacter;
    let wizard: PlayerCharacterCreationWizard;

    beforeEach(async () => {
        const dbContext = await DataAccessUtils.getInitializedDbContext();
        unitOfWork = new UnitOfWork(dbContext);

        playerCharacter = PlayerCharacterTestUtils.getFullyValidPlayerCharacter();

        wizard = new PlayerCharacterCreationWizard(playerCharacter, unitOfWork);
    });

    it("Should have a +10 to combat, a +10 to body save, a +20 to fear save, and a +1 max wound when the class is set to Marine.", () => {
        // Arrange
        const expectedStrength = 15;
        const expectedSpeed = 20;
        const expectedIntellect = 23;
        const expectedCombat = 26;
        const expectedSanity = 20;
        const expectedFear = 35;
        const expectedBody = 22;
        // TODO: add wound assertion
        wizard.setBaseStats(expectedStrength, expectedSpeed, expectedIntellect, expectedCombat - 10);
        wizard.setBaseSaves(expectedSanity, expectedFear - 20, expectedBody - 10);

        // Act
        wizard.setCharacterClass(getClassByName("Marine").id);

        // Assert
        expect(playerCharacter.strength).toBe(expectedStrength);
        expect(playerCharacter.speed).toBe(expectedSpeed);
        expect(playerCharacter.intellect).toBe(expectedIntellect);
        expect(playerCharacter.combat).toBe(expectedCombat);
        expect(playerCharacter.sanity).toBe(expectedSanity);
        expect(playerCharacter.fear).toBe(expectedFear);
        expect(playerCharacter.body).toBe(expectedBody);
    });

    it("Should have a +20 to intellect, a -10 to a user-selected stat, a +60 to fear save, and a +1 max wound when the class is set to Android.", () => {
        // Arrange
        const expectedStrength = 15;
        const expectedSpeed = 20;
        const expectedIntellect = 43;
        const expectedCombat = 16;
        const expectedSanity = 20;
        const expectedFear = 80;
        const expectedBody = 22;
        const userChoiceModifiers = [new StatModifier(Stat.Combat, -10)];
        // TODO: add wound assertion
        wizard.setBaseStats(expectedStrength, expectedSpeed, expectedIntellect - 20, expectedCombat + 10);
        wizard.setBaseSaves(expectedSanity, expectedFear - 60, expectedBody);

        // Act
        wizard.setCharacterClass(getClassByName("Android").id, userChoiceModifiers);

        // Assert
        expect(playerCharacter.strength).toBe(expectedStrength);
        expect(playerCharacter.speed).toBe(expectedSpeed);
        expect(playerCharacter.intellect).toBe(expectedIntellect);
        expect(playerCharacter.combat).toBe(expectedCombat);
        expect(playerCharacter.sanity).toBe(expectedSanity);
        expect(playerCharacter.fear).toBe(expectedFear);
        expect(playerCharacter.body).toBe(expectedBody);
    });

    it("Should have a +10 to intellect, a +5 to a user-selected stat, and a +30 to sanity save when the class is set to Scientist.", () => {
        // Arrange
        const expectedStrength = 15;
        const expectedSpeed = 20;
        const expectedIntellect = 43;
        const expectedCombat = 16;
        const expectedSanity = 50;
        const expectedFear = 30;
        const expectedBody = 22;
        const userChoiceModifiers = [new StatModifier(Stat.Strength, 5)];
        wizard.setBaseStats(expectedStrength - 5, expectedSpeed, expectedIntellect - 10, expectedCombat);
        wizard.setBaseSaves(expectedSanity - 30, expectedFear, expectedBody);

        // Act
        wizard.setCharacterClass(getClassByName("Scientist").id, userChoiceModifiers);

        // Assert
        expect(playerCharacter.strength).toBe(expectedStrength);
        expect(playerCharacter.speed).toBe(expectedSpeed);
        expect(playerCharacter.intellect).toBe(expectedIntellect);
        expect(playerCharacter.combat).toBe(expectedCombat);
        expect(playerCharacter.sanity).toBe(expectedSanity);
        expect(playerCharacter.fear).toBe(expectedFear);
        expect(playerCharacter.body).toBe(expectedBody);
    });

    it("Should have a +5 to all stats and a +10 to all saves when the class is set to Teamster.", () => {
        // Arrange
        const expectedStrength = 15;
        const expectedSpeed = 20;
        const expectedIntellect = 23;
        const expectedCombat = 26;
        const expectedSanity = 20;
        const expectedFear = 35;
        const expectedBody = 22;
        wizard.setBaseStats(expectedStrength - 5, expectedSpeed - 5, expectedIntellect - 5, expectedCombat - 5);
        wizard.setBaseSaves(expectedSanity - 10, expectedFear - 10, expectedBody - 10);

        // Act
        wizard.setCharacterClass(getClassByName("Teamster").id);

        // Assert
        expect(playerCharacter.strength).toBe(expectedStrength);
        expect(playerCharacter.speed).toBe(expectedSpeed);
        expect(playerCharacter.intellect).toBe(expectedIntellect);
        expect(playerCharacter.combat).toBe(expectedCombat);
        expect(playerCharacter.sanity).toBe(expectedSanity);
        expect(playerCharacter.fear).toBe(expectedFear);
        expect(playerCharacter.body).toBe(expectedBody);
    });

    function getClassByName(name: string): CharacterClass {
        return (
            unitOfWork
                .repo(CharacterClass)
                .first((characterClass) => characterClass.name.toLocaleLowerCase() === name.toLocaleLowerCase()) ??
            new CharacterClass()
        );
    }
});
