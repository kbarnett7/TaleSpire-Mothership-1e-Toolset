import { PageRouteData } from "../pages/page-route-data";
import { AppEvent } from "./app-event";

export class ShowNavigateBackButtonEvent extends AppEvent {
    private readonly _backToRoute: PageRouteData;

    public get backToRoute(): PageRouteData {
        return this._backToRoute;
    }

    constructor(backToRoute: PageRouteData) {
        super(ShowNavigateBackButtonEvent.name);
        this._backToRoute = backToRoute;
    }
}
