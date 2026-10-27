import conquistaController from './controller/conquistaController.js';
import doacaoController from './controller/doacaoController.js';
import doadoraController from './controller/doadoraController.js';
import gestaoController from './controller/gestaoController.js';
import loginController from './controller/loginController.js';
import quizController from './controller/quizController.js';
import bancoController from './controller/bancoController.js';
import notificacaoController from './controller/notificacaoController.js';

export default function addRoutes(api) {
  api.use(conquistaController);
  api.use(doacaoController);
  api.use(doadoraController);
  api.use(gestaoController);
  api.use(loginController);
  api.use(quizController);
  api.use(bancoController);
  api.use(notificacaoController);
}