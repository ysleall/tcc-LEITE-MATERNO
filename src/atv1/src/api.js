import express from 'express';
import { addRoutes } from './routes.js';

const api = express();

api.use(express.json());

addRoutes(api);

const PORT = 3000;
api.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});