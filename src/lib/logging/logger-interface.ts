export interface ILogger {
    type: string;
    info(message: string, data?: any): void;
    warn(message: string, data?: any): void;
    error(message: string, error?: Error): void;
    debug(message: string, data?: any): void;
}
