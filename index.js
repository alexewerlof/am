function defaultErrorHandler(error) {
    if (typeof process === 'object') {
        process.exitCode = process.exitCode || 1
    }
    console.error(error)
}

function listenToUnhandledRejection(process, errorHandler) {
    if (typeof process === 'object' && !listenToUnhandledRejection.enabled) {
        listenToUnhandledRejection.enabled = true
        process.on('unhandledRejection', (error, failedPromise) => {
            console.warn('Unhandled Rejection at: Promise', failedPromise)
            errorHandler(error)
        })
    }
}

function getScriptArgs(process) {
    if (typeof process === 'object' && Array.isArray(process.argv)) {
        const [, , ...params] = process.argv
        return params
    }
    return []
}

function am(asyncMain, errorHandler = defaultErrorHandler) {
    try {
        listenToUnhandledRejection(process, errorHandler)
        const mainResult = asyncMain(...getScriptArgs(process))
        if (mainResult !== undefined && typeof mainResult.catch === 'function') {
            mainResult.catch(errorHandler)
        }
    } catch (error) {
        errorHandler(error)
    }
}

module.exports = am
module.exports.am = am
