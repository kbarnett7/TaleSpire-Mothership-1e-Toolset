import { AppEvent } from "./app-event";
import { AppEventListener } from "./app-event-listener-interface";

/**
 * A singleton class that acts as a global event bus for dispatching and listening to application events.
 *
 * The `EventBus` uses the `EventTarget` API to manage custom events, allowing components to communicate
 * with each other in a decoupled manner. Events are dispatched as `CustomEvent` objects, and listeners
 * can register callbacks for specific event types.
 */
export class EventBus {
    private _eventBus: EventTarget;
    private static _instance: EventBus;

    private constructor() {
        this._eventBus = new EventTarget();
    }

    /**
     * Gets the singleton instance of the `EventBus`.
     *
     * @returns {EventBus} The singleton instance of the `EventBus`.
     */
    public static get instance(): EventBus {
        if (!EventBus._instance) {
            EventBus._instance = new EventBus();
        }

        return EventBus._instance;
    }

    /**
     * Dispatches an application event.
     *
     * The event is wrapped in a `CustomEvent` object and dispatched on the internal `EventTarget`.
     * The event can bubble and pass through shadow DOM boundaries.
     *
     * @param {AppEvent} event - The application event to dispatch.
     */
    public dispatch(event: AppEvent) {
        const customEvent = new CustomEvent<AppEvent>(event.type, {
            detail: event,
            bubbles: true, // Allow the event to bubble up
            composed: true, // Allow the event to pass through shadow DOM boundaries
        });

        this._eventBus.dispatchEvent(customEvent);
    }

    /**
     * Registers a listener for a specific event type.
     *
     * The listener is called whenever an event of the specified type is dispatched.
     *
     * @param {string} type - The type of the event to listen for.
     * @param {AppEventListener} callback - The callback function to invoke when the event is dispatched.
     * The callback receives the `AppEvent` object as its argument.
     */
    public register(type: string, callback: AppEventListener) {
        this._eventBus.addEventListener(type, (event: Event) => {
            const customEvent = event as CustomEvent<AppEvent>;
            callback(customEvent.detail);
        });
    }

    /**
     * Registers a listener for a browser event type.
     *
     * This method allows components to listen for standard browser events (e.g., "click", "popstate")
     * or custom events dispatched on the `window` global oject.
     *
     * @param {string} type - The type of the browser event to listen for.
     * @param {EventListenerOrEventListenerObject} callback - The callback function or event listener object
     * to invoke when the event is triggered. The callback receives the `Event` object as its argument.
     */
    public registerBrowserEvent(type: string, callback: EventListenerOrEventListenerObject) {
        window.addEventListener(type, callback);
    }

    /**
     * Unregisters a listener for a specific browser event type.
     *
     * This method removes a previously registered event listener for standard browser events
     * (e.g., "click", "keyup") or custom events dispatched on the `window` global object.
     *
     * @param {string} type - The type of the browser event to stop listening for.
     * @param {EventListenerOrEventListenerObject} callback - The callback function or event listener object
     * that was previously registered with `registerBrowserEvent`. This must be the same reference as the one
     * used during registration.
     *
     * @example
     * // Registering an event listener
     * const onKeyUp = (event: KeyboardEvent) => {
     *     if (event.key === "Escape") {
     *         console.log("Escape key pressed");
     *     }
     * };
     * EventBus.instance.registerBrowserEvent("keyup", onKeyUp);
     *
     * // Unregistering the event listener
     * EventBus.instance.unregisterBrowserEvent("keyup", onKeyUp);
     *
     * @remarks
     * If the callback provided does not match a previously registered listener, the method will have no effect.
     * This ensures that only the intended listener is removed.
     */
    public unregisterBrowserEvent(type: string, callback: EventListenerOrEventListenerObject) {
        window.removeEventListener(type, callback);
    }
}
