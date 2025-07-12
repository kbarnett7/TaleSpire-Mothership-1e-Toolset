export interface IBlobStorage {
    getBlobAsync(key: string): Promise<string>;
    setBlobAsync(key: string, value: string): Promise<void>;
}
