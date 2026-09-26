import { DiceRoller } from "../../src/lib/dice-rollers/dice-roller";

describe("DiceRoller", () => {
    let diceRoller: DiceRoller;

    beforeEach(async () => {
        diceRoller = new DiceRoller();
    });

    it("Should return 0 when rolling without specifying parameters", () => {
        // Arrange
        // Act
        const result = diceRoller.roll();

        // Assert
        expect(result).toBe(0);
    });

    it("Should return 0 when rolling a negative-sided dice", () => {
        // Arrange
        // Act
        const result = diceRoller.roll(-6);

        // Assert
        expect(result).toBe(0);
    });

    it("Should return 1 when rolling 1d1", () => {
        // Arrange
        // Act
        const result = diceRoller.roll(1);

        // Assert
        expect(result).toBe(1);
    });

    it("Should truncate dice sides greater than 1 with decimals", () => {
        // Arrange
        // Act
        const result = diceRoller.roll(1.5);

        // Assert
        expect(result).toBe(1);
    });

    it("Should return 0 for dice sides between 0 and 1", () => {
        // Arrange
        // Act
        const result = diceRoller.roll(0.45);

        // Assert
        expect(result).toBe(0);
    });

    it("Should return a 1 within one-hundred rolls for a 1d2 dice", () => {
        // Arrange
        // Act
        const results = rollDice(100, 2);

        // Assert
        expect(results).toContain(1);
    });

    it("Should return a 2 within one-hundred rolls for a 1d2 dice", () => {
        // Arrange
        // Act
        const results = rollDice(100, 2);

        // Assert
        expect(results).toContain(2);
    });

    it("Should return all numbers between 1 and 6 within 600 rolls for a 1d6 dice", () => {
        // Arrange
        // Act
        const results = rollDice(600, 6);

        // Assert
        expect(results).toContain(1);
        expect(results).toContain(2);
        expect(results).toContain(3);
        expect(results).toContain(4);
        expect(results).toContain(5);
        expect(results).toContain(6);
    });

    it("Should not contain any values less than 1 and greater than 6 within 600 rolls for a 1d6 dice", () => {
        // Arrange
        // Act
        const results = rollDice(600, 6);

        // Assert
        for (const result of results) {
            expect(result).toBeGreaterThanOrEqual(1);
            expect(result).toBeLessThanOrEqual(6);
        }
    });

    function rollDice(numberOfRolls: number, sides: number): number[] {
        let results: number[] = [];

        for (let index = 0; index < numberOfRolls; index++) {
            results.push(diceRoller.roll(sides));
        }
        return results;
    }
});
