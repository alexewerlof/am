function isObj(x) {
    return x && typeof x === 'object'
}

function isFn(x) {
    return typeof x === 'function'
}

function isObjWithFn(obj, fnName) {
    return isObj(obj) && isFn(obj[fnName])
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

// TODO: document the options
function am(asyncMainFn, options) {
    if (!isFn(asyncMainFn)) {
        throw new TypeError(`The argument is not a function: ${asyncMainFn}`)
    }
    if (options === undefined) {
        options = { errorHandler: defaultErrorHandler }
    } else if (isFn(options)) {
        options = { errorHandler: options }
    } else if (!isObj(options)) {
        throw new TypeError(`options can either be the errorHandler function or an object but got ${options}`)
    }

    const errorHandler = isObjWithFn(options, 'errorHandler') ?
        options.errorHandler : defaultErrorHandler
    const urHandler = isObjWithFn(options, 'urHandler') ?
        options.urHandler : errorHandler

    try {
        listenToUnhandledRejection(urHandler)
        const mainResult = asyncMainFn(...getScriptArgs(process))
        // If asyncMain is indeed an async function, it'll always return a promise and promises have a .catch() method
        if (isObjWithFn(mainResult, 'catch')) {
            mainResult.catch(errorHandler)
        }
    } catch (error) {
        // If asyncMain is indeed a sync function, its possible extensions will be handled here
        errorHandler(error)
    }
}

module.exports = am
module.exports.am = am
