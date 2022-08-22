**A simple, secure light and unified way to run a top level async function addressing some common edge cases.**

_Its main use case is for creating Node CLIs._

> **Do I really need this?** No, if you are asking. Yes, if a simple IIFE doesn't do the job and you find yourself dealing with unexpected bugs and copy/pasted workarounds. _Node.js 14.8 added top level `await` so you may not need this_.

* 0️⃣ No dependency
* 🐭 [Minimal and readable code](./index.js)
* ⚠ On throw, sets the process exit code to a non-zero value (`1`)
* Listens to `unhandledRejection` error and prints the stack trace and the name of the faulty function and sets the process exit code to a non-zero value (`2`)
* 🏳 Works with `async` functions, native or custom promises
* 💌 Passes arguments as parameters to the main function
* 💊 Supports custom error handlers
* 📦 Typescript types are included out of the box

### Install

`npm i am`

_(no pun intended!)_ 😎

# Why?

We ♥ `async` functions but what if the main logic of your application runs asynchronously?
Top level `await` is not supported [because of complications](https://gist.github.com/Rich-Harris/0b6f317657f5167663b493c722647221).

Most of the times a naïve Immediately Invoked Function Expression does the job:

```javascript
(async function main() {
    // my async-await logic
})()
```

That does not look elegant but it works. Kinda! If `main()` throws, you're dealing with an *Unhandled Promise Rejection*.
You get this:

```
UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
[DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

Despite that, the process exit code remains 0 which means if you're chaining your script in a bash script (using `&&` for example), the rest of the chain will continue.
`am` grew to handle these kinds of edge cases in a standard way. It stands for **async main** and works like this:

```javascript
const am = require('am')

am(async function main() {
    // my async-await logic
})
```

Or even:

```javascript
const am = require('am')

async function main() {
    // my async-await logic
}

am(main)
```

As a bonus it passes the node CLI parameters to main. So if you call your file like:

```bash
$ node my-script.js apple orange
```

Then your `main()` function gets them as two arguments:

```javascript
// my-script.js
const am = require('am')

am(async function main(foo, bar) {
    console.log(foo) // "apple"
    console.log(bar) // "orange"
})
```

If you prefer, you can directly pass those CLI params to something more sophisticated like [`minimist`](https://www.npmjs.com/package/minimist):

```javascript
// my-script.js
const am = require('am')
const minimist = require('minimist')

am(async function main(...cliArgs) {
    const argv = minimist(cliArgs)
    console.dir(argv) // { _: ["apple", "orange" ] }
})
```

# API

See the [typescript definition](index.d.ts)

---

_Made in Sweden by [@alexewerlof](https://twitter.com/alexewerlof)_
