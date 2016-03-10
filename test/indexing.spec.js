'use strict';

const Utf8String = require('../lib/index');
const assert = require('assert');

describe('Indexing', function () {

    describe('single code point', function () {

        it('should return Utf8String.START as value for the iterator staying at the beginning', function () {
            const str = new Utf8String('abc');
            assert.deepStrictEqual(str.codePoints().current(), {
                value: Utf8String.START,
                done: false
            });
        });

        it('should correct codePoints for advanced iterator before the end of the string', function () {
            const str = new Utf8String('abc');
            const iter = str.codePoints();
            iter.next();
            assert.deepStrictEqual(iter.current(), {
                value: 'a'.codePointAt(0),
                done: false
            });
            iter.next();
            assert.deepStrictEqual(iter.current(), {
                value: 'b'.codePointAt(0),
                done: false
            });
        });

        it('should report iterator as done when at the end', function () {
            const str = new Utf8String('a');
            const iter = str.codePoints();
            iter.next();
            iter.next();
            assert.deepStrictEqual(iter.current(), {
                value: Utf8String.END,
                done: true
            });
            const endIter = str.codePointsEnd();
            assert.deepStrictEqual(endIter.current(), {
                value: Utf8String.END,
                done: true
            });
        });

    });

    describe('single byte', function () {

        it('should return Utf8String.START as value for the iterator staying at the beginning', function () {
            const str = new Utf8String('abc');
            assert.deepStrictEqual(str.bytes().current(), {
                value: Utf8String.START,
                done: false
            });
        });

        it('should correct codePoints for advanced iterator before the end of the string', function () {
            const str = new Utf8String('abc');
            const iter = str.bytes();
            iter.next();
            assert.deepStrictEqual(iter.current(), {
                value: 'a'.codePointAt(0),
                done: false
            });
            iter.next();
            assert.deepStrictEqual(iter.current(), {
                value: 'b'.codePointAt(0),
                done: false
            });
        });

        it('should report iterator as done when at the end', function () {
            const str = new Utf8String('a');
            const iter = str.bytes();
            iter.next();
            iter.next();
            assert.deepStrictEqual(iter.current(), {
                value: Utf8String.END,
                done: true
            });
            const endIter = str.bytesEnd();
            assert.deepStrictEqual(endIter.current(), {
                value: Utf8String.END,
                done: true
            });
        });

    });

});


