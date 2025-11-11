import { Source } from "../../features/sources/source";
import { IUnitOfWork } from "../../lib/common/data-access/unit-of-work-interface";
import { UnitOfWork } from "../../lib/data-access/unit-of-work";
import { appInjector } from "../../lib/infrastructure/app-injector";
import { SelectOption } from "../../lib/selects/select-option";
import { BaseComponent } from "../base.component";
import { CustomSelectComponent } from "../custom-select/custom-select";

export abstract class BaseListFilterBarComponent extends BaseComponent {
    private unitOfWork: IUnitOfWork;

    protected currentSearch: string;
    protected currentSourceId: number;

    public get sourcesSelectElement(): CustomSelectComponent {
        return this.shadow.querySelector("#sourcesFilter") as CustomSelectComponent;
    }

    constructor() {
        super();
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
        this.currentSearch = "";
        this.currentSourceId = 0;
    }

    protected configureSourcesFilter() {
        this.sourcesSelectElement.onOptionChange = this.handleOnSourcesSelectChanged;
        this.sourcesSelectElement.containerCssClassList.add("h-full");
        this.sourcesSelectElement.customSelectButtonCssClassList.add("h-full");
        this.populateSourcesFilter();
    }

    public handleOnSourcesSelectChanged = (newValue: SelectOption) => {
        const selectedValue = newValue.value;

        this.currentSourceId = parseInt(selectedValue);

        this.dispatchFilterChangedEvent();
    };

    private populateSourcesFilter() {
        const sources = this.unitOfWork.repo(Source).list();
        const sourceOptions = [new SelectOption("0", "All")];

        for (let source of sources) {
            sourceOptions.push(new SelectOption(source.id.toString(), source.name));
        }

        this.sourcesSelectElement.populateOptions(sourceOptions);
    }

    public handleOnSearchBoxKeyUp(event: KeyboardEvent) {
        // Ignore shift key up events, otherwise two GearFilterChangedEvents are triggered when
        // typing an UPPERCASE character into the search box.
        if (event.shiftKey === true) return;

        this.currentSearch = (event.target as HTMLInputElement).value;

        this.dispatchFilterChangedEvent();
    }

    protected abstract dispatchFilterChangedEvent(): void;
}
