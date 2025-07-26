export interface IRepository<T> {
    first(predicate?: (item: T) => boolean): T | undefined;
    list(): T[];
    add(entity: T): void;
    remove(entity: T): void;
}
