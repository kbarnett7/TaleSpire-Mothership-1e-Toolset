import { PathService } from "../src/infrastructure/path-service";

describe("PathService", () => {
    it("getSymbioteRootPath(): for URL without '/src/' should throw an Error", () => {
        const url = "http://localhost:58303/symbiotes/2_80f81747-b1c2-498e-bf20-98ca1fb9f57b/index.html";
        setMockedLocationHref(url);

        expect(PathService.instance.getSymbioteRootPath).toThrow("The URL does not contain '/src/'");
    });

    it("getSymbioteRootPath(): for TaleSpire URL should return a URL ending in a GUID", () => {
        const expected = "http://localhost:58303/symbiotes/2_80f81747-b1c2-498e-bf20-98ca1fb9f57b";
        const url = `${expected}/src/index.html`;
        setMockedLocationHref(url);

        const result = PathService.instance.getSymbioteRootPath();

        expect(result).toEqual(expected);
    });

    it("getSymbioteRootPath(): for local web server URL should return a URL ending in a localhost:<port>/", () => {
        const expected = "http://localhost:8080";
        const url = `${expected}/src/index.html`;
        setMockedLocationHref(url);

        const result = PathService.instance.getSymbioteRootPath();

        expect(result).toEqual(expected);
    });

    it("getSymbioteRootPath(): for file URL should return a URL ending in the directory the symbiote is installed in", () => {
        const expected =
            "file:///C:/Users/janedoe/AppData/LocalLow/BouncyRock%20Entertainment/TaleSpire/Symbiotes/Example-Symbiote";
        const url = `${expected}/src/index.html`;
        setMockedLocationHref(url);

        const result = PathService.instance.getSymbioteRootPath();

        expect(result).toEqual(expected);
    });

    it("getComponentsPath(): for URL without '/src/' should throw an Error", () => {
        const url = "http://localhost:58303/symbiotes/2_80f81747-b1c2-498e-bf20-98ca1fb9f57b/index.html";
        setMockedLocationHref(url);

        expect(PathService.instance.getComponentsPath).toThrow("The URL does not contain '/src/'");
    });

    it("getComponentsPath(): for valid URL should return a URL ending in the components directory", () => {
        const expected = "http://localhost:58303/symbiotes/2_80f81747-b1c2-498e-bf20-98ca1fb9f57b/src/components";
        const url = "http://localhost:58303/symbiotes/2_80f81747-b1c2-498e-bf20-98ca1fb9f57b/src/index.html";
        setMockedLocationHref(url);

        const result = PathService.instance.getComponentsPath();

        expect(result).toEqual(expected);
    });

    function setMockedLocationHref(url: string) {
        jest.spyOn(window, "location", "get").mockReturnValue({
            href: url,
        } as any);
    }
});
