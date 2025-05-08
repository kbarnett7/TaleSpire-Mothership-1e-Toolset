import { ILogger } from "./logger-interface";

export class AppLogger implements ILogger {
    private _loggers: ILogger[] = [];
    private _logLevel: string = "";

    public addLogger(logger: ILogger) {
        this._loggers.push(logger);
    }

    public info(message: string): void {
        this._loggers.forEach((logger) => {
            logger.info(message);
        });
    }

    public warn(message: string): void {
        this._loggers.forEach((logger) => {
            logger.warn(message);
        });
    }

    public error(message: string): void {
        this._loggers.forEach((logger) => {
            logger.error(message);
        });
    }

    public debug(message: string): void {
        this._loggers.forEach((logger) => {
            logger.debug(message);
        });
    }
}
