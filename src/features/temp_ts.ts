import { ITaleSpireApi } from "../lib/talespire/talespire-api-interface";

declare const TS: ITaleSpireApi;

function roll_ts() {
    TS.dice.putDiceInTray([{ name: "example roll", roll: "D20" }]);
}
