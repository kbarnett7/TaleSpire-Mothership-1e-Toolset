module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    transform: { "^.+\\.ts?$": "ts-jest" },
    testRegex: "/tests/.*\\.(test|spec)?\\.(ts|tsx)$",

    collectCoverage: true,
    coverageDirectory: ".coverage",
    coverageReporters: ["text", "html"],
    collectCoverageFrom: ["./src/**/*", "!./build/**"],
};
