import html from "./add-edit-gear.html";
import { BasePageComponent } from "../base-page.component";
import { EventBus } from "../../../lib/events/event-bus";
import { PageRouterService } from "../../../lib/pages/page-router-service";
import { ShowNavigateBackButtonEvent } from "../../../lib/events/show-navigate-back-button-event";
import { HideNavigateBackButtonEvent } from "../../../lib/events/hide-navigate-back-button-event";
import { GearCategoryChangedEvent } from "../../../lib/events/gear-category-changed-event";
import { AppEvent } from "../../../lib/events/app-event";
import { ArmorItem } from "../../../features/gear/armor-item";
import { WeaponItem } from "../../../features/gear/weapon-item";

export class AddEditGearComponent extends BasePageComponent {
    private gearItemIdFromUrl: string;

    private get armorFieldsDiv(): HTMLDivElement {
        return this.shadow.querySelector("#armorFields") as HTMLDivElement;
    }

    private get weaponFieldsDiv(): HTMLDivElement {
        return this.shadow.querySelector("#weaponFields") as HTMLDivElement;
    }

    private get specialFieldDiv(): HTMLDivElement {
        return this.shadow.querySelector("#specialField") as HTMLDivElement;
    }

    constructor() {
        super();
        this.gearItemIdFromUrl = "";
        this.handleGearCategoryChangedEvent = this.handleGearCategoryChangedEvent.bind(this);
    }

    public async connectedCallback() {
        await super.connectedCallback();

        this.gearItemIdFromUrl = this.getIdFromUrl();

        this.render(html);

        this.dispatchShowNavigateBackButtonEvent();

        EventBus.instance.register(GearCategoryChangedEvent.name, this.handleGearCategoryChangedEvent);

        // TODO: temp; remove.
        const gearIdElement = this.shadow.querySelector("#gearId") as HTMLSpanElement;
        gearIdElement.textContent = this.gearItemIdFromUrl;
    }

    public disconnectedCallback() {
        this.dispatchHideNavigateBackButtonEvent();
        EventBus.instance.unregister(GearCategoryChangedEvent.name, this.handleGearCategoryChangedEvent);
    }

    private dispatchShowNavigateBackButtonEvent() {
        const showNavigateBackButtonEvent = new ShowNavigateBackButtonEvent(
            PageRouterService.instance.getPageByTitle(PageRouterService.gearPage)
        );

        EventBus.instance.dispatch(showNavigateBackButtonEvent);
    }

    private dispatchHideNavigateBackButtonEvent() {
        const hideNavigateBackButtonEvent = new HideNavigateBackButtonEvent();

        EventBus.instance.dispatch(hideNavigateBackButtonEvent);
    }

    private getIdFromUrl(): string {
        const urlComponents = window.location.pathname.split("/");
        return urlComponents[urlComponents.length - 1];
    }

    private handleGearCategoryChangedEvent(event: AppEvent) {
        const gearCategoryChangedEvent = event as GearCategoryChangedEvent;

        this.updateFieldDivVisiblities(gearCategoryChangedEvent.category);
    }

    private updateFieldDivVisiblities(category: string): void {
        if (category == ArmorItem.gearCategory) {
            this.armorFieldsDiv.classList.remove("hidden");
            this.weaponFieldsDiv.classList.add("hidden");
            this.specialFieldDiv.classList.remove("hidden");
        } else if (category == WeaponItem.gearCategory) {
            this.armorFieldsDiv.classList.add("hidden");
            this.weaponFieldsDiv.classList.remove("hidden");
            this.specialFieldDiv.classList.remove("hidden");
        } else {
            this.armorFieldsDiv.classList.add("hidden");
            this.weaponFieldsDiv.classList.add("hidden");
            this.specialFieldDiv.classList.add("hidden");
        }
    }
}

customElements.define("add-edit-gear-page", AddEditGearComponent);
