import html from "./add-edit-gear.html";
import { BasePageComponent } from "../base-page.component";
import { EventBus } from "../../../lib/events/event-bus";
import { PageRouterService } from "../../../lib/pages/page-router-service";
import { GearCategoryChangedEvent } from "../../../lib/events/gear-category-changed-event";
import { AppEvent } from "../../../lib/events/app-event";
import { ArmorItem } from "../../../features/gear/armor-item";
import { WeaponItem } from "../../../features/gear/weapon-item";
import { AppEventListener } from "../../../lib/events/app-event-listener-interface";
import { EquipmentItem } from "../../../features/gear/equipment-item";
import { EquipmentItemFormFieldsDto } from "../../../features/gear/equipment-item-form-fields-dto";
import { AddCustomEquipmentItemRequest } from "../../../features/gear/add-custom-equipment-item/add-custom-equipment-item-request";
import { AddCustomEquipmentItemFeature } from "../../../features/gear/add-custom-equipment-item/add-custom-equipment-item-feature";
import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { UnitOfWork } from "../../../lib/data-access/unit-of-work";
import { ChangePageEvent } from "../../../lib/events/change-page-event";
import { ResultError } from "../../../lib/result/result-error";
import { AddCustomArmorItemRequest } from "../../../features/gear/add-custom-armor-item/add-custom-armor-item-request";
import { AddCustomArmorItemFeature } from "../../../features/gear/add-custom-armor-item/add-custom-armor-item-feature";
import { ArmorItemFormFieldsDto } from "../../../features/gear/armor-item-form-fields-dto";
import { IAsyncFeature } from "../../../lib/common/features/async-feature-interface";
import { Result } from "../../../lib/result/result";
import { AddCustomWeaponItemRequest } from "../../../features/gear/add-custom-weapon-item/add-custom-weapon-item-request";
import { AddCustomWeaponItemFeature } from "../../../features/gear/add-custom-weapon-item/add-custom-weapon-item-feature";
import { WeaponItemFormFieldsDto } from "../../../features/gear/weapon-item-form-fields-dto";
import { UiReportableErrorOccurredEvent } from "../../../lib/events/ui-reportable-error-occurred-event";
import { UiReportableErrorClearedEvent } from "../../../lib/events/ui-reportable-error-cleared-event";

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

        EventBus.instance.register(GearCategoryChangedEvent.name, this.handleGearCategoryChangedEvent);

        // TODO: temp; remove.
        const gearIdElement = this.shadow.querySelector("#gearId") as HTMLSpanElement;
        gearIdElement.textContent = this.gearItemIdFromUrl;
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(GearCategoryChangedEvent.name, this.handleGearCategoryChangedEvent);
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

    public handleCancelButtonClick(event: MouseEvent) {
        this.navigateToGearPage();
    }

    public async handleFormSubmit(event: SubmitEvent): Promise<void> {
        event.preventDefault();

        EventBus.instance.dispatch(new UiReportableErrorClearedEvent());

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        await this.addGear(formData);
    }

    private async addGear(formData: FormData): Promise<void> {
        if (this.selectedCategory == ArmorItem.gearCategory) {
            this.addArmorItem(formData);
        } else if (this.selectedCategory == WeaponItem.gearCategory) {
            this.addWeaponItem(formData);
        } else {
            this.addEquipmentItem(formData);
        }
    }

    private async addEquipmentItem(formData: FormData): Promise<void> {
        const request = new AddCustomEquipmentItemRequest();
        const feature = new AddCustomEquipmentItemFeature(this.unitOfWork);

        request.formFields = this.getEquipmentItemFormFields(formData);

        await this.handleFeature(request, feature);
    }

    private async addArmorItem(formData: FormData): Promise<void> {
        const request = new AddCustomArmorItemRequest();
        const feature = new AddCustomArmorItemFeature(this.unitOfWork);
        const equipmentItemFormFields = this.getEquipmentItemFormFields(formData);
        const armorItemFormFields = this.getArmorItemFormFields(formData);

        armorItemFormFields.name = equipmentItemFormFields.name;
        armorItemFormFields.cost = equipmentItemFormFields.cost;
        armorItemFormFields.description = equipmentItemFormFields.description;

        request.formFields = armorItemFormFields;

        await this.handleFeature(request, feature);
    }

    private async addWeaponItem(formData: FormData): Promise<void> {
        const request = new AddCustomWeaponItemRequest();
        const feature = new AddCustomWeaponItemFeature(this.unitOfWork);
        const equipmentItemFormFields = this.getEquipmentItemFormFields(formData);
        const weaponItemFormFields = this.getWeaponItemFormFields(formData);

        weaponItemFormFields.name = equipmentItemFormFields.name;
        weaponItemFormFields.cost = equipmentItemFormFields.cost;
        weaponItemFormFields.description = equipmentItemFormFields.description;

        request.formFields = weaponItemFormFields;

        await this.handleFeature(request, feature);
    }

    private async handleFeature<TRequest, TResponse>(
        request: TRequest,
        feature: IAsyncFeature<TRequest, Result<TResponse>>
    ): Promise<void> {
        const result = await feature.handleAsync(request);

        if (result.isSuccess) {
            this.handleSaveSuccess();
        } else {
            this.handleSaveFailure(result.error);
        }
    }

    private handleSaveSuccess() {
        this.navigateToGearPage();
    }

    private handleSaveFailure(error: ResultError) {
        EventBus.instance.dispatch(new UiReportableErrorOccurredEvent(error.description, error.details));
    }

    private navigateToGearPage() {
        const changePageEvent = new ChangePageEvent(
            PageRouterService.instance.getPageByTitle(PageRouterService.gearPage)
        );

        EventBus.instance.dispatch(changePageEvent);
    }

    private getEquipmentItemFormFields(formData: FormData): EquipmentItemFormFieldsDto {
        return EquipmentItemFormFieldsDto.createFromJson(
            formData.get("equipmentFields")?.toString() ?? new EquipmentItemFormFieldsDto().toJson()
        );
    }

    private getArmorItemFormFields(formData: FormData): ArmorItemFormFieldsDto {
        return ArmorItemFormFieldsDto.createFromJson(
            formData.get("armorFields")?.toString() ?? new ArmorItemFormFieldsDto().toJson()
        );
    }

    private getWeaponItemFormFields(formData: FormData): WeaponItemFormFieldsDto {
        return WeaponItemFormFieldsDto.createFromJson(
            formData.get("weaponFields")?.toString() ?? new WeaponItemFormFieldsDto().toJson()
        );
    }
}

customElements.define("add-edit-gear-page", AddEditGearComponent);
