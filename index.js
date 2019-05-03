const [,, ...params] = process.argv

function errorHandler(error) {
    process.exitCode = process.exitCode || 1
    console.error(error)
}

process.on('unhandledRejection', (error, failedPromise) => {
    console.warn('Unhandled Rejection at: Promise', failedPromise)
    errorHandler(error)
})

function am(asyncMain) {
    try {
        const mainResult = asyncMain(...params)
        if (typeof mainResult.catch === 'function') {
            mainResult.catch(errorHandler)
        }
    } catch (error) {
        errorHandler(error)
    }
}

module.exports = am
