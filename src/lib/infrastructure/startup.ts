import { AppLogger } from "../logging/app-logger";
import { ConsoleLogger } from "../logging/console-logger";

export class Startup {
    public configure(): void {
        // this doesn't really work as intended, as much of the app is initialized at runtime, executing before this method runs.
        // I ran into this issue with initializing the database outside of the data access classes constructors (i.e. a separate
        // init() method), and the UI pages were initialize and attempted to access data before the database was initialized.
        // Leaving this here incase it is needed in the future, or if I can spend time to better figure out the initialization
        // structure of the app.
        AppLogger.instance.addLogger(new ConsoleLogger());
    }
}
