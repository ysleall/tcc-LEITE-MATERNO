
import doadoraController from './controller/doadoraController.js';
import loginController from './controller/loginController.js';
import quizController from './controller/quizController.js';
import doacaoController from './controller/doacaoController.js';
export function addRoutes(api) {
    api.use(doadoraController);
    api.use(loginController);
    api.use(quizController);
    api.use(doacaoController);
}
