import { AppLogger } from "../logging/app-logger";
import { ConsoleLogger } from "../logging/console-logger";

export class Startup {
    public async configureAsync(): Promise<void> {
        AppLogger.instance.addLogger(new ConsoleLogger());
    }
}
