export interface IBlobStorage {
    getBlob(key: string): string;
    setBlob(key: string, value: string): void;
}
