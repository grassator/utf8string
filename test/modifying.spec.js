'use strict';

const Utf8String = require('../lib/index');
const assert = require('assert');

describe('Modification', function () {

    describe('append', function () {

        it('should work for non-empty strings', function () {
            const a = 'abc';
            const b = 'Язь';
            const aUtf8 = new Utf8String(a);
            const bUtf8 = new Utf8String(b);
            assert.deepStrictEqual(String(aUtf8.append(bUtf8)), a + b);
        });

        it('should work for empty strings', function () {
            const nonEmptyOriginal = 'abc';
            const nonEmptyUtf8 = new Utf8String(nonEmptyOriginal);
            assert.deepStrictEqual(String(nonEmptyUtf8.append(new Utf8String())), nonEmptyOriginal);
            assert.deepStrictEqual(String(new Utf8String().append(nonEmptyUtf8)), nonEmptyOriginal);
        });

    });

    describe('prepend', function () {

        it('should work for non-empty strings', function () {
            const a = 'abc';
            const b = 'Язь';
            const aUtf8 = new Utf8String(a);
            const bUtf8 = new Utf8String(b);
            assert.deepStrictEqual(String(aUtf8.prepend(bUtf8)), b + a);
        });

        it('should work for empty strings', function () {
            const nonEmptyOriginal = 'abc';
            const nonEmptyUtf8 = new Utf8String(nonEmptyOriginal);
            assert.deepStrictEqual(String(nonEmptyUtf8.prepend(new Utf8String())), nonEmptyOriginal);
            assert.deepStrictEqual(String(new Utf8String().prepend(nonEmptyUtf8)), nonEmptyOriginal);
        });

    });

    describe('substring', function () {

        it('should clone a string when called without any arguments', function () {
            const str = new Utf8String('Язь');
            assert.deepStrictEqual(String(str.substring()), 'Язь');
        });

        it('should clone to the end of the string when given only one iterator', function () {
            const str = new Utf8String('Язь');
            const iter = str.codePoints();
            iter.next();
            assert.deepStrictEqual(String(str.substring(iter)), 'зь');
            iter.next();
            assert.deepStrictEqual(String(str.substring(iter)), 'ь');
            iter.next();
            assert.deepStrictEqual(String(str.substring(iter)), '');
        });

        it('should work with start and end iterators', function () {
            const str = new Utf8String('Язь');
            const startIter = str.codePoints();
            const endIter = Utf8String.advance(startIter.clone(), 2);
            assert.deepStrictEqual(
                String(str.substring(startIter, endIter)),
                'Яз'
            );
            startIter.next();
            endIter.next();
            assert.deepStrictEqual(
                String(str.substring(startIter, endIter)),
                'зь'
            );
        });

        it('should throw when called not with a CodePointsIterator', function () {
            const str = new Utf8String('Язь');
            assert.throws(() => str.substring('foo'), RangeError);
            assert.throws(() => str.substring(str.codePoints(), 'foo'), RangeError);
        });

        it('should throw when the end iterator is before the start one', function () {
            const str = new Utf8String('Язь');
            const startIter = str.codePoints();
            const endIter = str.codePoints();
            startIter.next();
            assert.throws(() => str.substring(startIter, endIter), RangeError);
        });

    });

});


