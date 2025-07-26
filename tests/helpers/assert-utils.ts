import { Result } from "../../src/lib/result/result";

export class AssertUtils {
    static expectResultToBeFailure(actual: Result<any>, expectedCode: string, expectedDescription: string) {
        expect(actual.isFailure).toBe(true);
        expect(actual.value).not.toBeDefined();
        expect(actual.error).toBeDefined();
        expect(actual.error.code).toBe(expectedCode);
        expect(actual.error.description).toBe(expectedDescription);
    }
}
