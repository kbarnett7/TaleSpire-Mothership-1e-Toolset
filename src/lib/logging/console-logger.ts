import { ILogger } from "./logger-interface";

export class ConsoleLogger implements ILogger {
    info(message: string): void {
        throw new Error("Method not implemented.");
    }
    warn(message: string): void {
        throw new Error("Method not implemented.");
    }
    error(message: string): void {
        throw new Error("Method not implemented.");
    }
    debug(message: string): void {
        throw new Error("Method not implemented.");
    }
}
