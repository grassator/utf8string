'use strict';

const stringToUtf8Bytes = require('./encode').stringToUtf8Bytes;

const UTF8STRING = Symbol('Utf8String Ref');
const BYTES = Symbol('Utf8String Data');

function error(message) {
    throw new Error(message);
}

class BytesIterator {
    constructor(str) {
        this[BYTES] = str[BYTES];
        this.output = { value: Utf8String.START, done: false };
        this.i = -1;
    }

    [Symbol.iterator]() {
        return this;
    }

    next() {
        if (++this.i < this[BYTES].length) {
            this.output.value = this[BYTES][this.i];
        } else {
            this.output.value = Utf8String.END;
            this.output.done = true;
        }
        return this.output;
    }

    previous() {
        this.output.done = false;
        if (--this.i >= 0) {
            this.output.value = this[BYTES][this.i];
        } else {
            this.i = -1;
            this.output.value = Utf8String.START;
        }
        return this.output;
    }

    current() {
        return this.output;
    }
}


// Adapted from decoder spec
// https://encoding.spec.whatwg.org/#utf-8-decoder
class CodePointsIterator {
    constructor(str) {
        this[BYTES] = str[BYTES];
        this.output = { value: Utf8String.START, done: false };
        this.i = -1;
    }

    [Symbol.iterator]() {
        return this;
    }

    current() {
        return this.output;
    }

    next() {
        let bytesSeen = 0;
        let bytesNeeded = 0;
        let lowerBoundary = 0x80;
        let upperBoundary = 0xBF;
        let byte = 0;
        let codePoint = 0;

        while (++this.i < this[BYTES].length) {
            byte = this[BYTES][this.i];
            if (bytesNeeded === 0) {
                if (byte >= 0 && byte <= 0x7F) {
                    this.output.value = byte;
                    return this.output;
                } else if (byte >= 0xC2 && byte <= 0xDF) {
                    bytesNeeded = 1;
                    codePoint = byte - 0xC0;
                } else if (byte >= 0xE0 && byte <= 0xEF) {
                    if (byte === 0xE0) {
                        lowerBoundary = 0xA0;
                    } else if (byte === 0xED) {
                        upperBoundary = 0x9F;
                    }
                    bytesNeeded = 2;
                    codePoint = byte - 0xE0;
                } else if (byte >= 0xF0 && byte <= 0xF4) {
                    if (byte === 0xF0) {
                        lowerBoundary = 0x90;
                    } else if (byte === 0xF4) {
                        upperBoundary = 0x8F;
                    }
                    bytesNeeded = 3;
                    codePoint = byte - 0xF0;
                } else {
                    return error('Invalid byte sequence');
                }
                codePoint = codePoint << (6 * bytesNeeded);
            } else if (byte < lowerBoundary || byte > upperBoundary) {
                return error('Invalid byte sequence');
            } else {
                lowerBoundary = 0x80;
                upperBoundary = 0xBF;
                ++bytesSeen;
                codePoint += (byte - 0x80) << (6 * (bytesNeeded - bytesSeen));

                if (bytesSeen === bytesNeeded) {
                    const returnCodePoint = codePoint;
                    codePoint = 0;
                    bytesNeeded = 0;
                    bytesSeen = 0;
                    this.output.value = returnCodePoint;
                    return this.output;
                }
            }
        }

        this.output.value = Utf8String.END;
        this.output.done = true;
        return bytesNeeded === 0 ? this.output : error('Invalid byte sequence');
    }

    previous() {
        this.output.done = false;
        if (--this.i >= 0) {
            let diff = 1;
            // TODO this is probably suboptimal, so should be looked into later
            if (this[BYTES][this.i] & 0x80) {
                if ((this[BYTES][--this.i] & 0x40) === 0) {
                    ++diff;
                    if ((this[BYTES][--this.i] & 0x40) === 0) {
                        ++diff;
                        if ((this[BYTES][--this.i] & 0x40) === 0) {
                            ++diff;
                        }
                    }
                }
                --this.i;
                this.next();
                this.i -= diff;
            } else {
                this.output.value = this[BYTES][this.i];
            }
        } else {
            this.i = -1;
            this.output.value = Utf8String.START;
        }
        return this.output;
    }
}

class Utf8String {

    /**
     * Creates a Utf8String from native string representation
     * @param {string=} str
     */
    constructor(str) {
        if (typeof str !== 'string') {
            this[BYTES] = [];
        } else {
            this[BYTES] = stringToUtf8Bytes(str);
        }
    }

    /**
     * Creates and returns an iterator over bytes of raw utf8 representation,
     * positioned before the start of the string
     * @returns {BytesIterator}
     */
    bytes() {
        return new BytesIterator(this);
    }

    /**
     * Creates and returns an iterator over bytes of raw utf8 representation,
     * positioned after the end of the string
     * @returns {BytesIterator}
     */
    bytesEnd() {
        const iter = new BytesIterator(this);
        iter.i = iter[BYTES].length;
        iter.output.value = Utf8String.END;
        iter.output.done = true;
        return iter;
    }

    /**
     * Creates and returns an iterator over Unicode code points in this string,
     * positioned before the start of the string
     * @returns {CodePointsIterator}
     */
    codePoints() {
        return new CodePointsIterator(this);
    }

    /**
     * Creates and returns an iterator over Unicode code points in this string,
     * positioned after the end of the string
     * @returns {CodePointsIterator}
     */
    codePointsEnd() {
        const iter = new CodePointsIterator(this);
        iter.i = this[BYTES].length;
        iter.output.value = Utf8String.END;
        iter.output.done = true;
        return iter;
    }

    /**
     * Alias of `codePoints()` for constructs expecting iteration protocol
     * @returns {CodePointsIterator}
     */
    [Symbol.iterator]() {
        return new CodePointsIterator(this);
    }

    /**
     * Overriding to make implicit conversion to string to do the right thing
     * @returns {string}
     */
    toString() {
        return String.fromCodePoint.apply(String, Array.from(this.codePoints()));
    }

    /**
     * Creates a new Utf8String by appending a given one to this one
     * @param {Utf8String} otherUtf8String
     * @throws Error
     * @returns {Utf8String}
     */
    append(otherUtf8String) {
        if (typeof otherUtf8String !== 'object' || !(otherUtf8String instanceof Utf8String)) {
            error(`'${otherUtf8String}' is not a Utf8String`);
        }
        const result = new Utf8String();
        result[BYTES] = this[BYTES].concat(otherUtf8String[BYTES]);
        return result;
    }

    /**
     * Creates a new Utf8String by prepending a given one to this one
     * @param {Utf8String} otherUtf8String
     * @throws Error
     * @returns {Utf8String}
     */
    prepend(otherUtf8String) {
        return otherUtf8String.append(this);
    }
}

Utf8String.START = -1;
Utf8String.END = -2;

Utf8String.count = function (iterable) {
    if (iterable instanceof BytesIterator) {
        return iterable[BYTES].length;
    } else {
        let count = 0;
        while (!iterable.next().done) {
            ++count;
        }
        return count;
    }
};

module.exports = Utf8String;
