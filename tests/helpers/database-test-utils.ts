import { IRepository } from "../../src/lib/common/data-access/repository-interface";
import { DatabaseEntity } from "../../src/lib/common/features/database-entity";

export class DatabaseTestUtils {
    static getLargestDatabaseEntityId(repository: IRepository<DatabaseEntity>): number {
        const sortedItems = repository.list().sort((a, b) => a.id - b.id);

        return sortedItems[sortedItems.length - 1].id;
    }

    static resetDatabaseEntityCollection(repository: IRepository<DatabaseEntity>, largestId: number) {
        const gear = repository.list();

        for (let item of gear) {
            if (item.id > largestId) {
                repository.remove(item);
            }
        }
    }
}
