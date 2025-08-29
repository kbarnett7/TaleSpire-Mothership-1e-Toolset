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
import { AppErrorEvent } from "../../../lib/events/app-error-event";
import { EventBus } from "../../../lib/events/event-bus";
import { EventType } from "../../../lib/events/event-type";
import { ModalDialogComponent } from "../../modal-dialog/modal-dialog";

export class GearItemDisplayDialogComponent extends BaseComponent {
    protected unitOfWork: IUnitOfWork;

    private gearItem: GearItem;

    protected get armorDisplayElement(): GearArmorDisplayComponent {
        return this.shadow.querySelector(`#gearArmorDisplay`) as GearArmorDisplayComponent;
    }

    protected get equipmentDisplayElement(): GearEquipmentDisplayComponent {
        return this.shadow.querySelector(`#gearEquipmentDisplay`) as GearEquipmentDisplayComponent;
    }

    protected get weaponDisplayElement(): GearWeaponDisplayComponent {
        return this.shadow.querySelector(`#gearWeaponDisplay`) as GearWeaponDisplayComponent;
    }

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
        this.gearItem = new EquipmentItem();
    }

    public connectedCallback() {
        this.render(html);
    }

    public openModal() {
        const modal = this.shadow.querySelector("#gearItemModal") as ModalDialogComponent;

        if (!modal) {
            EventBus.instance.dispatch(
                new AppErrorEvent(EventType.ErrorPanelShow, 'Modal "gearItemDisplayDialog" not found.')
            );
            return;
        }

        modal.openModal();
    }

    public setGearItem(id: number, category: string) {
        this.gearItem = this.getSelectedGearItem(id, category);

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

    public onDeleteButtonClick(event: MouseEvent) {
        alert(`Clicked delete for ${this.gearItem.name}!`);
    }
}

customElements.define("gear-item-display-dialog", GearItemDisplayDialogComponent);
