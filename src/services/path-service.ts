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
        const locationOfSrcFolder: number = window.location.href.lastIndexOf("/dist/");

        if (locationOfSrcFolder === -1) {
            throw new Error("The URL does not contain '/dist/'");
        }

        return window.location.href.substring(0, locationOfSrcFolder);
    }
}
