/**
 * A function that will be called with the cli args skipping the first two from process.argv
 * (ie. node and script name are not passed)
 */
type AsyncMain = (...args: string[]) => Promise<void>
/**
 * A function that will be called with an error that may be thrown
 */
type ErrorHandler = (error: Error) => void

/**
 * Calls a function asynchronously and optionally passes any error to the error handler
 * 
 * @param asyncMain a function that will be executed asynchronously
 * @param errorHandler an optional error handler that will be called if an error happens
 * when running the asyncMain or if there are unhandled promises
 */
declare function am(asyncMain: AsyncMain, errorHandler?: ErrorHandler): Promise<void>;
