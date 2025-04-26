export class PathService {
    private static _instance: PathService;

    private constructor() {}

    public static get instance(): PathService {
        if (!PathService._instance) {
            PathService._instance = new PathService();
        }

        return PathService._instance;
    }

    public getSrcFolderPath(): string {
        const locationOfSrcFolder: number = window.location.pathname.lastIndexOf("/src/");
        const path: string = window.location.origin + window.location.pathname.substring(0, locationOfSrcFolder + 4);

        return path;
    }
}
