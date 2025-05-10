import html from "./about.component.html";
import { BaseComponent } from "../../base.component";
import { EventBus } from "../../../lib/events/event-bus";
import { AppErrorEvent } from "../../../lib/events/app-error-event";
import { EventType } from "../../../lib/events/event-type";

export class AboutComponent extends BaseComponent {
    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);

        EventBus.instance.dispatch(new AppErrorEvent(EventType.ErrorPanelShow, "FAKE"));
    }
}

customElements.define("about-page", AboutComponent);
