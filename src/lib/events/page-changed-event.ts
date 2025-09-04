import { PageRouteData } from "../pages/page-route-data";
import { AppEvent } from "./app-event";

export class PageChangedEvent extends AppEvent {
    public currentPage: PageRouteData;
    public previousPage: PageRouteData;

    constructor(page: PageRouteData, previousPage: PageRouteData, id?: string) {
        super(PageChangedEvent.name);
        this.currentPage = page;
        this.previousPage = previousPage;
    }
}
