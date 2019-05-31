const am = require('./index')

describe('Runs an async main', () => {
    it('runs an async function', done => {
        am(async function main() {
            done()
        })
    })

    it('runs an sync function', () => {
        am(function main() {
            expect(true).toEqual(true)
        })
    })
})