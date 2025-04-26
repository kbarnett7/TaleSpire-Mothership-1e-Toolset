var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class HtmlService {
    loadHTML(url, element) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const html = yield response.text();
                element.innerHTML = html;
                // const element = document.getElementById(elementId);
                // if (element) {
                //     element.innerHTML = html;
                // } else {
                //     console.error(`Element with ID "${elementId}" not found.`);
                // }
            }
            catch (error) {
                console.error("Failed to load HTML:", error);
            }
        });
    }
}
export default HtmlService;
