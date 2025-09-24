# Contributing

Thanks for your interest in contributing to TaleSpire-Mothership-1e-Toolset! Please take a moment to review this document **before submitting a pull request**.

## Pull Requests

Please ask first before starting work on any significant new features.

It's never a fun experience to have your pull request declined after investing a lot of time and effort into a new feature. To avoid this from happening, we request that contributors create a feature request to first discuss any new ideas. Your ideas and suggestions are welcome!

Please ensure that the tests are passing when submitting a pull request. If you're adding new features to TaleSpire-Mothership-1e-Toolset, please include tests.

## Development Environment

### Dependencies

#### TypeScript

TaleSpire-Mothership-1e-Toolset uses [TypeScript](https://www.typescriptlang.org/) as its primary language. TypeScript is a strongly typed programming language that builds on JavaScript. TypeScript adds additional syntax to JavaScript to support a tighter integration with your editor, allowing you to catch errors early in your editor. TypeScript code converts to JavaScript and can run anywhere JavaScript runs (in this case: TaleSpire's Symbiote popout).

#### Node

[Node.js](https://nodejs.org/en) is a free, open-source, cross-platform JavaScript runtime environment that lets developers create servers, web apps, command line tools and scripts. TaleSpire-Mothership-1e-Toolset uses Node.js as the underlying environment for running itself outside of TaleSpire. Specifically, TaleSpire-Mothership-1e-Toolset uses Node.js as the runtime environment for executing Jest unit tests and the [webpack development server](https://webpack.js.org/configuration/dev-server/), which lets us test TaleSpire-Mothership-1e-Toolset in a web browser instead of TaleSpire.

#### Node Package Manager (npm)

[npm](https://docs.npmjs.com/about-npm) is the world's largest software registry. Open source developers from every continent use npm to share and borrow packages, and many organizations use npm to manage private development as well. The libraries listed under `devDependencies` in the `package.json` file are the npm packages TaleSpire-Mothership-1e-Toolset uses for its development environment.

#### Package.json

`package.json` is a special file that describes your Node.js project. It contains information about your app, such as its name, version, dependencies, scripts, and more. This file is essential for managing and sharing Node.js projects, especially when using npm.

## How-To Run

Execute the following commands at the root of the project (i.e. the same directory as the `package.json` file):

### Install Dev Dependencies

`npm install`

### Build

**Development Build**

`npm run build`

**Production Build**

`npm run build:talespire`

### Unit Tests

**Run All Tests**

`npm test`

**Run All Tests with Code Coverage**

`npm run test:converage`

## How-To Deploy

### Web Browser (Development)

http://localhost:4000/

### TaleSpire (Production)

http://localhost:8080/

### References

#### Icons Source

SVGs for icons used in this project come from https://fonts.google.com/icons.

#### TaleSpire Symbiotes

-   [Symbiotes Docs](https://symbiote-docs.talespire.com/)

#### Web Components

-   [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
-   [Web Components Examples](https://github.com/mdn/web-components-examples/tree/main)
-   [Web Components - Introduction](https://www.webcomponents.org/introduction)
-   [Using Global Styles in Shadow DOM](<https://eisenbergeffect.medium.com/using-global-styles-in-shadow-dom-5b80e802e89d#:~:text=Adding%20Global%20Styles%20to%20Declarative%20Shadow%20DOM%20(DSD)&text=The%20adopt%2Dglobal%2Dstyles%20element,once%20the%20work%20is%20done.>)
-   [Adding Form Participation Support to Web Components](https://www.raymondcamden.com/2023/05/24/adding-form-participation-support-to-web-components)

#### JavaScript & TypeScript

-   [Compile TS to JS: A Beginner's Guide](https://daily.dev/blog/compile-ts-to-js-a-beginners-guide)
-   [How to load HTML from another page with vanilla JavaScript](https://gomakethings.com/how-to-load-html-from-another-page-with-vanilla-javascript/)
-   [Using webpack with TypeScript](https://blog.logrocket.com/using-webpack-typescript/)
-   [Webpack Getting Started](https://webpack.js.org/guides/getting-started/)
-   [Webpack TerserWebpackPlugin](https://webpack.js.org/plugins/terser-webpack-plugin/)
-   [esbuild Getting Started](https://esbuild.github.io/getting-started/)

#### Unit Testing & Code Coverage

-   [Dice Vault Unit Test Prototyping](https://github.com/JasonCostanza/Dice-Vault/compare/main...kbarnett/unit-tests-prototype)
-   [TypeScript Unit Testing 101: A Developer’s Guide](https://www.testim.io/blog/typescript-unit-testing-101/)
-   [Unit Testing in TypeScript](https://refraction.dev/blog/unit-testing-in-typescript)
-   [How to write test cases in typescript](https://medium.com/design-bootcamp/how-to-write-test-cases-in-typescript-fa7a263b7833)
-   [Writing Well-Structured Unit Test in TypeScript](https://dev.to/arifintahu/writing-well-structured-unit-test-in-typescript-2hal)
-   [Measuring Typescript Code Coverage with Jest and GitHub Actions](https://about.codecov.io/blog/measuring-typescript-code-coverage-with-jest-and-github-actions/)
    -   [GitHub](https://github.com/amacgregor/codecov-jest-github-actions/blob/main/jest.config.ts)
-   [How to Test a TypeScript App with Jest | A Step-by-Step Tutorial](https://www.meticulous.ai/blog/jest-typescript)

#### Sidebar Navigation Menu

-   https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sidenav
-   https://www.youtube.com/watch?v=MszSqhEw__8
-   https://www.w3schools.com/howto/howto_js_fullscreen_overlay.asp
-   https://www.w3schools.com/howto/howto_js_sidenav.asp
-   https://tailwindcss.com/docs/z-index

#### Databases and ORMs

-   [sqlite3 npm package](https://www.npmjs.com/package/sqlite3?activeTab=readme)
-   [Get started with SQLite database in a TypeScript project](https://www.octans-solutions.fr/en/articles/sqlite-typescript)
-   [Implementing SQLite3 with Node.js and TypeScript](https://koraytug.hashnode.dev/implementing-sqlite3-with-nodejs-and-typescript)
-   [Kysely](https://kysely.dev/)
-   [Most complete typescript ORM available right now?](https://www.reddit.com/r/node/comments/1627z0m/most_complete_typescript_orm_available_right_now/)
-   [The best TypeScript ORMs](https://blog.logrocket.com/best-typescript-orms/)
