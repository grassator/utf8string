'use strict';

const stringToUtf8Bytes = require('./stringToUtf8Bytes');

const UTF8STRING = Symbol('Utf8String Ref');
const BYTES = Symbol('Utf8String Data');

function error(message) {
    throw new Error(message);
}

class BytesIterator {
    constructor(str) {
        this[UTF8STRING] = str;
    }

    [Symbol.iterator]() {
        return this[UTF8STRING][BYTES][Symbol.iterator]();
    }
}


// Adapted from decoder spec
// https://encoding.spec.whatwg.org/#utf-8-decoder
class CodePointsIterator {
    constructor(str) {
        this[BYTES] = str[BYTES];
        this.output = { value: -1, done: false };
        this.i = -1;
    }

    [Symbol.iterator]() {
        return this;
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

        this.output.value = -1;
        this.output.done = true;
        return bytesNeeded === 0 ? this.output : error('Invalid byte sequence');
    }
}

class Utf8String {
    constructor(str) {
        if (typeof str !== 'string') {
            this[BYTES] = [];
        } else {
            this[BYTES] = stringToUtf8Bytes(str);
        }
    }

    bytes() {
        return new BytesIterator(this);
    }

    codePoints() {
        return new CodePointsIterator(this);
    }

    [Symbol.iterator]() {
        return new CodePointsIterator(this);
    }
}

Utf8String.count = function (iterable) {
    if (iterable instanceof BytesIterator) {
        return iterable[UTF8STRING][BYTES].length;
    } else {
        let count = 0;
        while (!iterable.next().done) {
            ++count;
        }
        return count;
    }
};

module.exports = Utf8String;
