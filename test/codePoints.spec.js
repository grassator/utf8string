'use strict';

const Utf8String = require('../lib/index');
const assert = require('assert');

describe('CodePointsIterator', function () {

    it('should provide a way to iterate over code points of the string', function () {
        const str = new Utf8String('a\u{1F607}Я');
        assert.deepStrictEqual(
            Array.from(str.codePoints()),
            [0x61, 0x1f607, 0x42F]
        );
    });

    it('should provide a way to iterate backwards over code points of the string', function () {
        const str = new Utf8String('a\u{1F607}Я');
        const result = [];
        const iter = str.codePointsEnd();
        let index;
        while ((index = iter.previous()) && (index.value !== Utf8String.START || index.done !== false)) {
            result.unshift(index.value);
        }
        assert.deepStrictEqual(
            result,
            [0x61, 0x1f607, 0x42F]
        );
    });

    it('should provide a way to clone an iterator keeping the position', function () {
        const str = new Utf8String('abcЯзь');
        const iter = str.codePoints();
        iter.next();
        const clonedIter = iter.clone();
        assert.deepStrictEqual(iter.current(), clonedIter.current());
    });

});


