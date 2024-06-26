import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import {createConnectionDB} from './config/database.config';
import router from './api/routers/router';
import dotenv from 'dotenv'

dotenv.config()

const app = express();

app.use(cors(
    {
        credentials: true
    }
));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

createConnectionDB();

app.use('/', router);