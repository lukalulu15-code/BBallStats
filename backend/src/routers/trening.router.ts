import express from 'express'
import { TreningController } from '../controllers/trening.controllet';
import { authMiddleware } from '../middleware/auth.middleware';
const treningRouter = express.Router();
treningRouter.use(authMiddleware);

treningRouter.route('/addTrening').post(
  (req, res) => new TreningController().addTrening(req, res)
);
treningRouter.route('/getTreninziIgraca').post(
  (req, res) => new TreningController().getTreninziIgraca(req, res)
);
treningRouter.route('/deleteTrening').post(
  (req, res) => new TreningController().deleteTrening(req, res)
);
treningRouter.route('/zavrsiTrening').post(
  (req, res) => new TreningController().zavrsiTrening(req, res)
);
treningRouter.route('/updateKorisnickoIme').post(
  (req, res) => new TreningController().updateKorisnickoIme(req, res)
);
treningRouter.route('/updateTrener').post(
  (req, res) => new TreningController().updateTrener(req, res)
);
export default treningRouter