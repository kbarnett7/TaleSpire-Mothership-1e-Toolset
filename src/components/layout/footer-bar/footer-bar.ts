import html from "./footer-bar.html";
import { BaseComponent } from "../../base.component";
import { ChangePageEvent } from "../../../lib/events/change-page-event";
import { PageRouterService } from "../../../lib/pages/page-router-service";
import { EventBus } from "../../../lib/events/event-bus";

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

        EventBus.instance.registerDocumentEvent("click", this.onDocumentMouseClickEvent);
    }

    public disconnectedCallback() {
        EventBus.instance.unregisterDocumentEvent("click", this.onDocumentMouseClickEvent);
    }

    private onDocumentMouseClickEvent = (event: Event) => {
        const footerElement = this.shadow.querySelector(`#${this.footerBarId}`) as HTMLElement;
        const eventPath = event.composedPath();

        if (!eventPath.includes(footerElement)) {
            this.closeMoreOptionsMenu();
        }
    };

    private navigateToPage(page: string) {
        const changePageEvent = new ChangePageEvent(PageRouterService.instance.getPageByTitle(page));

        EventBus.instance.dispatch(changePageEvent);

        this.setActiveNavButton(page);

        this.closeMoreOptionsMenu();
    }

    private setActiveNavButton(page: string) {
        const navButtons = this.shadow.querySelectorAll("button");

        navButtons.forEach((button) => {
            if (button.id === `nav${page}`) {
                this.setActive(button);
            } else {
                this.setInactive(button);
            }
        });
    }

    private setActive(button: HTMLButtonElement) {
        button.classList.add(this.activeButtonCssClass);
        button.classList.remove(this.inactiveButtonCssClass);
    }

    private setInactive(button: HTMLButtonElement) {
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
