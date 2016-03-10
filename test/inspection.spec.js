'use strict';

const Utf8String = require('../lib/index');
const assert = require('assert');

describe('Utf8String Inspection Methods', function () {

    describe.only('find()', function () {

        it('should return null when the substring is not found', function () {
            const str = new Utf8String('фыва');
            const searchStr = new Utf8String('XX');
            assert.deepStrictEqual(str.find(searchStr), null);
        });

        it('should allow to find a position of one string in another', function () {
            const str = new Utf8String('фыва');
            const searchStr = new Utf8String('ыв');
            assert.deepStrictEqual(Utf8String.count(str.find(searchStr)), 3);
        });

        it('should allow to find a position of one string in another from a given position', function () {
            const str = new Utf8String('фывафыв');
            const searchStr = new Utf8String('ыв');
            const startIterator = Utf8String.advance(str.codePoints(), 2);
            assert.deepStrictEqual(Utf8String.count(str.find(searchStr, startIterator)), 2);
        });

        it('should allow to find repeating characters', function () {
            const str = new Utf8String('aaaabc');
            const searchStr = new Utf8String('aab');
            assert.deepStrictEqual(Utf8String.count(str.find(searchStr)), 4);
        });

        it('should throw if start position is not a CodePointsIterator', function () {
            const str = new Utf8String('фывафыв');
            const searchStr = new Utf8String('ыв');
            assert.throws(
                () => { str.find(searchStr, { clone() {} }); },
                Error
            );
        });

        it('should not modify start position iterator', function () {
            const str = new Utf8String('фывафыв');
            const searchStr = new Utf8String('ыв');
            const startIterator = Utf8String.advance(str.codePoints(), 2);
            assert.notStrictEqual(str.find(searchStr, startIterator), startIterator);
        });

        it('should work for decomposed characters', function () {
            // U+1E9B: LATIN SMALL LETTER LONG S WITH DOT ABOVE
            // U+0323: COMBINING DOT BELOW
            const str = new Utf8String('abc\u1E9B\u0323abc');

            // U+017F: LATIN SMALL LETTER LONG S
            // U+0323: COMBINING DOT BELOW
            // U+0307: COMBINING DOT ABOVE
            const searchStr = new Utf8String('\u017F\u0323\u0307');
            assert.deepStrictEqual(Utf8String.count(str.find(searchStr)), 5);
        });
    });

});


