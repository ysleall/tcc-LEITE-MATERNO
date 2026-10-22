import health from '../src/controller/healthController.js'     
import welcome from '../src/controller/welcomeController.js'   
import calculus from '../src/controller/calculusController.js' 

export function addRoutes(api) {   
  api.use(health);           
  api.use(welcome);          
  api.use(calculus);         
}