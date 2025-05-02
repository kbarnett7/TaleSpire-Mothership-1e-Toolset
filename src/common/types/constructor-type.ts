/**
 * Represents a class constructor for a type `T`.
 *
 * This type is used to define a constructor signature for classes that can be instantiated
 * with the `new` keyword. It is particularly useful in scenarios where you need to pass
 * class constructors as arguments, such as for dependency injection, factory methods, or
 * generic type handling at runtime.
 *
 * @typeParam T - The type of the object that the constructor creates.
 *
 * @example
 * // Example usage in a function that accepts a class constructor
 * function createInstance<T>(ctor: Constructor<T>): T {
 *     return new ctor();
 * }
 *
 * class Example {
 *     constructor(public name: string) {}
 * }
 *
 * const instance = createInstance(Example); // Creates an instance of Example
 * console.log(instance.name); // Outputs: undefined (no arguments passed)
 */
export type Constructor<T> = { new (...args: any[]): T };
