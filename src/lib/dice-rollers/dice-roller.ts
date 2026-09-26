export class DiceRoller {
    public roll(sides?: number, dice?: number): number {
        let numberOfDice = 1;

        if (!sides) return 0;

        if (sides < 1) return 0;

        if (dice && dice > 1) numberOfDice = Math.trunc(dice);

        const normalizedSides = Math.trunc(sides);
        const min = 1;
        const max = normalizedSides;
        let aggregatedRolls = 0;

        for (let index = 0; index < numberOfDice; index++) {
            aggregatedRolls += this.getRandomNumberBetweenMinAndMaxInclusiveBoth(min, max);
        }

        return aggregatedRolls;
    }

    private getRandomNumberBetweenMinAndMaxInclusiveBoth(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
