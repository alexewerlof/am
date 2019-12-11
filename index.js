function isObj(x) {
    return x && typeof x === 'object'
}

function isFn(x) {
    return typeof x === 'function'
}

function getGlobal() {
    if (isObj(process)) {
        return process
    }
    if (isObj(window)) {
        return window
    }
    if (isObj(Worker)) {
        return Worker
    }
    throw new Error('Could not get global')
}

function defaultErrorHandler(error) {
    if (isObj(process)) {
        process.exitCode = process.exitCode || 1
    }
    if (isObj(console)) {
        console.error(error)
    }
}

const addedErrorHandlers = new WeakSet()

function listenToUnhandledRejection(errorHandler) {
    if (isFn(errorHandler) && !addedErrorHandlers.has(errorHandler)) {
        addedErrorHandlers.add(errorHandler)
        getGlobal().on('unhandledRejection', (error, failedPromise) => {
            if (isObj(console) && isFn(console.warn)) {
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

// TODO: document the options
function am(asyncMain, options) {
    const errorHandler = isObj(options) && isFn(options.errorHandler) ?
        options.errorHandler : defaultErrorHandler
    const unhandledRejectionHandler = isObj(options) && isFn(options.unhandledRejectionHandler) ?
        options.unhandledRejectionHandler : errorHandler

    try {
        listenToUnhandledRejection(unhandledRejectionHandler)
        const mainResult = asyncMain(...getScriptArgs(process))
        // If asyncMain is indeed an async function, it'll always return a promise and promises have a .catch() method
        if (mainResult !== undefined && isFn(mainResult.catch)) {
            mainResult.catch(errorHandler)
        }
    } catch (error) {
        // If asyncMain is indeed a sync function, its possible extensions will be handled here
        errorHandler(error)
    }
}

module.exports = am
module.exports.am = am
