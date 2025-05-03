import { AppEvent } from "./app-event";
import { AppEventListener } from "./app-event-listener-interface";

export class EventService {
    private _eventBus: EventTarget;
    private static _instance: EventService;

    private constructor() {
        this._eventBus = new EventTarget();
    }

    public static get instance(): EventService {
        if (!EventService._instance) {
            EventService._instance = new EventService();
        }

        return EventService._instance;
    }

    dispatchEvent(event: AppEvent) {
        const customEvent = new CustomEvent<AppEvent>(event.type, {
            detail: event,
            bubbles: true, // Allow the event to bubble up
            composed: true, // Allow the event to pass through shadow DOM boundaries
        });

        this._eventBus.dispatchEvent(customEvent);
    }

    addEventListener(type: string, callback: AppEventListener) {
        this._eventBus.addEventListener(type, (event: Event) => {
            const customEvent = event as CustomEvent<AppEvent>;
            callback(customEvent.detail);
        });
    }
}
