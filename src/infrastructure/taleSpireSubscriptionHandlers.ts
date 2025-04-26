function onLogSymbioteEvent(event: any) {
    console.log(event);
}

function onHandleRollResult(event: { kind: string; payload: any }): void {
    console.log(event);
    if (event.kind === "rollResults") {
        TS.dice
            .evaluateDiceResultsGroup(event.payload.resultsGroups[0])
            .then((summedRoll: number) => {
                const diceResultElement =
                    document.getElementById("dice-result");
                if (diceResultElement) {
                    diceResultElement.textContent =
                        "The last roll result was: " + summedRoll;
                }
            });
    } else if (event.kind === "rollRemoved") {
        const diceResultElement = document.getElementById("dice-result");
        if (diceResultElement) {
            diceResultElement.textContent = "A dice roll got removed!";
        }
    }
}

// Expose functions globally
(window as any).onLogSymbioteEvent = onLogSymbioteEvent;
(window as any).onHandleRollResult = onHandleRollResult;
