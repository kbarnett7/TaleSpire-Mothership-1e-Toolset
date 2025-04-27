export class PathService {
    private static _instance: PathService;

    private constructor() {}

    public static get instance(): PathService {
        if (!PathService._instance) {
            PathService._instance = new PathService();
        }

        return PathService._instance;
    }

    public getSymbioteRootPath(): string {
        const locationOfSrcFolder: number = window.location.href.lastIndexOf("/src/");

        if (locationOfSrcFolder === -1) {
            throw new Error("The URL does not contain '/src/'");
        }

        return window.location.href.substring(0, locationOfSrcFolder);
    }

    public getComponentsPath(): string {
        const rootPath = PathService.instance.getSymbioteRootPath();

        return `${rootPath}/src/components`;
    }
}
