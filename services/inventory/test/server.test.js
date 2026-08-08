import test from 'node:test';
import assert from 'node:assert/strict';

test('inventory package metadata', () => {
  assert.equal(typeof 'inventory', 'string');
  assert.ok(3003 > 0);
});
