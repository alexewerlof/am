'use strict'

function defaultErrorHandler(error) {
    console.error(error)
}

function getScriptArgs(process) {
    if (!process || typeof process !== 'object' || !Array.isArray(process.argv)) {
        return []
    }

    const [, , ...params] = process.argv
    return params
}

function setExitCode(process, code = 1) {
    if (process && typeof process === 'object' && process.exitCode !== code) {
        process.exitCode = code
    }
}

async function handleError(mainError, errorHandler) {
    setExitCode(process, 1)
    if (errorHandler === defaultErrorHandler) {
        return defaultErrorHandler(mainError)
    }

    try {
        await errorHandler(mainError)
    } catch (errorHandlerFailure) {
        console.warn(`The custom error handler failed`, errorHandlerFailure)
        defaultErrorHandler(mainError)
    }
}

function registerUnhandledRejectionHandler(process) {
    if (!process || typeof process !== 'object' || typeof process.on !== 'function' || registerUnhandledRejectionHandler.done) {
        return
    }
    
    function amUnhandledRejectionHandler(error, failedPromise) {
        setExitCode(process, 2)
        console.warn(`Unhandled Promise Rejection ${error}\n\tat: Promise ${failedPromise}`)
    }

    process.on('unhandledRejection', amUnhandledRejectionHandler)
    registerUnhandledRejectionHandler.done = true
}

async function runMain(asyncMain, errorHandler, process) {
    registerUnhandledRejectionHandler(process)
    try {
        return await asyncMain(...getScriptArgs(process))
    } catch (mainError) {
        await handleError(mainError, errorHandler)
    }
}

function am(asyncMain, errorHandler = defaultErrorHandler) {
    return runMain(asyncMain, errorHandler, process)
}

am.am = am

module.exports = am
