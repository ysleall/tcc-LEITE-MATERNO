
import doadoraController from '../../backend/src/controller/doadoraController.js';
import loginController from '../../backend/src/controller/loginController.js';
import quizController from '../../backend/src/controller/quizController.js';
import doacaoController from '../../backend/src/controller/doacaoController.js';
import conquistaController from '../../backend/src/controller/conquistaController.js';
import gestaoController from '../../backend/src/controller/gestaoController.js' ;
export function addRoutes(api) {
    api.use(doadoraController);
    api.use(loginController);
    api.use(quizController);
    api.use(doacaoController);
    api.use(conquistaController);
     api.use(gestaoController);
}

