import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import routes, { addRoutes } from './routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

addRoutes(app);


const PORT = process.env.PORT || 50100;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});