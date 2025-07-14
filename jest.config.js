module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    transform: { "^.+\\.ts?$": "ts-jest" },
    testRegex: "/tests/.*\\.(test|spec)?\\.(ts|tsx)$",

    collectCoverage: false,
    coverageDirectory: ".coverage",
    coverageReporters: ["text", "html"],
    collectCoverageFrom: ["./src/features/**/*", "./src/lib/**/*", "!./dist/**"],
};
