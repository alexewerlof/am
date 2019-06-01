const am = require('./index')

describe('Runs an async main', () => {
    it('runs an async function', done => {
        am(async function main() {
            done()
        })
    })

    it('runs a sync function', () => {
        am(function main() {
            expect(true).toEqual(true)
        })
    })

    it('handles error from an async function', done => {
        am(async function main() {
            throw 'Bad bad bad error!'
        }, error => {
            expect(error).toEqual('Bad bad bad error!')
            expect(process.exitCode).not.toBe(0)
            done()
        })
    })

    it('handles error from a sync function', () => {
        am(function main() {
            throw 'Bad bad bad error!'
        }, error => {
            expect(error).toEqual('Bad bad bad error!')
            expect(process.exitCode).not.toBe(0)
        })
    })
})