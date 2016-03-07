'use strict';

const Utf8String = require('../lib/index');
const assert = require('assert');

describe('count', function () {

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


