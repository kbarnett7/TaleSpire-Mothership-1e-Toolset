export class AppLogFormatter {
    static format(level: string, message: string, data: any | null = null): string {
        const now = new Date();
        let jsonData = "";

        if (data !== null) {
            if (data instanceof Error) {
                jsonData = JSON.stringify(AppLogFormatter.serializeError(data));
            } else {
                jsonData = JSON.stringify(data);
            }
        }

        return `${now.toISOString()} | ${level} | ${message} | ${jsonData}`;
    }

    static serializeError(error: Error): object {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack,
        };
    }
}
