# Iterator.js

An Iterator is a wrapper to JavaScript's iterators that adds functional operators to it (such as map, reduce...).

Most of its methods return a new Iterator, but they don't execute any operation until explicitly requested.
This is because the functions are executed lazily.
E.g. by iterating with a for..of, or by calling toArray or other methods that consume the Iterator.

Thanks to the laziness of the execution (achieved through generators), infinite Iterators can be manipulated.

You can install it via NPM.

```bash
npm install iteratorgenerator
```

Or you can use it client side by including https://cdn.rawgit.com/PaoloSarti/Iterator.js/master/Iterator.js

This library depends heavily on ES6 features, such as generators, Maps, Sets, the for..of construct.
For an EcmaScript 5 (ES6 features supported) implementation of some of these concepts, please see http://winterbe.github.io/streamjs/
