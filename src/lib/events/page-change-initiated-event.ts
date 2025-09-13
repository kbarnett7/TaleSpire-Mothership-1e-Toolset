import { PageRouteData } from "../pages/page-route-data";
import { AppEvent } from "./app-event";

export class PageChangeInitiatedEvent extends AppEvent {
    public page: PageRouteData;
    public id: string;
    public params: URLSearchParams;

    constructor(
        page: PageRouteData,
        id?: string,
        params?: string | URLSearchParams | string[][] | Record<string, string> | undefined
    ) {
        super(PageChangeInitiatedEvent.name);
        this.page = page;
        this.id = id ?? "";
        this.params = new URLSearchParams(params);
    }
}
