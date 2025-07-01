import { CreateCustomNpcFeature } from "../../src/features/npcs/create-custom-npc/create-custom-npc-feature";
import { CreateCustomNpcRequest } from "../../src/features/npcs/create-custom-npc/create-custom-npc-request";
import { Npc } from "../../src/features/npcs/npc";
import { NpcAttack } from "../../src/features/npcs/npc-attack";
import { NpcSpecialAbility } from "../../src/features/npcs/npc-special-ability";
import { UnitOfWork } from "../../src/lib/data-access/unit-of-work";
import { ErrorCode } from "../../src/lib/errors/error-code";
import { UnitTestDatabase } from "../data/unit-test-database";

describe("CreateCustomNpcFeature", () => {
    const fiftyCharacterLongName: string = "Lorem ipsum dolor sit amet consectetur adipiscingel";
    let request: CreateCustomNpcRequest;
    let feature: CreateCustomNpcFeature;

    beforeEach(() => {
        const db = new UnitTestDatabase();
        const unitOfWork = new UnitOfWork(db);

        request = new CreateCustomNpcRequest();
        feature = new CreateCustomNpcFeature(unitOfWork);
    });

    it.each([[""], [" "]])("should fail if the name is empty or whitespace", (name: string) => {
        // Arrange
        let npc: Npc = getValidCustomNpc();
        npc.name = name;
        request.npc = npc;

        // Act
        const result = feature.handle(request);

        // Assert
        expect(result.isFailure).toBe(true);
        expect(result.value).not.toBeDefined();
        expect(result.error).toBeDefined();
        expect(result.error.code).toBe(ErrorCode.CreateError);
        expect(result.error.description).toContain("name");
        expect(result.error.description).toContain("empty");
    });

    it("should fail if the name is greater than 50 characters long", () => {
        // Arrange
        let npc: Npc = getValidCustomNpc();
        npc.name = fiftyCharacterLongName;
        request.npc = npc;

        // Act
        const result = feature.handle(request);

        // Assert
        expect(result.isFailure).toBe(true);
        expect(result.value).not.toBeDefined();
        expect(result.error).toBeDefined();
        expect(result.error.code).toBe(ErrorCode.CreateError);
        expect(result.error.description).toContain("name");
        expect(result.error.description).toContain("50");
    });

    function getValidCustomNpc(): Npc {
        return new Npc(
            999,
            1,
            "Custom Test NPC",
            35,
            40,
            3,
            25,
            2,
            "This is a fake NPC used for testing.",
            [
                new NpcAttack("Fake Attack 1", "1d10"),
                new NpcAttack("Fake Attack 2", "Sanity save or become stunned for one round."),
            ],
            [
                new NpcSpecialAbility("Test Ability 1: Does scary stuff."),
                new NpcSpecialAbility("Test Ability 2: More scary stuff."),
            ]
        );
    }
});
