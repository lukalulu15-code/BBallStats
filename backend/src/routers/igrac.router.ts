import express from 'express'
import{IgracController} from '../controllers/igrac.controller'
import { authMiddleware } from '../middleware/auth.middleware';

const igracRouter = express.Router();

// javne rute (bez prijave)
igracRouter.route('/login').post(
    (req,res)=> new IgracController().login(req,res)
)
igracRouter.route('/getAllIgraci').get(
    (req,res)=> new IgracController().getAllIgraci(req,res)
)
igracRouter.route('/zaboravioLozinku').post(
  (req, res) => new IgracController().zaboravioLozinku(req, res)
);

igracRouter.route('/resetLozinka').post(
  (req, res) => new IgracController().resetLozinka(req, res)
);

// od ovde nadalje - samo prijavljeni korisnici
igracRouter.use(authMiddleware);

igracRouter.route('/getIgracKorisnickoIme').post(
    (req,res)=> new IgracController().getIgracKorisnickoIme(req,res)
)
igracRouter.route('/updateIgracIme').post(
    (req,res)=> new IgracController().updateIgracIme(req,res)
)
igracRouter.route('/updateIgracPrezime').post(
    (req,res)=> new IgracController().updateIgracPrezime(req,res)
)
igracRouter.route('/updateIgracMejl').post(
    (req,res)=> new IgracController().updateIgracMejl(req,res)
)
igracRouter.route('/updateIgracSlika').post(
    (req,res)=> new IgracController().updateIgracSlika(req,res)
)
igracRouter.route('/updateKorisnickoIme').post(
    (req,res)=> new IgracController().updateKorisnickoIme(req,res)
)
igracRouter.route('/updateIgracKorisnickoIme').post(
    (req,res)=> new IgracController().updateIgracKorisnickoIme(req,res)
)
igracRouter.route('/updateIgracLozinka').post(
    (req,res)=> new IgracController().updateIgracLozinka(req,res)
)

igracRouter.route('/addIgrac').post(
    (req,res)=> new IgracController().addIgrac(req,res)
)
igracRouter.route('/getAllIgraciTrenera').post(
    (req,res)=> new IgracController().getAllIgraciTrenera(req,res)
)
igracRouter.route('/deleteIgrac').post(
    (req,res)=> new IgracController().deleteIgrac(req,res)
)
igracRouter.route('/updateTrener').post(
  (req, res) => new IgracController().updateTrener(req, res)
);
export default igracRouter
