import { AppLogger } from "../logging/app-logger";

export class StylesService {
    private static _instance: StylesService | null = null;
    private _globalSheets: CSSStyleSheet[] | null = null;

    private constructor() {}

    public static get instance(): StylesService {
        if (this._instance === null) {
            this._instance = new StylesService();
        }

        return this._instance;
    }

    public addGlobalStylesToShadowRoot(shadowRoot: ShadowRoot): void {
        shadowRoot.adoptedStyleSheets.push(...this.getGlobalStyleSheets());
    }

    private getGlobalStyleSheets(): CSSStyleSheet[] {
        if (this._globalSheets === null) {
            this._globalSheets = Array.from(document.styleSheets).flatMap((x: StyleSheet) => {
                try {
                    const sheet = new CSSStyleSheet();
                    const css = Array.from((x as CSSStyleSheet).cssRules)
                        .map((rule) => rule.cssText)
                        .join(" ");
                    sheet.replaceSync(css);
                    return [sheet];
                } catch (e) {
                    // Skip stylesheets that throw a SecurityError
                    if (e instanceof DOMException && e.name === "SecurityError") {
                        AppLogger.instance.warn("Skipped inaccessible stylesheet:", x.href || "inline style");
                    }
                    return [];
                }
            });
        }

        return this._globalSheets;
    }
}
