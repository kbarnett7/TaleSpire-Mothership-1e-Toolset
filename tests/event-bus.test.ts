import { AppEvent } from "../src/lib/events/app-event";
import { AppEventListener } from "../src/lib/events/app-event-listener-interface";
import { EventBus } from "../src/lib/events/event-bus";
import { ChildEvent } from "./models/child-event";

describe("Event Service", () => {
    let counter: number;
    let callbackMap: Map<string, AppEventListener>;

    beforeEach(() => {
        counter = 0;
        callbackMap = new Map();
    });

    afterEach(() => {
        callbackMap.forEach((value, key) => {
            EventBus.instance.unregister(key, value);
        });
    });

    it("dispatching an event triggers a callback", () => {
        // Arrange
        const type = "test-event";
        const event = new AppEvent(type);
        let wasCaught = false;

        const callback = (event: AppEvent) => {
            wasCaught = true;
        };

        registerEvent(type, callback);

        // Act
        EventBus.instance.dispatch(event);

        // Assert
        expect(wasCaught).toBe(true);
    });

    it("dispatching an event triggers multiple callbacks", () => {
        // Arrange
        const event = new AppEvent(AppEvent.name);
        let wasACaught = false;
        let wasBCaught = false;

        const callbackA = (event: AppEvent) => {
            wasACaught = true;
        };

        const callbackB = (event: AppEvent) => {
            wasBCaught = true;
        };

        registerEvent(AppEvent.name, callbackA);
        registerEvent(AppEvent.name, callbackB);

        // Act
        EventBus.instance.dispatch(event);

        // Assert
        expect(wasACaught).toBe(true);
        expect(wasBCaught).toBe(true);
    });

    it("dispatching a child event triggers a callback", () => {
        // Arrange
        const expectedValue = "Hello World!";
        const event = new ChildEvent(expectedValue);
        let result = "";

        const callback = (event: AppEvent) => {
            const castedEvent = event as ChildEvent;
            result = castedEvent.value;
        };

        registerEvent(ChildEvent.name, callback);

        // Act
        EventBus.instance.dispatch(event);

        // Assert
        expect(result).toBe(expectedValue);
    });

    function registerEvent(type: string, callback: AppEventListener) {
        callbackMap.set(type, callback);

        EventBus.instance.register(type, callback);
    }
});
