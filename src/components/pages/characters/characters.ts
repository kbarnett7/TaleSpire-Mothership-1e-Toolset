import html from "./characters.html";
import { BasePageComponent } from "../base-page.component";
import { AddNewEntityButtonClicked } from "../../../lib/events/add-new-entity-button-clicked";
import { EventBus } from "../../../lib/events/event-bus";
import { AppEventListener } from "../../../lib/events/app-event-listener-interface";
import { AppEvent } from "../../../lib/events/app-event";
import { PageRouterService } from "../../../lib/pages/page-router-service";

export class CharactersComponent extends BasePageComponent {
    constructor() {
        super();
    }

    public async connectedCallback() {
        await super.connectedCallback();

        this.render(html);

        EventBus.instance.register(AddNewEntityButtonClicked.name, this.onAddNewPlayerCharacterButtonClick);
    }

    public disconnectedCallback() {
        EventBus.instance.unregister(AddNewEntityButtonClicked.name, this.onAddNewPlayerCharacterButtonClick);
    }

    private onAddNewPlayerCharacterButtonClick: AppEventListener = (event: AppEvent) => {
        PageRouterService.instance.navigateToPage(PageRouterService.playerCharacterPage, "0");
    };
}

customElements.define("characters-page", CharactersComponent);
