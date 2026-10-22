import { Router } from "express";
const endpoints = Router();



endpoints.get('/boasvindas/:nome', (req, resp) => {
  let nome = req.params.nome;

  resp.send({
    message: `Seja bem-vinda/o  ${nome} !`
  })
})




export default endpoints;