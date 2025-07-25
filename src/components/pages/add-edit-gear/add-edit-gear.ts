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
import { AppEventListener } from "../../../lib/events/app-event-listener-interface";
import { EquipmentItem } from "../../../features/gear/equipment-item";
import { AppLogger } from "../../../lib/logging/app-logger";
import { EquipmentItemFormFieldsDto } from "../../../features/gear/equipment-item-form-fields-dto";
import { AddCustomEquipmentItemRequest } from "../../../features/gear/add-custom-equipment-item/add-custom-equipment-item-request";
import { AddCustomEquipmentItemFeature } from "../../../features/gear/add-custom-equipment-item/add-custom-equipment-item-feature";
import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { UnitOfWork } from "../../../lib/data-access/unit-of-work";
import { ChangePageEvent } from "../../../lib/events/change-page-event";
import { AppErrorEvent } from "../../../lib/events/app-error-event";
import { EventType } from "../../../lib/events/event-type";

export class AddEditGearComponent extends BasePageComponent {
    private unitOfWork: IUnitOfWork;
    private gearItemIdFromUrl: string;
    private selectedCategory: string;

    private get armorFieldsDiv(): HTMLDivElement {
        return this.shadow.querySelector("#armorFields") as HTMLDivElement;
    }

    private get weaponFieldsDiv(): HTMLDivElement {
        return this.shadow.querySelector("#weaponFields") as HTMLDivElement;
    }

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
        this.gearItemIdFromUrl = "";
        this.selectedCategory = EquipmentItem.gearCategory;
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

    private handleGearCategoryChangedEvent: AppEventListener = (event: AppEvent) => {
        const gearCategoryChangedEvent = event as GearCategoryChangedEvent;

        this.selectedCategory = gearCategoryChangedEvent.category;

        this.updateFieldDivVisiblities();
    };

    private updateFieldDivVisiblities(): void {
        if (this.selectedCategory == ArmorItem.gearCategory) {
            this.armorFieldsDiv.classList.remove("hidden");
            this.weaponFieldsDiv.classList.add("hidden");
        } else if (this.selectedCategory == WeaponItem.gearCategory) {
            this.armorFieldsDiv.classList.add("hidden");
            this.weaponFieldsDiv.classList.remove("hidden");
        } else {
            this.armorFieldsDiv.classList.add("hidden");
            this.weaponFieldsDiv.classList.add("hidden");
        }
    }

    public async handleFormSubmit(event: SubmitEvent): Promise<void> {
        event.preventDefault();

        EventBus.instance.dispatch(new AppEvent(EventType.ErrorPanelHide));

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        await this.addGear(formData);
    }

    private async addGear(formData: FormData): Promise<void> {
        if (this.selectedCategory == ArmorItem.gearCategory) {
            AppLogger.instance.debug("Call CreateNewArmorItemFeature.handle()");
        } else if (this.selectedCategory == WeaponItem.gearCategory) {
            AppLogger.instance.debug("Call CreateNewWeaponItemFeature.handle()");
        } else {
            this.addEquipmentItem(formData);
        }
    }

    private async addEquipmentItem(formData: FormData): Promise<void> {
        const equipmentData = EquipmentItemFormFieldsDto.createFromJson(
            formData.get("equipmentFields")?.toString() ?? "{}"
        );
        AppLogger.instance.debug("Form Data String", formData.get("equipmentFields")?.toString());
        AppLogger.instance.debug("Parsed Equipment DTO Data", equipmentData);
        const request = new AddCustomEquipmentItemRequest();
        const feature = new AddCustomEquipmentItemFeature(this.unitOfWork);

        request.formFields = equipmentData;

        const result = await feature.handleAsync(request);

        if (result.isSuccess) {
            this.dispatchHideNavigateBackButtonEvent();
            this.navigateToGearPage();
        } else {
            EventBus.instance.dispatch(
                new AppErrorEvent(EventType.ErrorPanelShow, result.error.description, result.error.details)
            );
        }
    }

    private navigateToGearPage() {
        const changePageEvent = new ChangePageEvent(
            PageRouterService.instance.getPageByTitle(PageRouterService.gearPage)
        );

        EventBus.instance.dispatch(changePageEvent);
    }
}

customElements.define("add-edit-gear-page", AddEditGearComponent);
