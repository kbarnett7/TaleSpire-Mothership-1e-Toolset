export class PageRouteData {
    public path: string = "";
    public component: string = "";
    public title: string = "";
    public canNavigateBackFrom: boolean = false;

    constructor(path: string, component: string, title: string, canNavigateBackFrom?: boolean) {
        this.path = path;
        this.component = component;
        this.title = title;
        this.canNavigateBackFrom = canNavigateBackFrom ?? false;
    }
}
