# Utf8String

[![NPM version](https://badge.fury.io/js/utf8string.svg)](https://npmjs.org/package/utf8string)
[![Build Status][travis-image]][travis-url]

[project-url]: https://github.com/grassator/utf8string
[travis-url]: https://travis-ci.org/grassator/utf8string
[travis-image]: https://travis-ci.org/grassator/utf8string.svg?branch=master

While this string implementation has all the necessary bits to sometime grow into
a full-fledged implementation, this is unlikely to happen firstly because of
time needed, but also because such an implementation require a custom regular
expression engine.

## Simple Example

```js
const str = new Utf8String('aaaabc');
const searchStr = new Utf8String('aab');
const result = str.substring(str.find(searchStr));
console.log(String(result)); // "aabc"
```

For more examples please refer to the tests.

## Immutability

All string operation return a new `Utf8String` object.


## Iterating a string

Because of the nature of UTF-8 encoding (and Unicode in general),
a JavaScript's String style random access to a string is not very
desirable for performance reasons since you have to always iterate
from the start of the string and count the code points.

Moreover code points may not be what you want to count, as, for
example grapheme clusters should be used for counting what would
one visually consider "characters".

This is why `Utf8String` exposes a `codePoints()` method that
returns an iterator over unicode code points, which is also
aliased to an `[Symbol.iterator]()` method so that it is easy
to use `Utf8String` in `for .. of` constructs and with other
functions and constructs that expect an object conforming to an
iterator protocol such as `Array.from()` or spread operator.

`Utf8String` also provides a `bytes()` iterator that could
be used for low-level access to the string.

## Size of a string

The same as with iteration, depending on your particular requirements
you might have a different definition of a size (or a length) of a
string. This is why instead of providing a multitude of instance
methods `Utf8String` library takes a different approach with
delivering a single class utility method called `Utf8String.count()`,
which accepts and iterable, such as one returned by `codePoints()`
or `bytes()` instance method.

This approach also allows to provide additional iterators such as
characters (grapheme clusters), or even words as separate packages
while making use of default length / counting facilities.
