import test from 'node:test';
import assert from 'node:assert/strict';

test('gateway package metadata', () => {
  assert.equal(typeof 'gateway', 'string');
  assert.ok(3000 > 0);
});
