export interface IRepository<T> {
    first(predicate?: (item: T) => boolean): T | undefined;
    list(): T[];
}
