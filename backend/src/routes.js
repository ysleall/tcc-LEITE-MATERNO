
import doacaoController from './controller/doacaoController.js';
import doadoraController from './controller/doadoraController.js';
import gestaoController from './controller/gestaoController.js';
import loginController from './controller/loginController.js';
import quizController from './controller/quizController.js';
import bancoController from './controller/bancoController.js';
import dashboardController from './controller/dashboardController.js';
import coletaController from './controller/coletaController.js';
import administradorController from './controller/administradorController.js';
export default function addRoutes(api) {
    api.use(doacaoController);
    api.use(administradorController);
    api.use(doadoraController);
    api.use(gestaoController);
    api.use(loginController);
    api.use(quizController);
    api.use(bancoController);
    api.use(dashboardController);
    api.use(coletaController);
}
