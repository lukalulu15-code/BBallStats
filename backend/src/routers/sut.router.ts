import express from 'express'
import { SutController } from '../controllers/sut.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const sutRouter=express.Router();
sutRouter.use(authMiddleware);

sutRouter.route('/addSut').post(
  (req, res) => new SutController().addSut(req, res)
);
sutRouter.route('/getSuteviIgraca').post(
  (req, res) => new SutController().getSuteviIgraca(req, res)
);
sutRouter.route('/getSuteviUtakmica').post(
  (req, res) => new SutController().getSuteviUtakmica(req, res)
);
sutRouter.route('/getSuteviTrening').post(
  (req, res) => new SutController().getSuteviTrening(req, res)
);
sutRouter.route('/deleteSut').post(
  (req, res) => new SutController().deleteSut(req, res)
);
sutRouter.route('/getSuteviUtakmicaSvih').post(
  (req, res) => new SutController().getSuteviUtakmicaSvih(req, res)
);
sutRouter.route('/updateKorisnickoIme').post(
  (req, res) => new SutController().updateKorisnickoIme(req, res)
);

export default sutRouter