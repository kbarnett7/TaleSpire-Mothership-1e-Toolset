let globalSheets: CSSStyleSheet[] | null = null;

export function getGlobalStyleSheets(): CSSStyleSheet[] {
    if (globalSheets === null) {
        globalSheets = Array.from(document.styleSheets).flatMap(
            (x: StyleSheet) => {
                try {
                    const sheet = new CSSStyleSheet();
                    const css = Array.from((x as CSSStyleSheet).cssRules)
                        .map((rule) => rule.cssText)
                        .join(" ");
                    sheet.replaceSync(css);
                    return [sheet];
                } catch (e) {
                    // Skip stylesheets that throw a SecurityError
                    if (
                        e instanceof DOMException &&
                        e.name === "SecurityError"
                    ) {
                        console.warn(
                            "Skipped inaccessible stylesheet:",
                            x.href || "inline style"
                        );
                    }
                    return [];
                }
            }
        );
    }

    return globalSheets;
}

export function addGlobalStylesToShadowRoot(shadowRoot: ShadowRoot): void {
    shadowRoot.adoptedStyleSheets.push(...getGlobalStyleSheets());
}
