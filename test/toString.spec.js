'use strict';

const Utf8String = require('../lib/index');
const assert = require('assert');

describe('toString', function () {

    it('should provide a way to convert to a native string', function () {
        const original = 'abcЯзь';
        const str = new Utf8String(original);
        assert.deepStrictEqual(str.toString(), original);
        assert.deepStrictEqual(String(str), original);
        assert.deepStrictEqual(str + 'foo', original + 'foo');
    });

});


