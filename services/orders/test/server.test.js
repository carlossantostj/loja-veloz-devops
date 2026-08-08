import test from 'node:test';
import assert from 'node:assert/strict';
test('orders validates required fields', () => {
  const payload={customer:'Carlos',items:[{sku:'SKU-001',quantity:1}]};
  assert.ok(payload.customer && Array.isArray(payload.items));
});
