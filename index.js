const [,, ...params] = process.argv

function errorHandler(error) {
    process.exitCode = process.exitCode || 1
    console.error(error)
}

function am(asyncMain) {
    try {
        const mainResult = asyncMain(...params)
        if (typeof mainResult.catch === 'function') {
            mainResult.catch(e => errorHandler)
        }
    } catch (e) {
        errorHandler(e)
    }
}

module.exports = am
