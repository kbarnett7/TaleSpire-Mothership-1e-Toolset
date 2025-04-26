class HtmlService {
    public async loadHTML(url: string, element: HTMLElement): Promise<void> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            element.innerHTML = html;
            // const element = document.getElementById(elementId);
            // if (element) {
            //     element.innerHTML = html;
            // } else {
            //     console.error(`Element with ID "${elementId}" not found.`);
            // }
        } catch (error) {
            console.error("Failed to load HTML:", error);
        }
    }
}

export default HtmlService;
