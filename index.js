function defaultErrorHandler(error) {
    process.exitCode = process.exitCode || 1
    console.error(error)
}

function unhandledRejectionHandler(error, failedPromise) {
    process.exitCode = process.exitCode || 2
    console.warn(`Unhandled Promise Rejection ${error}\n\tat: Promise ${failedPromise}`)
}

function getScriptArgs(argv) {
    const [, , ...params] = argv
    return params
}

async function runMain(asyncMain, argv = process.argv) {
    await asyncMain(...getScriptArgs(argv))
}

let unhandledRejectionRegistered = false

function am(asyncMain, errorHandler = defaultErrorHandler) {
    if (!unhandledRejectionRegistered) {
        process.on('unhandledRejection', unhandledRejectionHandler)
        unhandledRejectionRegistered = true
    }

    runMain(asyncMain).catch(errorHandler)
}

am.am = am

module.exports = am
