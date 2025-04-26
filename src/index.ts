function importAll(requireContext: __WebpackModuleApi.RequireContext) {
    requireContext.keys().forEach(requireContext);
}

// Dynamically require all .ts files in the src directory and subdirectories
importAll(require.context("./", true, /\.ts$/));
