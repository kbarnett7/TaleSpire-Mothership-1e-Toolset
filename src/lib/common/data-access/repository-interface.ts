export interface IRepository<T> {
    first(predicate?: (item: T) => boolean): T | undefined;
    list(): T[];
    add(entity: T): void;
    update(existingEntity: T, updatedEntity: T): void;
    remove(entity: T): void;
}
