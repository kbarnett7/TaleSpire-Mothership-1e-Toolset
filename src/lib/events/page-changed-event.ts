import { PageRouteData } from "../pages/page-route-data";
import { AppEvent } from "./app-event";

export class PageChangedEvent extends AppEvent {
    public currentPage: PageRouteData;
    public previousPage: PageRouteData;

    constructor(currentPage: PageRouteData, previousPage: PageRouteData) {
        super(PageChangedEvent.name);
        this.currentPage = currentPage;
        this.previousPage = previousPage;
    }
}
