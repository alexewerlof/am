const [,, ...params] = process.argv
function am(asyncMain) {
    try {
        const mainResult = asyncMain(...params)
        if (typeof mainResult.catch === 'function') {
            mainResult.catch(e => {
                process.exitCode = 1
                console.error(e)
            })
        }
    } catch (e) {
        process.exitCode = 1
        console.error(e)
    }
}

module.exports = am