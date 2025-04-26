"use strict";
function logSymbioteEvent(event) {
    console.log(event);
}
function handleRollResult(event) {
    console.log(event);
    if (event.kind === "rollResults") {
        TS.dice
            .evaluateDiceResultsGroup(event.payload.resultsGroups[0])
            .then((summedRoll) => {
            const diceResultElement = document.getElementById("dice-result");
            if (diceResultElement) {
                diceResultElement.textContent =
                    "The last roll result was: " + summedRoll;
            }
        });
    }
    else if (event.kind === "rollRemoved") {
        const diceResultElement = document.getElementById("dice-result");
        if (diceResultElement) {
            diceResultElement.textContent = "A dice roll got removed!";
        }
    }
}
