import html from "./error-panel.html";
import { BaseComponent } from "../base.component";
import { EventBus } from "../../lib/events/event-bus";
import { AppEvent } from "../../lib/events/app-event";
import { AppErrorEvent } from "../../lib/events/app-error-event";
import { EventType } from "../../lib/events/event-type";

export class ErrorPanelComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);

        this.registerShowErrorEvent();
        this.registerHideEvent();
    }

    private registerShowErrorEvent() {
        EventBus.instance.register(EventType.ErrorPanelShow, (event: AppEvent) => {
            const panel = this.shadow.querySelector("#errorPanel");
            const details = this.shadow.querySelector("#errorDetails");

            panel?.classList.remove("hidden");

            if (!details) return;

            details.innerHTML = (event as AppErrorEvent).error;
        });
    }

    private registerHideEvent() {
        EventBus.instance.register(EventType.ErrorPanelHide, (event: AppEvent) => {
            const panel = this.shadow.querySelector("#errorPanel");

            panel?.classList.add("hidden");
        });
    }
}

customElements.define("error-panel", ErrorPanelComponent);
