
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { addRoutes } from './routes.js';

const api = express();

api.use(cors());
api.use(express.json());

addRoutes(api);

api.get('/', (req, res) => {
    res.send({
        mensagem: 'API do sistema de doação de leite materno funcionando!'
    });
});

const port = process.env.PORT || 3000;

api.listen(port, () => {
    console.log(`API iniciada na porta ${port}`);
});
