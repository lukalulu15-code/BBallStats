import express from 'express'
import { IzvestajController } from '../controllers/izvestaj.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const izvestajRouter = express.Router();
izvestajRouter.use(authMiddleware);

izvestajRouter.route('/dodajIzvestaj').post(
    (req, res) => new IzvestajController().dodajIzvestaj(req, res)
)
izvestajRouter.route('/getIzvestajiIgraca').post(
    (req, res) => new IzvestajController().getIzvestajiIgraca(req, res)
)
izvestajRouter.route('/obrisiIzvestaj').post(
    (req, res) => new IzvestajController().obrisiIzvestaj(req, res)
)
izvestajRouter.route('/procitaoIzvestaj').post(
  (req, res) => new IzvestajController().procitaoIzvestaj(req, res)
);

export default izvestajRouter