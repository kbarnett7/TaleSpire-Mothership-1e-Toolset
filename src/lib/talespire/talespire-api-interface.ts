export interface ITaleSpireApi {
    dice: {
        putDiceInTray: (rolls: { name: string; roll: string }[]) => void;
        evaluateDiceResultsGroup: (resultsGroupd: any) => Promise<number>;
    };

    localStorage: {
        global: {
            getBlob: () => Promise<string>;
            setBlob: (value: string) => Promise<void>;
        };
    };
}
