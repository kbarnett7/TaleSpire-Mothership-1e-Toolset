import { IRepository } from "../../src/lib/common/data-access/repository-interface";

export class DatabaseTestUtils {
    static getLargestDatabaseEntityId(repository: IRepository<any>): number {
        const sortedItems = repository.list().sort((a, b) => a.id - b.id);

        return sortedItems[sortedItems.length - 1].id;
    }

    static resetDatabaseEntityCollection(repository: IRepository<any>, largestId: number) {
        const gear = repository.list();

        for (let item of gear) {
            if (item.id > largestId) {
                repository.remove(item);
            }
        }
    }
}
