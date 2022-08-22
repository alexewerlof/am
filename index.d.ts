/**
 * A function that will be called with the cli args skipping the first two from process.argv
 * (ie. node and script name are not passed)
 * This function may return a promise
 */
type AsyncMain = (...args: string[]) => any

/**
 * A function that will be called with an error that may be thrown
 * This function may return a promise
 */
type ErrorHandler = (error: Error) => any

/**
 * Calls a function asynchronously and optionally passes any error to the error handler
 * This function will return after asyncMain is executed or in case of error, the
 * errorHandler is executed.
 * 
 * @param main a function that will be executed asynchronously.
 * It can be an `async` or *sync* (traditional) function.
 * If there's an error the `errorHandler` will be called.
 * The `main` function will get the CLI arguments as its parameters in the order they were typed by
 * the user.
 * When you first call `am`, it will listen to `unhandledRejection` event and prints the error
 * message referring to the failed promise and sets the `process.exitCode` to `2`.
 * The default or provided `errorHandler` will not be called (that way you can call `am()` as many
 * times as needed)
 * @param errorHandler  an optional `async` or *sync* (traditional) function that'll be called if
 * the `main()` function throws. It takes the error as its argument. Even if you provide your custom
 * error handler, we still set the `process.exitCode` to `1` if you forget to set it to a non-zero
 * value.
 * Also, if your custom `errorHandler` throws for whatever reason, `am` will use its default error
 * handler.
 * If you don't provide an error handler a default one will be used which merely logs the error
 * using `console.error()`
 */
declare function am(main: AsyncMain, errorHandler?: ErrorHandler): Promise<ReturnType<AsyncMain>>;
