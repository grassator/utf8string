'use strict';

const Utf8String = require('../lib/index');
const assert = require('assert');

describe('BytesIterator', function () {

    it('should provide a way to iterate over bytes of the string', function () {
        const str = new Utf8String('abcЯзь');
        assert.deepStrictEqual(
            Array.from(str.bytes()),
            [0x61, 0x62, 0x63, 0xD0, 0xAF, 0xD0, 0xB7, 0xD1, 0x8C]
        );
    });

});


