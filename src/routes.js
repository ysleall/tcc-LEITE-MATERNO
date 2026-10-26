
import doadoraController from './controller/doadoraController.js';
import loginController from './controller/loginController.js';
import quizController from './controller/quizController.js';
import doacaoController from './controller/doacaoController.js';
import conquistaController from './controller/conquistaController.js';
import gestaoController from './controller/gestaoController.js' ;
export function addRoutes(api) {
    api.use(doadoraController);
    api.use(loginController);
    api.use(quizController);
    api.use(doacaoController);
    api.use(conquistaController);
     api.use(gestaoController);
}

