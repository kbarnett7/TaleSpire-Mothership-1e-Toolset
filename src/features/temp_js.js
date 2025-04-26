function roll() {
    TS.dice.putDiceInTray([{ name: "example roll", roll: "D20" }]);
}

async function loadHTML(url, elementId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        } else {
            console.error(`Element with ID "${elementId}" not found.`);
        }
    } catch (error) {
        console.error("Failed to load HTML:", error);
    }
}
