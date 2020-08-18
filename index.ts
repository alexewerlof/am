import { isObj, isFn } from 'jty'

function isObjWithFn(obj, fnName) {
    return isObj(obj) && isFn(obj[fnName])
}

function getGlobal() {
    let global
    if (isObj(process)) {
        global = process
    }
    if (isObj(Worker)) {
        global = Worker
    }
    if (isObj(global) && isFn(global.on)) {
        return global
    }
    throw new Error('Could not get global')
}

function defaultErrorHandler(error) {
    if (isObj(process)) {
        process.exitCode = process.exitCode || 1
    }
    if (isObjWithFn(console, 'error')) {
        console.error(error)
    }
}

const addedErrorHandlers = new WeakSet()

function listenToUnhandledRejection(errorHandler) {
    if (isFn(errorHandler) && !addedErrorHandlers.has(errorHandler)) {
        addedErrorHandlers.add(errorHandler)
        getGlobal().on('unhandledRejection', (error, failedPromise) => {
            if (isObjWithFn(console, 'warn')) {
                console.warn('Unhandled Rejection at: Promise', failedPromise)
            }
            errorHandler(error)
        })
    }
}

function getScriptArgs(process) {
    if (isObj(process) && Array.isArray(process.argv)) {
        const [, , ...params] = process.argv
        return params
    }
    return []
}

export type MainFunction = (...cliArgs: string[]) => Promise<any>
export interface AMOptions {

}

// TODO: document the options
export function am(mainFn: MainFunction, options: AMOptions = { errorHandler: defaultErrorHandler }) {
    if (!isFn(mainFn)) {
        throw new TypeError(`Expected a function for mainFn. Got: ${mainFn}`)
    }
    if (!isObj(options)) {
        throw new TypeError(`Expected an object for options. Got: ${options}`)
    }

    const errorHandler = isFn(options, 'errorHandler') ?
        options.errorHandler : defaultErrorHandler
    const urHandler = isFn(options, 'urHandler') ?
        options.urHandler : errorHandler

    try {
        listenToUnhandledRejection(urHandler)
        const mainResult = mainFn(...getScriptArgs(process))
        // If asyncMain is indeed an async function, it'll always return a promise and promises have a .catch() method
        if (isFn(mainResult, 'catch')) {
            mainResult.catch(errorHandler)
        }
    } catch (error) {
        // If asyncMain is indeed a sync function, its possible extensions will be handled here
        errorHandler(error)
    }
}

export default am
