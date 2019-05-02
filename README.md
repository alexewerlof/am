We ♥ `async` functions but what if the main logic of your application runs asynchronously?

You could do something like:

```javascript
(async function main() {
    // my async-await logic
})()
```

But that would be ugly.

How about this:

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

* No dependency
* Absolutely the minimum code required
* Catches errors and sets the process exit code to a non-zero value
* Plan javascript
* Runs in Node 6+
* No `async` or `await` is used in the module code so as long as your `main()` return promises, we're cool

Bonus: `am()` also passes the main arguments from the `process.env` to your code so if you run it like:

```bash
$ node index.js param1 param2
```

Then your `main()` function gets them as two arguments:

```javascript
const am = require('am')
am(async function main(foo, bar) {
    // foo === "param1"
    // bar === "param2"
})
```

---

_Made in Sweden by [@alexewerlof](https://twitter.com/alexewerlof)_
