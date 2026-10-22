import helth from './controllers/helthController.js';
import control from './controllers/controlController.js';
import user from './controllers/userController.js';

export default addrouters = (api) => {
  api.use('/helth', helth);
    api.use('/control', control);
    api.use('/user', user);
    
};

