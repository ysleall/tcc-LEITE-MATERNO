import { Router } from "express";   
const endpoints = Router();         

endpoints.get('/health', (req, resp) => {     

  resp.send({ 
    message: 'API está saudável' 
  })

})

export default endpoints;