export class PageRouteData {
    public path: string = "";
    public component: string = "";
    public title: string = "";

    constructor(path: string, component: string, title: string) {
        this.path = path;
        this.component = component;
        this.title = title;
    }
}
