// Assuming TS is part of an external library, import or define it here
declare const TS: {
    dice: {
        putDiceInTray: (rolls: { name: string; roll: string }[]) => void;
        evaluateDiceResultsGroup: (resultsGroupd: any) => Promise<number>;
    };
};
