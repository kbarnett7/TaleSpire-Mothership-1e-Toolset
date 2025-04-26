export class HtmlService {
    private static _instance: HtmlService;

    private constructor() {}

    public static get instance(): HtmlService {
        if (!HtmlService._instance) {
            HtmlService._instance = new HtmlService();
        }

        return HtmlService._instance;
    }

    public async loadHtml(url: string): Promise<string> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error("Failed to load HTML:", error);
            return "<span>!!!Failed to load HTML!!!</span>";
        }
    }

    public async applyHtmlTo(url: string, element: HTMLElement): Promise<void> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            element.innerHTML = html;
        } catch (error) {
            console.error("Failed to load HTML:", error);
        }
    }
}
