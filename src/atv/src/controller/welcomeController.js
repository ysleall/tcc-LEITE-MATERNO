import  {Router} from "express";
const endpoints = Router();

endpoints.get("/boas-vindas:<name>", (req, res) => {
  res.status(200).json({ message: `Boas-vindas, ${req.params.name}!` });
  let name = req.params.name;
});

export default endpoints;