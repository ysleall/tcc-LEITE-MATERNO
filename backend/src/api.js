import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import addRoutes from './routes.js';

const api = express();

api.use(cors());
api.use(express.json());

addRoutes(api);

const port = process.env.PORT || 2027;

api.listen(port, () => {
    console.log(`API iniciada na porta ${port}`);
});

export default api;