import { PlayerCharacter } from "../../src/features/player-characters/player-character";
import { PlayerCharacterListItem } from "../../src/features/player-characters/player-character-list-item";
import { Stat } from "../../src/features/stat-modifiers/stat";
import { StatModifier } from "../../src/features/stat-modifiers/stat-modifier";
import { StatSource } from "../../src/features/stat-modifiers/stat-source";

export class PlayerCharacterTestUtils {
    static getPlayerCharacterItemByName(
        playerCharacters: PlayerCharacterListItem[],
        name: string,
    ): PlayerCharacterListItem {
        const foundItem = playerCharacters.find((pc) => pc.name.toLocaleLowerCase() === name.toLocaleLowerCase());

        return foundItem || new PlayerCharacterListItem(0, "", 0, "", "");
    }

    static expectPlayerCharacterToBe(
        actualPlayerCharacter: PlayerCharacterListItem,
        expectedId: number,
        expectedName: string,
        expectedCharacterClass: string,
    ) {
        expect(actualPlayerCharacter.id).toBe(expectedId);
        expect(actualPlayerCharacter.name).toBe(expectedName);
        expect(actualPlayerCharacter.characterClass).toBe(expectedCharacterClass);
    }

    static getFullyValidPlayerCharacter(): PlayerCharacter {
        const pc = new PlayerCharacter(
            1,
            "Jane Doe",
            1,
            "A fully created player character.",
            25,
            30,
            35,
            40,
            10,
            15,
            20,
        );

        pc.addStatModifiers([
            new StatModifier(Stat.Strength, 5, StatSource.Custom),
            new StatModifier(Stat.Fear, -10, StatSource.Custom),
        ]);

        return pc;
    }
}
