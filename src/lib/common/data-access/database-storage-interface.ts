export interface IDatabaseStorage {
    load(filePath: string): string;
    save(filePath: string, fileContents: string): void;
}
