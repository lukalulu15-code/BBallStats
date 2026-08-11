import express from 'express'
import {TrenerController} from '../controllers/trener.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const trenerRouter = express.Router();

// javne rute (bez prijave)
trenerRouter.route('/login').post(
    (req,res)=> new TrenerController().login(req,res)
)

trenerRouter.route('/register').post(
    (req,res)=> new TrenerController().register(req,res)
)
trenerRouter.route('/getAllTreneri').get(
    (req,res)=> new TrenerController().getAllTreneri(req,res)
)
trenerRouter.route('/zaboravioLozinku').post(
  (req, res) => new TrenerController().zaboravioLozinku(req, res)
);

trenerRouter.route('/resetLozinka').post(
  (req, res) => new TrenerController().resetLozinka(req, res)
);

// od ovde nadalje - samo prijavljeni korisnici
trenerRouter.use(authMiddleware);

trenerRouter.route('/getTrenerKorisnickoIme').post(
    (req,res)=> new TrenerController().getTrenerKorisnickoIme(req,res)
)

trenerRouter.route('/updateTrenerIme').post(
  (req, res) => new TrenerController().updateTrenerIme(req, res)
);

trenerRouter.route('/updateTrenerPrezime').post(
  (req, res) => new TrenerController().updateTrenerPrezime(req, res)
);

trenerRouter.route('/updateTrenerMejl').post(
  (req, res) => new TrenerController().updateTrenerMejl(req, res)
);

trenerRouter.route('/updateTrenerSlika').post(
  (req, res) => new TrenerController().updateTrenerSlika(req, res)
);

trenerRouter.route('/updateTrenerTelefon').post(
  (req, res) => new TrenerController().updateTrenerTelefon(req, res)
);

trenerRouter.route('/updateKorisnickoIme').post(
  (req, res) => new TrenerController().updateKorisnickoIme(req, res)
);

trenerRouter.route('/updateTrenerLozinka').post(
  (req, res) => new TrenerController().updateTrenerLozinka(req, res)
);

export default trenerRouter
