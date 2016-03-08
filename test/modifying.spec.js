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

});


