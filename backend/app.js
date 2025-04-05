import cors from 'cors';
import path from 'path';
import express from 'express';
const app = express();

import { CLIENT_URL, NODE_ENV, PORT } from './config/env.js';
import authRouter from './routes/auth.router.js';
import connectToDatabase from './database/mongoose.js';
import cookieParser from 'cookie-parser';

app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/auth', authRouter);


const __dirname = path.resolve();
if (NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Authify Backend running on http://localhost:${PORT}`);
    connectToDatabase();
});

export default app;