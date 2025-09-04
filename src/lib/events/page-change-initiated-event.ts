import { PageRouteData } from "../pages/page-route-data";
import { AppEvent } from "./app-event";

export class PageChangeInitiatedEvent extends AppEvent {
    public page: PageRouteData;
    public id: string;

    constructor(page: PageRouteData, id?: string) {
        super(PageChangeInitiatedEvent.name);
        this.page = page;
        this.id = id ?? "";
    }
}
