import html from "./characters.html";
import { BasePageComponent } from "../base-page.component";
import { IUnitOfWork } from "../../../lib/common/data-access/unit-of-work-interface";
import { appInjector } from "../../../lib/infrastructure/app-injector";
import { UnitOfWork } from "../../../lib/data-access/unit-of-work";
import { DatabaseVersion } from "../../../features/database-versions/database-version";

export class CharactersComponent extends BasePageComponent {
    protected unitOfWork: IUnitOfWork;

    constructor() {
        super();
        console.log("CharactersComponent constructor()...");
        this.unitOfWork = appInjector.injectClass(UnitOfWork);
    }

    public async connectedCallback() {
        await super.connectedCallback();

        console.log("CharactersComponent connectedCallback()...");
        this.render(html);

        const element = this.shadow.querySelector("#tempElement");

        if (element) {
            let dbVersion = this.unitOfWork.repo(DatabaseVersion).first() ?? new DatabaseVersion(0, "0");
            element.textContent = `Database Version: ${dbVersion?.version}`;
        }
    }
}

customElements.define("characters-page", CharactersComponent);
