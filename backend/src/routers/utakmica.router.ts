import express from 'express'
import { UtakmicController } from '../controllers/utakmica.controller';
import { authMiddleware } from '../middleware/auth.middleware';


const utakmicaRouter = express.Router();
utakmicaRouter.use(authMiddleware);


utakmicaRouter.route('/getAllUtakmice').post(
    (req,res)=> new UtakmicController().getAllUtakmice(req,res)
)
utakmicaRouter.route('/getAllUtakmiceZavrsene').post(
    (req,res)=> new UtakmicController().getAllUtakmiceZavrsene(req,res)
)
utakmicaRouter.route('/getDateSortedAllUtakmice').post(
    (req,res)=> new UtakmicController().getDateSortedAllUtakmice(req,res)
)
utakmicaRouter.route('/addUtakmica').post(
    (req,res)=> new UtakmicController().addUtakmica(req,res)
)
utakmicaRouter.route('/getUtakmica').post(
    (req,res)=> new UtakmicController().getUtakmica(req,res)
)
utakmicaRouter.route('/updatePoeniUtakmicaDomacin').post(
    (req,res)=> new UtakmicController().updatePoeniUtakmicaDomacin(req,res)
)
utakmicaRouter.route('/updatePoeniUtakmicaGost').post(
    (req,res)=> new UtakmicController().updatePoeniUtakmicaGost(req,res)
)
utakmicaRouter.route('/updateTajmer').post(
  (req, res) => new UtakmicController().updateTajmer(req,res)
);
utakmicaRouter.route('/zavrsiUtakmicu').post(
  (req, res) => new UtakmicController().zavrsiUtakmicu(req,res)
);
utakmicaRouter.route('/setStatus').post(
  (req, res) => new UtakmicController().setStatus(req,res)
);
utakmicaRouter.route('/updateTrener').post(
  (req, res) => new UtakmicController().updateTrener(req, res)
);
utakmicaRouter.route('/deleteUtakmica').post(
  (req, res) => new UtakmicController().deleteUtakmica(req, res)
);
utakmicaRouter.route('/getUtakmiceSezone').post(
  (req, res) => new UtakmicController().getUtakmiceSezone(req, res)
);
utakmicaRouter.route('/getSezoneTrenera').post(
  (req, res) => new UtakmicController().getSezoneTrenera(req, res)
);

export default utakmicaRouter