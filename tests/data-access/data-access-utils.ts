import { IDatabaseContext } from "../../src/lib/common/data-access/database-context-interface";
import { AppDatabaseContext } from "../../src/lib/data-access/app-database-context";
import { LocalFileStorage } from "../../src/lib/data-access/local-file-storage";
import { SingleFileJsonDatabase } from "../../src/lib/data-access/single-file-json-database";

export class DataAccessUtils {
    static async getInitializedDbContext(jsonDatabaseFilePath: string): Promise<IDatabaseContext> {
        const fileStorage = new LocalFileStorage();
        const db = new SingleFileJsonDatabase(fileStorage);
        const dbContext = new AppDatabaseContext(db);

        await dbContext.initializeAsync(jsonDatabaseFilePath);

        return dbContext;
    }
}
