import { PageRouteData } from "./page-route-data";

export class PageRouterService {
    public static charactersPage: string = "Characters";
    public static npcsPage: string = "NPCs";
    public static aboutPage: string = "About";
    public static gearPage: string = "Gear";

    private static _instance: PageRouterService;

    private _pages: Map<string, PageRouteData>;
    private _defaultPage: PageRouteData;

    private constructor() {
        this._pages = new Map<string, PageRouteData>();
        this.populatePageMetaDataMap();
        this._defaultPage = this.getPageByTitle(PageRouterService.charactersPage);
    }

    public static get instance(): PageRouterService {
        if (!PageRouterService._instance) {
            PageRouterService._instance = new PageRouterService();
        }

        return PageRouterService._instance;
    }

    private populatePageMetaDataMap() {
        this._pages.set(
            PageRouterService.charactersPage,
            new PageRouteData("/", "characters-page", PageRouterService.charactersPage)
        );

        this._pages.set(
            PageRouterService.npcsPage,
            new PageRouteData("/npcs", "npcs-page", PageRouterService.npcsPage)
        );

        this._pages.set(
            PageRouterService.gearPage,
            new PageRouteData("/gear", "gear-page", PageRouterService.gearPage)
        );

        this._pages.set(
            PageRouterService.aboutPage,
            new PageRouteData("/about", "about-page", PageRouterService.aboutPage)
        );
    }

    public getPageByTitle(title: string): PageRouteData {
        const page = this._pages.get(title);

        if (!page) {
            return this._defaultPage;
        }

        return page;
    }

    public getPageByPath(path: string): PageRouteData {
        for (const [key, routeData] of this._pages) {
            if (routeData.path === path) return routeData;
        }

        return this._defaultPage;
    }
}
