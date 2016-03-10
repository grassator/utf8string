'use strict';

const Utf8String = require('../lib/index');
const assert = require('assert');

describe('Iterator Utility Methods', function () {

    describe('count()', function () {

        it('should create a Utf8String with 0 bytes for the default constructor', function () {
            const str = new Utf8String();
            assert.equal(Utf8String.count(str.bytes()), 0);
        });

        it('should correctly count bytes for ASCII-only string', function () {
            const str = new Utf8String('abc');
            assert.equal(Utf8String.count(str.bytes()), 3);
        });

        it('should correctly count bytes for a BMP string', function () {
            const str = new Utf8String('ФЫВА');
            assert.equal(Utf8String.count(str.bytes()), 8);
        });

        it('should correctly count bytes for an Astral string', function () {
            const str = new Utf8String('\u{1F607}');
            assert.equal(Utf8String.count(str.bytes()), 4);
        });

    });

    describe('advance()', function () {

        it('should allow to advance an iterator by certain amount', function () {
            const str = new Utf8String('ФЫВА');
            const iterator = str.codePoints();
            Utf8String.advance(iterator, 2);
            assert.equal(String.fromCodePoint(iterator.current().value), 'Ы');
        });

        it('should allow to advance an iterator by 1 by default', function () {
            const str = new Utf8String('ФЫВА');
            const iterator = str.codePoints();
            Utf8String.advance(iterator);
            assert.equal(String.fromCodePoint(iterator.current().value), 'Ф');
            Utf8String.advance(iterator);
            assert.equal(String.fromCodePoint(iterator.current().value), 'Ы');
        });

    });

    describe('recede()', function () {

        it('should allow to recede an iterator by certain amount', function () {
            const str = new Utf8String('ФЫВА');
            const iterator = str.codePointsEnd();
            Utf8String.recede(iterator, 2);
            assert.equal(String.fromCodePoint(iterator.current().value), 'В');
        });

        it('should allow to recede an iterator by 1 by default', function () {
            const str = new Utf8String('ФЫВА');
            const iterator = str.codePointsEnd();
            Utf8String.recede(iterator);
            assert.equal(String.fromCodePoint(iterator.current().value), 'А');
            Utf8String.recede(iterator);
            assert.equal(String.fromCodePoint(iterator.current().value), 'В');
        });

    });

});
