import { PathService } from "../src/services/path-service";

describe("PathService", () => {
    it("getSymbioteRootPath(): for URL without '/dist/' should throw an Error", () => {
        const url = "http://localhost:58303/symbiotes/2_80f81747-b1c2-498e-bf20-98ca1fb9f57b/index.html";
        setMockedLocationHref(url);

        expect(PathService.instance.getSymbioteRootPath).toThrow("The URL does not contain '/dist/'");
    });

    it("getSymbioteRootPath(): for TaleSpire URL should return a URL ending in a GUID", () => {
        const expected = "http://localhost:58303/symbiotes/2_80f81747-b1c2-498e-bf20-98ca1fb9f57b";
        const url = `${expected}/dist/index.html`;
        setMockedLocationHref(url);

        const result = PathService.instance.getSymbioteRootPath();

        expect(result).toEqual(expected);
    });

    it("getSymbioteRootPath(): for local web server URL should return a URL ending in a localhost:<port>/", () => {
        const expected = "http://localhost:8080";
        const url = `${expected}/dist/index.html`;
        setMockedLocationHref(url);

        const result = PathService.instance.getSymbioteRootPath();

        expect(result).toEqual(expected);
    });

    it("getSymbioteRootPath(): for file URL should return a URL ending in the directory the symbiote is installed in", () => {
        const expected =
            "file:///C:/Users/janedoe/AppData/LocalLow/BouncyRock%20Entertainment/TaleSpire/Symbiotes/Example-Symbiote";
        const url = `${expected}/dist/index.html`;
        setMockedLocationHref(url);

        const result = PathService.instance.getSymbioteRootPath();

        expect(result).toEqual(expected);
    });

    function setMockedLocationHref(url: string) {
        jest.spyOn(window, "location", "get").mockReturnValue({
            href: url,
        } as any);
    }
});
