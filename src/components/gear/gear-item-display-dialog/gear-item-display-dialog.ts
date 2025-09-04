import html from "./gear-item-display-dialog.html";
import { BaseComponent } from "../../base.component";
import { GearItem } from "../../../features/gear/gear-item";
import { EquipmentItem } from "../../../features/gear/equipment-item";
import { GetGearByIdFeature } from "../../../features/gear/get-gear-by-id/get-gear-by-id-feature";
import { GetGearByIdRequest } from "../../../features/gear/get-gear-by-id/get-gear-by-id-request";
import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { UnitOfWork } from "../../../lib/data-access/unit-of-work";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { ArmorItem } from "../../../features/gear/armor-item";
import { WeaponItem } from "../../../features/gear/weapon-item";
import { GearArmorDisplayComponent } from "../gear-armor-display/gear-armor-display";
import { GearEquipmentDisplayComponent } from "../gear-equipment-display/gear-equipment-display";
import { GearWeaponDisplayComponent } from "../gear-weapon-display/gear-weapon-display";
import { EventBus } from "../../../lib/events/event-bus";
import { ModalDialogComponent } from "../../modal-dialog/modal-dialog";
import { DeleteCustomGearItemRequest } from "../../../features/gear/delete-custom-gear-item/delete-custom-gear-item-request";
import { DeleteCustomGearItemFeature } from "../../../features/gear/delete-custom-gear-item/delete-custom-gear-item-feature";
import { RefreshGearListEvent } from "../../../lib/events/refresh-gear-list-event";
import { UiReportableErrorOccurredEvent } from "../../../lib/events/ui-reportable-error-occurred-event";
import { UiReportableErrorClearedEvent } from "../../../lib/events/ui-reportable-error-cleared-event";

export class GearItemDisplayDialogComponent extends BaseComponent {
    protected unitOfWork: IUnitOfWork;

    private gearItem: GearItem;
    private gearItemCategory: string;

    protected get armorDisplayElement(): GearArmorDisplayComponent {
        return this.shadow.querySelector(`#gearArmorDisplay`) as GearArmorDisplayComponent;
    }

    protected get equipmentDisplayElement(): GearEquipmentDisplayComponent {
        return this.shadow.querySelector(`#gearEquipmentDisplay`) as GearEquipmentDisplayComponent;
    }

    protected get weaponDisplayElement(): GearWeaponDisplayComponent {
        return this.shadow.querySelector(`#gearWeaponDisplay`) as GearWeaponDisplayComponent;
    }

    protected get gearItemModalElement(): ModalDialogComponent {
        return this.shadow.querySelector("#gearItemModal") as ModalDialogComponent;
    }

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
        this.gearItem = new EquipmentItem();
        this.gearItemCategory = "";
    }

    public connectedCallback() {
        this.render(html);
    }

    public openModal() {
        const modal = this.gearItemModalElement;

        if (!modal) {
            this.dispatchModalNotFoundEvent();
            return;
        }

        modal.openModal();
    }

    public closeModal() {
        const modal = this.gearItemModalElement;

        if (!modal) {
            this.dispatchModalNotFoundEvent();
            return;
        }

        modal.closeModal();
    }

    private dispatchModalNotFoundEvent() {
        EventBus.instance.dispatch(new UiReportableErrorOccurredEvent('Modal "gearItemDisplayDialog" not found.'));
    }

    public setGearItem(id: number, category: string) {
        this.gearItem = this.getSelectedGearItem(id, category);
        this.gearItemCategory = category;

        this.showAppropriateGearItemDisplay(category);
    }

    private getSelectedGearItem(id: number, category: string): GearItem {
        const feature = new GetGearByIdFeature(this.unitOfWork);
        const request = new GetGearByIdRequest(id, category);

        return feature.handle(request);
    }

    private showAppropriateGearItemDisplay(category: string) {
        this.rehideAllGearDisplayElements();

        if (category === ArmorItem.gearCategory) {
            this.armorDisplayElement.setEquipmentItem(this.gearItem as ArmorItem);
            this.armorDisplayElement.classList.remove("hidden");
        } else if (category === EquipmentItem.gearCategory) {
            this.equipmentDisplayElement.setEquipmentItem(this.gearItem as EquipmentItem);
            this.equipmentDisplayElement.classList.remove("hidden");
        } else if (category === WeaponItem.gearCategory) {
            this.weaponDisplayElement.setEquipmentItem(this.gearItem as WeaponItem);
            this.weaponDisplayElement.classList.remove("hidden");
        }
    }

    private rehideAllGearDisplayElements() {
        this.rehideElement(this.armorDisplayElement);
        this.rehideElement(this.equipmentDisplayElement);
        this.rehideElement(this.weaponDisplayElement);
    }

    private rehideElement(element: HTMLElement) {
        if (element.classList.contains("hidden")) return;

        element.classList.add("hidden");
    }

    public onEditButtonClick(event: MouseEvent) {
        alert(`Clicked edit for ${this.gearItem.name}!`);
    }

    public async onDeleteButtonClick(event: MouseEvent): Promise<void> {
        const request = new DeleteCustomGearItemRequest();
        const feature = new DeleteCustomGearItemFeature(this.unitOfWork);

        request.id = this.gearItem.id;
        request.category = this.gearItemCategory;

        const result = await feature.handleAsync(request);

        if (result.isFailure) {
            EventBus.instance.dispatch(
                new UiReportableErrorOccurredEvent(result.error.description, result.error.details)
            );
        } else {
            EventBus.instance.dispatch(new UiReportableErrorClearedEvent());
            EventBus.instance.dispatch(new RefreshGearListEvent());
        }

        this.closeModal();
    }
}

customElements.define("gear-item-display-dialog", GearItemDisplayDialogComponent);
