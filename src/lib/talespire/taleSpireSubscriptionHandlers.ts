import { appInjector } from "../infrastructure/app-injector";
import { ITaleSpireApi } from "./talespire-api-interface";
import { AppLogFormatter } from "../logging/app-log-formatter";

declare const TS: ITaleSpireApi;

function logTaleSpireApiEvent(handlerName: string, event: any) {
    console.info(AppLogFormatter.format("info", `TaleSpire API event: ${handlerName} --> ${event.kind}`), event);
}

function handleOnVisibilityEvent(event: any) {
    logTaleSpireApiEvent("onVisibilityEvent", event);
}

async function handleOnStateChangeEvent(event: any) {
    logTaleSpireApiEvent("onStateChangeEvent", event);

    if (event.kind === "hasInitialized") {
        const startup = appInjector.resolve("startup");
        startup.setTaleSpireApiInitialized();
    }
}

function handleOnRollResults(event: { kind: string; payload: any }): void {
    logTaleSpireApiEvent("handleOnRollResults", event);

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
(window as any).handleOnVisibilityEvent = handleOnVisibilityEvent;
(window as any).handleOnStateChangeEvent = handleOnStateChangeEvent;
(window as any).handleOnRollResults = handleOnRollResults;
