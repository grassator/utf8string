'use strict';

const Utf8String = require('../lib/index');
const assert = require('assert');

describe('Utf8String factory methods', function () {

    describe('fromCodePoints', function () {

        it('should create a correct string for zero code points', function () {
            const str = Utf8String.fromCodePoints();
            assert.deepStrictEqual(Array.from(str.bytes()), []);
        });

        it('should create a correct string for multiple code points', function () {
            const str = Utf8String.fromCodePoints(0x42F, 0x1F607, 0x42F);
            assert.deepStrictEqual(
                Array.from(str.bytes()),
                [0xD0, 0xAF, 0xF0, 0x9F, 0x98, 0x87, 0xD0, 0xAF]
            );
        });

        it('should throw when provided with a wrong input', function () {
            assert.throws(
                () => { Utf8String.fromCodePoints(-1); },
                RangeError
            );
            assert.throws(
                () => { Utf8String.fromCodePoints(0xffffff); },
                RangeError
            );
            assert.throws(
                () => { Utf8String.fromCodePoints(NaN); },
                RangeError
            );
            assert.throws(
                () => { Utf8String.fromCodePoints('foo'); },
                RangeError
            );
        });

    });

});


