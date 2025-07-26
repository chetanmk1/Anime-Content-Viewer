// tests/example.spec.js
test('Babel transforms ES6 correctly', () => {
  const message = `Hello, ${'World'}`;
  expect(message).toBe('Hello, World');
});
