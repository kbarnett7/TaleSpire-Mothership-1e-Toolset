export interface IFileStorage {
    load(filePath: string): string;
    save(filePath: string, fileContents: string): void;
}
