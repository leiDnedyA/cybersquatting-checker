const { parseDomain } = require('../src/utils');

test('Gets domain from any valid URL string or domain', () => {
  expect(parseDomain('google.com')).toBe('google.com');
  expect(parseDomain('www.google.com')).toBe('google.com');
  expect(parseDomain('https://google.com')).toBe('google.com');
  expect(parseDomain('https://www.google.com')).toBe('google.com');
});
