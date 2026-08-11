import express from 'express'
import {StatistikaIgracaController} from '../controllers/statistikaIgraca.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const statistikaIgracaRouter = express.Router();
statistikaIgracaRouter.use(authMiddleware);

statistikaIgracaRouter.route('/addIgracStatistika').post(
    (req,res)=> new StatistikaIgracaController().addIgracStatistika(req,res)
)
statistikaIgracaRouter.route('/getIgraciKlubUtakmica').post(
    (req,res)=> new StatistikaIgracaController().getIgraciKlubUtakmica(req,res)
)
statistikaIgracaRouter.route('/deleteIgracUtakmica').post(
    (req,res)=> new StatistikaIgracaController().deleteIgracUtakmica(req,res)
)
statistikaIgracaRouter.route('/getIgracUtakmica').post(
    (req,res)=> new StatistikaIgracaController().getIgracUtakmica(req,res)
)
statistikaIgracaRouter.route('/getIgracStatistika').post(
    (req,res)=> new StatistikaIgracaController().getIgracStatistika(req,res)
)
statistikaIgracaRouter.route('/updateIgracStatistika').post(
    (req,res)=> new StatistikaIgracaController().updateIgracStatistika(req,res)
)
statistikaIgracaRouter.route('/updateIgracTeren').post(
    (req,res)=> new StatistikaIgracaController().updateIgracTeren(req,res)
)
statistikaIgracaRouter.route('/updateIgracStarter').post(
    (req,res)=> new StatistikaIgracaController().updateIgracStarter(req,res)
)
statistikaIgracaRouter.route('/getIgraciKlubUtakmicaTeren').post(
    (req,res)=> new StatistikaIgracaController().getIgraciKlubUtakmicaTeren(req,res)
)
statistikaIgracaRouter.route('/getIgraciKlubUtakmicaKlupa').post(
    (req,res)=> new StatistikaIgracaController().getIgraciKlubUtakmicaKlupa(req,res)
)
statistikaIgracaRouter.route('/updateIgracMinuti').post(
    (req,res)=> new StatistikaIgracaController().updateIgracMinuti(req,res)
)
statistikaIgracaRouter.route('/updateIgracPlusMinus').post(
    (req,res)=> new StatistikaIgracaController().updateIgracPlusMinus(req,res)
)
statistikaIgracaRouter.route('/updateIgracIme').post(
    (req,res)=> new StatistikaIgracaController().updateIgracIme(req,res)
)
statistikaIgracaRouter.route('/updateIgracPrezime').post(
    (req,res)=> new StatistikaIgracaController().updateIgracPrezime(req,res)
)
statistikaIgracaRouter.route('/updateKorisnickoIme').post(
    (req,res)=> new StatistikaIgracaController().updateKorisnickoIme(req,res)
)

export default statistikaIgracaRouter