import { ILogger } from "./logger-interface";

export class ConsoleLogger implements ILogger {
    public type: string = ConsoleLogger.name;

    public info(message: string, data?: any): void {
        console.info(this.format("info", message, data));
    }

    public warn(message: string, data?: any): void {
        console.warn(this.format("warn", message, data));
    }

    public error(message: string, error: Error): void {
        console.error(this.format("error", message, error));
    }

    public debug(message: string, data?: any): void {
        console.debug(this.format("debug", message, data));
    }

    private format(level: string, message: string, data: any | null = null): string {
        const now = new Date();
        let jsonData = "";

        if (data !== null) {
            if (data instanceof Error) {
                jsonData = JSON.stringify(this.serializeError(data));
            } else {
                jsonData = JSON.stringify(data);
            }
        }

        return `${now.toISOString()} | ${level} | ${message} | ${jsonData}`;
    }

    private serializeError(error: Error): object {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack,
        };
    }
}
