A simple wrapper for running a top level async functions, addressing some quirks.
Its main use case is for CLI utilities where the main logic is in an `async` function.

> **Do I really need this?** No, if you are asking. Yes, if a simple IIFE doesn't do the job and you find yourself dealing with unexpected bugs and copy/pasted workarounds. 

* Works with `async` functions, native or custom promises
* Sets the process exit code to non-zero in case of an error
* Handles unhandled promises
* 🐭 [Minimal and readable code](./index.js)
* ⚠ When run in node, sets the process exit code to a non-zero value
* 🏳 Can run both `async` or synchronous functions
* 💌 Passes arguments to the main function
* Supports custom error handlers
* Listens to `unhandledRejection` error and prints the stack trace and the name of the faulty function

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

Despite that, the **process exit code** remains 0 which means if you're chaining your script in a bash script (using `&&` for example), the rest of the chain will continue.
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

# API

`am(main, options?): void`

* `main` is an `async` or *sync* (normal) function. If there's an error the `errorHandler` will be called.
  If it's run in Node, the `main` function will get the parameters as arguments.
* `errorHandler` an optional function that'll be called if an error happens.
  It'll get the error as its argument.
  If you don't provide an `errorHandler`, the default error handler will be used which simply sets the `process.exitCode` to a non-zero value and prints the error stack trace using `console.error`.

The `am()` function returns nothing.

---

_Made in Sweden by [@alexewerlof](https://twitter.com/alexewerlof)_
