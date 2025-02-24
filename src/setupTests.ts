declare global {
  var importMeta: {
    meta: {
      env: {
        VITE_PEXELS_API_KEY: string;
      };
    };
  };
}

import '@testing-library/jest-dom';

// Mock import.meta.env
const env = {
  VITE_PEXELS_API_KEY: 'test-api-key'
};

if (typeof global.importMeta === 'undefined') {
  global.importMeta = { meta: { env } };
}

// Make it available as import.meta.env
(global as any).import = global.importMeta;

export {};
