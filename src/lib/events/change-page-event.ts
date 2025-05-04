import { PageRouteData } from "../pages/page-route-data";
import { AppEvent } from "./app-event";

export class ChangePageEvent extends AppEvent {
    public page: PageRouteData;

    constructor(page: PageRouteData) {
        super(ChangePageEvent.name);
        this.page = page;
    }
}
