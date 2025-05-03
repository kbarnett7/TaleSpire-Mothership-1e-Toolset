import { AppEvent } from "../src/lib/events/app-event";
import { EventBus } from "../src/lib/events/event-bus";
import { ChildEvent } from "./models/child-event";

describe("Event Service", () => {
    it("dispatching an event triggers a callback", () => {
        // Arrange
        const type = "test-event";
        const event = new AppEvent(type);
        let wasCaught = false;

        // Act
        EventBus.instance.addEventListener(type, (event: AppEvent) => {
            wasCaught = true;
        });

        EventBus.instance.dispatchEvent(event);

        // Assert
        expect(wasCaught).toBe(true);
    });

    it("dispatching an event triggers multiple callbacks", () => {
        // Arrange
        const event = new AppEvent(AppEvent.name);
        let wasACaught = false;
        let wasBCaught = false;

        // Act
        EventBus.instance.addEventListener(AppEvent.name, (event: AppEvent) => {
            wasACaught = true;
        });

        EventBus.instance.addEventListener(AppEvent.name, (event: AppEvent) => {
            wasBCaught = true;
        });

        EventBus.instance.dispatchEvent(event);

        // Assert
        expect(wasACaught).toBe(true);
        expect(wasBCaught).toBe(true);
    });

    it("dispatching a child event triggers a callback", () => {
        // Arrange
        const expectedValue = "Hello World!";
        const event = new ChildEvent(expectedValue);
        let result = "";

        // Act
        EventBus.instance.addEventListener(ChildEvent.name, (event: AppEvent) => {
            const castedEvent = event as ChildEvent;
            result = castedEvent.value;
        });

        EventBus.instance.dispatchEvent(event);

        // Assert
        expect(result).toBe(expectedValue);
    });
});
