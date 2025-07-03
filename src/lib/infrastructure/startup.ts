import { AppDatabaseContext } from "../data-access/app-database-context";
import { AppLogger } from "../logging/app-logger";
import { ConsoleLogger } from "../logging/console-logger";
import { appInjector } from "./app-injector";

export class Startup {
    public async configureAsync(): Promise<void> {
        AppLogger.instance.addLogger(new ConsoleLogger());
        const dbContext = appInjector.injectClass(AppDatabaseContext);

        // TODO: use an enviorment variable to determine if this is dev or prod
        await dbContext.initializeAsync("");
    }
}
