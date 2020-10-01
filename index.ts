import { isObj, isFn } from 'jty'

function createURListener(unhandledRejection?: ErrorHandler): UnresolvedPromiseErrorHandler {
    return function unhandledRejectionHandler(error: Error, promise: Promise<any>) {
        if (isObj(process)) {
            process.exitCode = process.exitCode || 1
        }
        if (isFn(unhandledRejectionHandler)) {
            try {
                unhandledRejectionHandler(error, promise)
            } catch (errFromUserProvidedErrorHandler) {
                console.error(errFromUserProvidedErrorHandler)
                console.error(`Error when running the user-provided custom error handler for unhandled promise rejection ${error}\nThe failed promise: ${promise}`)
            }
        } else {
            console.error(error)
        }
    }
}

export type MainFunction = (...args: string[]) => Promise<any> | any
export type ErrorHandler = (error: Error) => void
export type UnresolvedPromiseErrorHandler = (error: Error, promise: PromiseLike<any>) => void

/**
 * The options
 */
export interface AMOptions {
    errorHandler?: ErrorHandler;
    urHandler?: UnresolvedPromiseErrorHandler;
    process?: NodeJS.Process;
}

function getArgs(process: NodeJS.Process): string[] {
    return isObj(process) && Array.isArray(process.argv) ? process.argv.slice(2) : []
}

async function asyncAm(mainFn: MainFunction, options: AMOptions = { process }) {
    try {
        if (!isFn(mainFn)) {
            throw new TypeError(`Expected a function for mainFn. Got: ${mainFn}`)
        }

        if (!isObj(options)) {
            throw new TypeError(`Expected an object for options. Got: ${options}`)
        }

        const urHandler = createURListener(options.errorHandler)

        process.on('unhandledRejection', urHandler)
        await mainFn(...getArgs(process))
    } catch (error) {
        if (isObj(process)) {
            process.exitCode = process.exitCode || 1
        }
        const { errorHandler } = options
        if (isFn(errorHandler)) {
            try {
                errorHandler(error)
            } catch (errFromUserProvidedErrorHandler) {
                console.error(errFromUserProvidedErrorHandler)
                console.error(error)
            }
        } else {
            console.error(error)
        }
    }
}

export function am(mainFn: MainFunction, options?: AMOptions): void {
    asyncAm(mainFn, options).catch(errorHandler).finally(() => process.off('unhandledRejection', urHandler))
}

am.am = am;

export default am
