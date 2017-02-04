# Iterator.js

An Iterator is a wrapper to JavaScript's iterators that adds functional operators to it (such as map, reduce...).

Most of its methods return a new Iterator, but they don't execute any operation until explicitly requested.
This is because the functions are executed lazily.
E.g. by iterating with a for..of, or by calling toArray or other methods that consume the Iterator.

Thanks to the laziness of the execution (achieved through generators), infinite Iterators can be manipulated.

The implementation is based on new features of the language such as generators.
In fact, it was developed mostly because I wanted to test the new features.

You can install it via NPM.

```bash
npm install iteratorgenerator
```

Or you can use it client side by including https://cdn.rawgit.com/PaoloSarti/Iterator.js/master/Iterator.js

For a more reliable implementation of this concept, please see http://winterbe.github.io/streamjs/
