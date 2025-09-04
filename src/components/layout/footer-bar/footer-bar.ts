import html from "./footer-bar.html";
import { BaseComponent } from "../../base.component";
import { PageChangeInitiatedEvent } from "../../../lib/events/page-change-initiated-event";
import { PageRouterService } from "../../../lib/pages/page-router-service";
import { EventBus } from "../../../lib/events/event-bus";
import { AppEventListener } from "../../../lib/events/app-event-listener-interface";
import { AppEvent } from "../../../lib/events/app-event";
import { PageChangedEvent } from "../../../lib/events/page-changed-event";

export class FooterBarComponent extends BaseComponent {
    private readonly footerBarId: string = "footerBar";
    private readonly moreOptionMenuId: string = "moreOptionsMenu";

    private readonly activeButtonCssClass = "active-nav-button";
    private readonly inactiveButtonCssClass = "inactive-nav-button";

    constructor() {
        super();
    }

    public connectedCallback() {
        this.render(html);

        EventBus.instance.register(PageChangedEvent.name, this.onUpdateActiveNavButton);
        EventBus.instance.registerDocumentEvent("click", this.onDocumentMouseClickEvent);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(PageChangedEvent.name, this.onUpdateActiveNavButton);
        EventBus.instance.unregisterDocumentEvent("click", this.onDocumentMouseClickEvent);
    }

    private onUpdateActiveNavButton: AppEventListener = (event: AppEvent) => {
        this.setActiveNavButton((event as PageChangedEvent).currentPage.title);
    };

    private onDocumentMouseClickEvent = (event: Event) => {
        const footerElement = this.shadow.querySelector(`#${this.footerBarId}`) as HTMLElement;
        const eventPath = event.composedPath();

        if (!eventPath.includes(footerElement)) {
            this.closeMoreOptionsMenu();
        }
    };

    private navigateToPage(page: string) {
        const pageChangeInitiatedEvent = new PageChangeInitiatedEvent(PageRouterService.instance.getPageByTitle(page));

        EventBus.instance.dispatch(pageChangeInitiatedEvent);

        this.setActiveNavButton(page);

        this.closeMoreOptionsMenu();
    }

    private setActiveNavButton(page: string) {
        const navButtons = this.shadow.querySelectorAll("button");

        navButtons.forEach((button) => {
            if (button.id === `nav${page}`) {
                this.setNavButtonActive(button);
            } else {
                this.setNavButtonInactive(button);
            }
        });
    }

    private setNavButtonActive(button: HTMLButtonElement) {
        button.classList.add(this.activeButtonCssClass);
        button.classList.remove(this.inactiveButtonCssClass);
    }

    private setNavButtonInactive(button: HTMLButtonElement) {
        button.classList.add(this.inactiveButtonCssClass);
        button.classList.remove(this.activeButtonCssClass);
    }

    private onMoreOptionsButtonClick(event: MouseEvent) {
        if (this.isMoreOptionsMenuOpen()) {
            this.closeMoreOptionsMenu();
        } else {
            this.openMoreOptionsMenu();
        }
    }

    private isMoreOptionsMenuOpen(): boolean {
        const moreOptionsMenu = this.getMoreOptionsMenuElement();

        return !moreOptionsMenu.classList.contains("hidden");
    }

    private openMoreOptionsMenu() {
        const moreOptionsMenu = this.getMoreOptionsMenuElement();
        moreOptionsMenu.classList.remove("hidden");
    }

    private closeMoreOptionsMenu() {
        const moreOptionsMenu = this.getMoreOptionsMenuElement();
        moreOptionsMenu.classList.add("hidden");
    }

    private getMoreOptionsMenuElement(): HTMLDivElement {
        return this.shadow.querySelector(`#${this.moreOptionMenuId}`) as HTMLDivElement;
    }
}

customElements.define("footer-bar", FooterBarComponent);
