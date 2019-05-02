const [,, ...params] = process.argv
function am(asyncMain) {
    asyncMain(...params).catch(e => {
        process.exitCode = 1
        console.error(e)
    })
}

module.exports = am