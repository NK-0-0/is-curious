// export const client = createClient({
//   projectId: "r8f29mht",
//   dataset: "production",
//   apiVersion: "2024-01-01",
//   useCdn: false,
// });

// sanity/client.ts
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'r8f29mht', // Replace with your project ID
  dataset: 'production', // or your dataset name
  useCdn: false, // Set to false for development to avoid caching issues
  apiVersion: '2024-01-01', // Use current date or your preferred API version

  // CORS and authentication settings
  token: process.env['SANITY_TOKEN'] || '', // Optional: for write operations

  // Additional CORS settings
  withCredentials: false,

  // Request configuration
  requestTagPrefix: 'sanity',

  // Timeout settings
  timeout: 30000, // 30 seconds
});

// Alternative client for server-side operations (if needed)
export const serverClient = createClient({
  projectId: 'your-project-id',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env['SANITY_TOKEN'], // Server-side token
  ignoreBrowserTokenWarning: true,
});

// Client configuration for production
export const cdnClient = createClient({
  projectId: 'your-project-id',
  dataset: 'production',
  useCdn: true, // Use CDN for production
  apiVersion: '2024-01-01',
  withCredentials: false,
});

// Use appropriate client based on environment
export const sanityClient =
  process.env['NODE_ENV'] === 'production' ? cdnClient : client;
