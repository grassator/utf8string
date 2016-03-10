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

    it('should provide a way to iterate backwards over the bytes of the string', function () {
        const str = new Utf8String('abcЯзь');
        const result = [];
        const iter = str.bytesEnd();
        let index;
        while ((index = iter.previous()) && (index.value !== Utf8String.START || index.done !== false)) {
            result.unshift(index.value);
        }
        assert.deepStrictEqual(
            result,
            [0x61, 0x62, 0x63, 0xD0, 0xAF, 0xD0, 0xB7, 0xD1, 0x8C]
        );
    });

    it('should provide a way to clone an iterator keeping the position', function () {
        const str = new Utf8String('abcЯзь');
        const iter = str.bytes();
        iter.next();
        const clonedIter = iter.clone();
        assert.deepStrictEqual(iter.current(), clonedIter.current());
    });

});


