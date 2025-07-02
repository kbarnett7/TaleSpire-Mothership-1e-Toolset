export class TaleSpireFileStorage {
    public load(filePath: string): string {
        // don't care about the filePath, so just ignore
        //TS: return ts.localStorage.global.getBlob();
        return "";
    }

    public save(filePath: string, fileContents: string) {
        //TS: ts.localStorage.global.setBlob(fileContents);
    }
}
