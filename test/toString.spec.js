'use strict';

const Utf8String = require('../lib/index');
const assert = require('assert');

describe('toString', function () {

    it('should provide a way to iterate over bytes of the string', function () {
        const original = 'abcЯзь';
        const str = new Utf8String(original);
        assert.deepStrictEqual(str.toString(), original);
        assert.deepStrictEqual(String(str), original);
        assert.deepStrictEqual(str + 'foo', original + 'foo');
    });

});


