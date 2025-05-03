import html from "./error-panel.html";
import { BaseComponent } from "../base.component";
import { EventBus } from "../../lib/events/event-bus";
import { AppEvent } from "../../lib/events/app-event";
import { AppErrorEvent } from "../../lib/events/app-error-event";
import { EventType } from "../../lib/events/event-type";

export class ErrorPanelComponent extends BaseComponent {
    private readonly errorPanelId = "errorPanel";
    private readonly errorDetailsId = "errorDetails";

    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);

        this.registerShowErrorEvent();
        this.registerHideErrorEvent();
    }

    private registerShowErrorEvent() {
        EventBus.instance.register(EventType.ErrorPanelShow, (event: AppEvent) => {
            this.handleShowEvent(event as AppErrorEvent);
        });
    }

    private registerHideErrorEvent() {
        EventBus.instance.register(EventType.ErrorPanelHide, (event: AppEvent) => {
            this.handleHideEvent(event);
        });
    }

    private handleShowEvent(event: AppErrorEvent) {
        const panel = this.shadow.querySelector(`#${this.errorPanelId}`);
        const details = this.shadow.querySelector(`#${this.errorDetailsId}`);

        panel?.classList.remove("hidden");

        if (!details) return;

        details.innerHTML = event.error;
    }

    private handleHideEvent(event: AppEvent) {
        const panel = this.shadow.querySelector(`#${this.errorPanelId}`);

        panel?.classList.add("hidden");
    }
}

customElements.define("error-panel", ErrorPanelComponent);
