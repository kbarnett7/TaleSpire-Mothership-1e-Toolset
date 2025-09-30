import { IRepository } from "../data-access/repository-interface";

export abstract class DatabaseEntity {
    public id: number;

    constructor(id?: number) {
        this.id = id ?? 0;
    }

    protected generateId<T extends DatabaseEntity>(repository: IRepository<T>): number {
        return this.getLargestItemIdInDatabase(repository) + 1;
    }

    private getLargestItemIdInDatabase<T extends DatabaseEntity>(repository: IRepository<T>): number {
        const sortedItems = repository.list().sort((a, b) => a.id - b.id);

        return sortedItems[sortedItems.length - 1].id;
    }
}
