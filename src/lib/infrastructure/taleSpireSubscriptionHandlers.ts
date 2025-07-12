import { AppLogger } from "../logging/app-logger";

declare const TS: any;

function logSymbioteEvent(event: any) {
    AppLogger.instance.info("Symbiote Event", event);
}

async function onStateChangeEvent(event: any) {
    if (event.kind === "hasInitialized") {
        //AppLogger.instance.info("hasInitialized", event);
        console.info("onStateChangeEvent.hasInitialized()...");
    }
}

function handleRollResult(event: { kind: string; payload: any }): void {
    AppLogger.instance.info("Roll Result Event", event);

    if (event.kind === "rollResults") {
        TS.dice.evaluateDiceResultsGroup(event.payload.resultsGroups[0]).then((summedRoll: number) => {
            const diceResultElement = document.getElementById("dice-result");
            if (diceResultElement) {
                diceResultElement.textContent = "The last roll result was: " + summedRoll;
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
// This is a workaround to make the functions available in the global scope
// so that TaleSpire can call them as configured by manifest.json.
(window as any).logSymbioteEvent = logSymbioteEvent;
(window as any).onStateChangeEvent = onStateChangeEvent;
(window as any).handleRollResult = handleRollResult;
