import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {addRouter} from './routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(routes);
addRouter.use(api);
const PORT = process.env.PORT || 50100;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});