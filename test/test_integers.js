/**
 * (c) 2020 Libelf.JS
 * Tests for src/libelf-integers.js
 */

var assert = require('assert');
var { ElfUInt64 } = require('../src/libelf-integers.js');

describe('ElfUInt64', () => {
    describe('#constructor', () => {
        var t = new ElfUInt64([0x55667788, 0x11223344]);
        assert.strictEqual(t.hex(), '0x1122334455667788');
    });
});
