import { AppEvent } from "../src/lib/events/app-event";
import { EventService } from "../src/lib/services/event-service";

describe("Event Service", () => {
    it("dispatching an event triggers a callback", () => {
        // Arrange
        const type = "test-event";
        const event = new AppEvent(type);
        let wasCaught = false;

        // Act
        EventService.instance.addEventListener(type, (event: AppEvent) => {
            wasCaught = true;
        });

        EventService.instance.dispatchEvent(event);

        // Assert
        expect(wasCaught).toBe(true);
    });

    it("dispatching an event triggers multiple callbacks", () => {
        // Arrange
        const type = "test-event";
        const event = new AppEvent(type);
        let wasACaught = false;
        let wasBCaught = false;

        // Act
        EventService.instance.addEventListener(type, (event: AppEvent) => {
            wasACaught = true;
        });

        EventService.instance.addEventListener(type, (event: AppEvent) => {
            wasBCaught = true;
        });

        EventService.instance.dispatchEvent(event);

        // Assert
        expect(wasACaught).toBe(true);
        expect(wasBCaught).toBe(true);
    });
});
