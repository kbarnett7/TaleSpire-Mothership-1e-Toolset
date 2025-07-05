export interface IDatabaseStorage {
    load(location: string): string;
    save(location: string, fileContents: string): void;
}
