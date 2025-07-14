import { AppLogFormatter } from "./app-log-formatter";
import { ILogger } from "./logger-interface";

export class ConsoleLogger implements ILogger {
    public type: string = ConsoleLogger.name;

    public info(message: string, data?: any): void {
        console.info(AppLogFormatter.format("info", message, data));
    }

    public warn(message: string, data?: any): void {
        console.warn(AppLogFormatter.format("warn", message, data));
    }

    public error(message: string, error: Error): void {
        console.error(AppLogFormatter.format("error", message, error));
    }

    public debug(message: string, data?: any): void {
        console.debug(AppLogFormatter.format("debug", message, data));
    }
}
