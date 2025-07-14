const fs = require("fs");
const path = require("path");

/**
 * Updates the `bundle.js` path in the `index.html` file to make it referenceable in TaleSpire.
 *
 * Purpose:
 * TaleSpire requires all file paths to be relative to the root of the distribution folder.
 * By default, Webpack generates an absolute path (e.g., `/bundle.js`) in the `index.html` file,
 * which is not compatible with TaleSpire's file resolution system. This function modifies the
 * `index.html` file to replace the absolute path with a relative path (e.g., `./bundle.js`),
 * ensuring compatibility with TaleSpire's environment.
 *
 * How It Works:
 * 1. Reads the `index.html` file from the `dist` directory.
 * 2. Searches for the absolute path to `bundle.js` (e.g., `"/bundle.js"`) using a regular expression.
 * 3. Replaces the absolute path with a relative path (e.g., `"./bundle.js"`).
 * 4. Writes the updated content back to the `index.html` file.
 *
 * Why It's Needed:
 * - TaleSpire does not serve files from a web server, so absolute paths (e.g., `/bundle.js`)
 *   cannot be resolved. Instead, all paths must be relative to the `index.html` file.
 * - This function ensures that the generated `index.html` file is properly configured for
 *   deployment in TaleSpire, allowing the toolset to function correctly in that environment.
 *
 * Usage:
 * This function is executed as part of the build process after Webpack generates the `index.html` file.
 * It ensures that the final distributable files are compatible with TaleSpire's requirements.
 */
function updateBundlePathInIndexHtml() {
    console.log("Updating bundle.js path in index.html to a referenceable path in TaleSpire...");

    const indexHtmlPath = path.resolve(__dirname, "../dist/index.html");
    const newBundlePath = "./bundle.js";

    let htmlContent = fs.readFileSync(indexHtmlPath, "utf-8");

    htmlContent = htmlContent.replace(/"\/bundle.js"/, `"${newBundlePath}"`);

    fs.writeFileSync(indexHtmlPath, htmlContent, "utf-8");

    console.log("Finished updating bundle.js path in index.html!");
}

/**
 * Updates the "environment" setting in the generated bundle.js file.
 *
 * Purpose:
 * This function modifies the environment configuration embedded in the built bundle.js file,
 * replacing any occurrence of `"environment":"integration"` with a new value (e.g., `"environment":"production"`).
 * This is necessary to ensure that the application runs with the correct environment settings
 * after the build process, especially when deploying to different environments.
 *
 * How It Works:
 * 1. Reads the contents of the bundle.js file from the dist directory.
 * 2. Searches for the string `"environment":"integration"` using a regular expression.
 * 3. Replaces it with the desired environment value (e.g., `"environment":"production"`).
 * 4. Writes the updated content back to the bundle.js file.
 *
 * Why It's Needed:
 * - The environment setting in bundle.js determines how the application behaves at runtime.
 * - This function allows the build process to dynamically set the environment without requiring
 *   a rebuild or manual editing of the bundle.
 *
 * Usage:
 * This function is typically called as part of the post-build process, after Webpack has generated
 * the bundle.js file, to ensure the correct environment configuration is set for deployment.
 */
function updateAppSettingsEnvironmentValue() {
    console.log("Updating app settings environment variable in bundle.js...");

    const bundlePath = path.resolve(__dirname, "../dist/bundle.js");
    const newValue = `"environment":"production"`;

    let fileContents = fs.readFileSync(bundlePath, "utf-8");

    fileContents = fileContents.replace(/"environment":"integration"/, `${newValue}`);

    fs.writeFileSync(bundlePath, fileContents, "utf-8");

    console.log("Finished updating bundle.js app settings environment variable!");
}

function run(environment) {
    console.log(`Running talespire-bundle-updater.js for environemnt "${environment}" . . .`);

    updateBundlePathInIndexHtml();
    updateAppSettingsEnvironmentValue();

    console.log(`Finished running talespire-bundle-updater.js!`);
}

run(process.argv[2]);
