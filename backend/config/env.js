import { config } from 'dotenv';

config({ path: `.env` });

export const {
    PORT, NODE_ENV, API_URL,
    CLIENT_URL,
    MONGO_URI,
    JWT_SECRET, JWT_EXPIRES_IN,
    MAILTRAP_TOKEN, MAILTRAP_SENDER_EMAIL
} = process.env;