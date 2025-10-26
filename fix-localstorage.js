// Polyfill to fix Node.js's broken localStorage during SSR
if (typeof global !== 'undefined' && typeof global.localStorage !== 'undefined') {
  // If Node.js has polyfilled localStorage incorrectly, override it
  const brokenLS = global.localStorage;
  if (brokenLS && typeof brokenLS.getItem !== 'function') {
    // Replace with a no-op implementation
    global.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    };
  }
}

module.exports = {};
