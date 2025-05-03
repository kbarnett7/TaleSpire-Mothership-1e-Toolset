import { AppEvent } from "./app-event";

export interface AppEventListener {
    (event: AppEvent): void;
}
