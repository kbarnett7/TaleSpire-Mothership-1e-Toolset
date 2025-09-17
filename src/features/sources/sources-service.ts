import { IUnitOfWork } from "../../lib/common/data-access/unit-of-work-interface";
import { Source } from "./source";

export class SourcesService {
    private static _instance: SourcesService;

    private constructor() {}

    public static get instance(): SourcesService {
        if (!SourcesService._instance) {
            SourcesService._instance = new SourcesService();
        }

        return SourcesService._instance;
    }

    public getCustomItemSourceId(unitOfWork: IUnitOfWork): number {
        const source = unitOfWork.repo(Source).first((item) => item.name == "Custom");

        if (!source) {
            throw new Error('"Custom" source not found in the database.');
        }

        return source.id;
    }
}
