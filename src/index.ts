/**
 * This file serves as the entry point for dynamically importing all TypeScript files
 * within the `src` directory and its subdirectories.
 *
 * The `importAll` function utilizes Webpack's `require.context` to locate and require
 * all `.ts` files in the specified directory structure. This approach ensures that
 * all relevant modules are automatically included without the need for manual imports.
 *
 * Key functionality:
 * - `importAll`: Iterates over all matched files and requires them.
 * - `require.context`: A Webpack-specific feature that creates a context for dynamic imports.
 *
 * Usage:
 * This file is typically used in environments where all modules in a directory need to
 * be loaded dynamically, such as in a plugin-based architecture or when initializing
 * a set of related scripts.
 */
import "./index.css"; // Import the main CSS file for the application
import { Startup } from "./lib/infrastructure/startup";
import { AppLogger } from "./lib/logging/app-logger";

function importAll(requireContext: __WebpackModuleApi.RequireContext) {
    requireContext.keys().forEach(requireContext);
}

// Dynamically require all .ts files in the src directory and subdirectories
importAll(require.context("./", true, /^(?!.*\.d\.ts$).*\.ts$/));

try {
    const startup: Startup = new Startup();

    startup.configure();
} catch (error) {
    console.error(error);
}
