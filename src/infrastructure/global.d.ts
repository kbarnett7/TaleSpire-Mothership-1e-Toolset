// Extend the Window interface to include lastComponentId
declare global {
    interface Window {
        lastComponentId?: number;
    }
}

export {};
