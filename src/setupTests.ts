import '@testing-library/jest-dom'

declare global {
  interface Window {
    import: {
      meta: {
        env: {
          VITE_FIREBASE_API_KEY: string;
          VITE_FIREBASE_AUTH_DOMAIN: string;
          VITE_FIREBASE_PROJECT_ID: string;
          VITE_FIREBASE_STORAGE_BUCKET: string;
          VITE_FIREBASE_MESSAGING_SENDER_ID: string;
          VITE_FIREBASE_APP_ID: string;
          VITE_FIREBASE_MEASUREMENT_ID: string;
        }
      }
    }
  }
}

// Mock Vite's import.meta.env
(window as any).import = {
  meta: {
    env: {
      VITE_FIREBASE_API_KEY: 'test-api-key',
      VITE_FIREBASE_AUTH_DOMAIN: 'test-auth-domain',
      VITE_FIREBASE_PROJECT_ID: 'test-project-id',
      VITE_FIREBASE_STORAGE_BUCKET: 'test-storage-bucket',
      VITE_FIREBASE_MESSAGING_SENDER_ID: 'test-sender-id',
      VITE_FIREBASE_APP_ID: 'test-app-id',
      VITE_FIREBASE_MEASUREMENT_ID: 'test-measurement-id'
    }
  }
}