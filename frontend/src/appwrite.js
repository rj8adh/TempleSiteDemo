import { Client, Account, Databases, OAuthProvider, Storage, Teams } from 'appwrite'
const client = new Client()

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
export const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const CART_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CART_COLLECTION_ID;
export const ORDER_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ORDER_COLLECTION_ID;
export const PRODUCT_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PRODUCT_COLLECTION_ID;
export const EVENT_COLLECTION_ID = import.meta.env.VITE_APPWRITE_EVENT_COLLECTION_ID;
export const ARTICLE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ARTICLE_COLLECTION_ID;
export const FAMILY_COLLECTION_ID = import.meta.env.VITE_APPWRITE_FAMILY_COLLECTION_ID;
export const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID;
export const APP_ORIGIN = (import.meta.env.VITE_APP_URL || window.location.origin).replace(/\/$/, "");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client)

export const teams = new Teams(client);

export { OAuthProvider };
export default client;
