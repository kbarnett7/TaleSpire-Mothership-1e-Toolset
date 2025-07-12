import { IBlobStorage } from "../common/data-access/blob-storage-interface";
import { ITaleSpireApi } from "../infrastructure/talespire-api-interface";

declare const TS: any;

export class TaleSpireBlobStorage implements IBlobStorage {
    public static inject = ["taleSpireService"] as const;

    private _taleSpireApi: ITaleSpireApi;

    constructor(taleSpireService: ITaleSpireApi) {
        this._taleSpireApi = taleSpireService;
    }

    public getBlob(key: string): string {
        if (!TS) {
            return "";
        }
        let blob = "";
        TS.localStorage.global.getBlob().then((globalBlob: string) => {
            blob = globalBlob;
        });
        console.log(blob);

        if (!blob || blob === "") {
            return "";
        }

        return TS.localStorage.global.getBlob();
    }

    public setBlob(key: string, value: string): void {
        if (!TS) return;

        console.log(`Set blob: ${value}`);
        TS.localStorage.global.setBlob(value).then(() => {
            console.log("Database set!");
        });
    }
}
