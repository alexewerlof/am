A simple and light way to run a main function asynchronously

* 0️⃣ No dependency 
* 🐭 Absolutely the minimum code re🐭quired
* ⚠ Catches errors and sets the process exit code to a non-zero value
* ⚡Runs in Node 6+
* 🏳 No `async` or `await` is used in the module code so as long as your `main()` return promises, we're cool
* 💌 Passes arguments to the main function
* Works in the browser as well as Node
* Listens to `unhandledRejection` error and prints the stack trace and the name of the faulty function

### Install

`npm i am`

_(no pun intended!)_ 😎

# Why?

We ♥ `async` functions but what if the main logic of your application runs asynchronously?
Top level `await` is not supported [because of complications](https://gist.github.com/Rich-Harris/0b6f317657f5167663b493c722647221).

But you can do something like:

```javascript
(async function main() {
    // my async-await logic
})()
```

That does not look elegant but it works. Kinda! If there's an error, `main()` throws an error that is not being handled.
Besides you probably want your script to return a non-zero error code.
`am` handles these edge cases. It stands for **async main** and works like this:

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

`am(main, errorHandler?): void`

* `main` is an `async` or *sync* (normal) function. If there's an error the `errorHandler` will be called.
  If it's run in Node, the `main` function will get the parameters as arguments.
* `errorHandler` an optional function that'll be called if an error happens.
  It'll get the error as its argument.
  If you don't provide an `errorHandler`, the default error handler will be used which simply sets the `process.exitCode` to a non-zero value and prints the error stack trace using `console.error`.

The `am()` function returns nothing.

---

_Made in Sweden by [@alexewerlof](https://twitter.com/alexewerlof)_
