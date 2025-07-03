export interface IFileStorage {
    loadAsync(filePath: string): Promise<string>;
    saveAsync(filePath: string, fileContents: string): Promise<void>;
}
