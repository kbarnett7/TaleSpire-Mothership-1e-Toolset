import html from "./error-panel.html";
import { BaseComponent } from "../base.component";
import { EventBus } from "../../lib/events/event-bus";
import { AppEvent } from "../../lib/events/app-event";
import { AppErrorEvent } from "../../lib/events/app-error-event";
import { EventType } from "../../lib/events/event-type";
import { AppEventListener } from "../../lib/events/app-event-listener-interface";

export class ErrorPanelComponent extends BaseComponent {
    private readonly errorPanelId = "errorPanel";
    private readonly errorDescriptionId = "errorDescription";
    private readonly errorDetailsId = "errorDetails";

    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);

        EventBus.instance.register(EventType.ErrorPanelShow, this.onShowErrorEvent);
        EventBus.instance.register(EventType.ErrorPanelHide, this.onHideErrorEvent);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(EventType.ErrorPanelShow, this.onShowErrorEvent);
        EventBus.instance.unregister(EventType.ErrorPanelHide, this.onHideErrorEvent);
    }

    private onShowErrorEvent: AppEventListener = (event: AppEvent) => {
        this.handleShowEvent(event as AppErrorEvent);
    };

    private onHideErrorEvent: AppEventListener = (event: AppEvent) => {
        this.handleHideEvent(event);
    };

    private handleShowEvent(event: AppErrorEvent) {
        this.showErrorPanel();
        this.setErrorDescription(event.error);
        this.setErrorDetails(event.details);
    }

    private handleHideEvent(event: AppEvent) {
        this.hideErrorPanel();
    }

    private showErrorPanel(): void {
        const panel = this.shadow.querySelector(`#${this.errorPanelId}`) as HTMLDivElement;

        panel.classList.remove("hidden");
    }

    private hideErrorPanel(): void {
        const panel = this.shadow.querySelector(`#${this.errorPanelId}`) as HTMLDivElement;

        panel.classList.add("hidden");
    }

    private setErrorDescription(description: string): void {
        const descriptionElement = this.shadow.querySelector(`#${this.errorDescriptionId}`) as HTMLParagraphElement;
        descriptionElement.innerHTML = description;
    }

    private setErrorDetails(details: string[]): void {
        const detailsElement = this.shadow.querySelector(`#${this.errorDetailsId}`) as HTMLUListElement;

        detailsElement.classList.add("hidden");
        detailsElement.replaceChildren();

        if (details.length > 0) {
            detailsElement.classList.remove("hidden");

            for (const detail of details) {
                const listItem = document.createElement("li");

                listItem.innerText = detail;

                detailsElement.appendChild(listItem);
            }
        }
    }
}

customElements.define("error-panel", ErrorPanelComponent);
