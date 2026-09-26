export class DiceRoller {
    public roll(sides?: number): number {
        if (!sides) return 0;

        if (sides < 1) return 0;

        const normalizedSides = Math.trunc(sides);
        const min = 1;
        const max = normalizedSides;

        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
