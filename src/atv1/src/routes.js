import { Router } from 'express';
import health from './controller/helthController.js';     
import welcome from './controller/welcomeController.js';   
import calculus from './controller/controlController.js';

const routes = Router();

export function addRoutes(api) {   
  api.use(health);           
  api.use(welcome);          
  api.use(calculus);         
}

export default routes;