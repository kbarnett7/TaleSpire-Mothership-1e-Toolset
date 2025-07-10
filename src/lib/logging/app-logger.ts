import { ConsoleLogger } from "./console-logger";
import { ILogger } from "./logger-interface";

export class AppLogger implements ILogger {
    public type: string = AppLogger.name;

    private static _instance: AppLogger;

    private _loggers: ILogger[] = [];

    private constructor() {}

    public static get instance(): AppLogger {
        if (!AppLogger._instance) {
            AppLogger._instance = new AppLogger();
        }

        return AppLogger._instance;
    }

    public addLogger(logger: ILogger) {
        const isLoggerAlreadyAdded = this._loggers.some((currentLogger) => currentLogger.type === logger.type);

        if (!isLoggerAlreadyAdded) {
            this._loggers.push(logger);
        }
    }

    public info(message: string, data?: any): void {
        this._loggers.forEach((logger) => {
            logger.info(message, data);
        });
    }

    public warn(message: string, data?: any): void {
        this._loggers.forEach((logger) => {
            logger.warn(message, data);
        });
    }

    public error(message: string, error: Error): void {
        this._loggers.forEach((logger) => {
            logger.error(message, error);
        });
    }

    public debug(message: string, data?: any): void {
        this._loggers.forEach((logger) => {
            logger.debug(message, data);
        });
    }
}
