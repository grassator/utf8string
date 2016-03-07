'use strict';

const Utf8String = require('../lib/index');
const assert = require('assert');

describe('CodePointsIterator', function () {

    it('should provide a way to iterate over bytes of the string', function () {
        const str = new Utf8String('a\u{1F607}Я');
        assert.deepStrictEqual(
            Array.from(str.codePoints()),
            [0x61, 0x1f607, 0x42F]
        );
    });

});


