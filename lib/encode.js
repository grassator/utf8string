'use strict';

function encodeCodePointIntoBuffer(codePoint, buffer) {
    // Adopted from encodeCodePointIntoBuffer spec
    // https://encoding.spec.whatwg.org/#utf-8-encoder
    if (codePoint >= 0 && codePoint <= 0x007F) {
        buffer.push(codePoint);
        return;
    }

    let count = 0;
    let offset = 0;
    if (codePoint >= 0x80 && codePoint <= 0x07FF) {
        count = 1;
        offset = 0xC0;
    } else if (codePoint >= 0x0800 && codePoint <= 0xFFFF) {
        count = 2;
        offset = 0xE0;
    } else if (codePoint >= 0x10000 && codePoint <= 0x10FFFF) {
        count = 3;
        offset = 0xF0;
    }

    buffer.push((codePoint >> (6 * count)) + offset);

    while (count > 0) {
        const temp = codePoint >> (6 * (--count));
        buffer.push(0x80 | (temp & 0x3F));
    }
}

function stringToUtf8Bytes(str) {
    const buffer = [];
    const length = str.length;
    let i = -1;
    let codePoint = 0;
    let secondCodePoint;

    while (++i < length) {
        // Getting full code point, based on
        // https://mths.be/codepointat v0.2.0 by @mathias
        codePoint = str.charCodeAt(i);
        if (codePoint >= 0xD800 && codePoint <= 0xDBFF) {
            secondCodePoint = str.charCodeAt(++i);
            if (secondCodePoint >= 0xDC00 && secondCodePoint <= 0xDFFF) {
                // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                codePoint = (codePoint - 0xD800) * 0x400 + secondCodePoint - 0xDC00 + 0x10000;
            }
        }

        encodeCodePointIntoBuffer(codePoint, buffer);

    }

    return buffer;
}

exports.stringToUtf8Bytes = stringToUtf8Bytes;
exports.encodeCodePointIntoBuffer = encodeCodePointIntoBuffer;
