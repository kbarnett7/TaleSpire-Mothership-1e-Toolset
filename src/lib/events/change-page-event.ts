import { PageRouteData } from "../pages/page-route-data";
import { AppEvent } from "./app-event";

export class ChangePageEvent extends AppEvent {
    public page: PageRouteData;
    public id: string;

    constructor(page: PageRouteData, id?: string) {
        super(ChangePageEvent.name);
        this.page = page;
        this.id = id ?? "";
    }
}
