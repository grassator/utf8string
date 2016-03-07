'use strict';

const stringToUtf8Bytes = require('../lib/stringToUtf8Bytes');
const assert = require('assert');

describe('stringToUtf8Bytes', function () {

    it('should convert empty string to an empty array', function () {
        assert.deepStrictEqual(
            stringToUtf8Bytes(''),
            []
        );
    });

    it('should correctly handle BMP code points', function () {
        assert.deepStrictEqual(
            stringToUtf8Bytes('abcЯзь'),
            [0x61, 0x62, 0x63, 0xD0, 0xAF, 0xD0, 0xB7, 0xD1, 0x8C]
        );
    });

    it('should correctly handle Astral plane code points', function () {
        assert.deepStrictEqual(
            stringToUtf8Bytes('\u2708\uFE0E\u2708\uFE0E'),
            [0xE2, 0x9C, 0x88, 0xEF, 0xB8, 0x8E, 0xE2, 0x9C, 0x88, 0xEF, 0xB8, 0x8E]
        );
    });

});


