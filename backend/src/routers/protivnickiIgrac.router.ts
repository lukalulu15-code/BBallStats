import express from 'express'
import { ProtivnickiIgracController } from '../controllers/protivnickiIgrac.controller';
import { authMiddleware } from '../middleware/auth.middleware';


const protivnickiIgracRouter = express.Router();
protivnickiIgracRouter.use(authMiddleware);


protivnickiIgracRouter.route('/addProtivnickiIgrac').post(
    (req,res)=> new ProtivnickiIgracController().addIgrac(req,res)
)
protivnickiIgracRouter.route('/getAllProtivnicki').get(
    (req,res)=> new ProtivnickiIgracController().getAllProtivnicki(req,res)
)
protivnickiIgracRouter.route('/deleteProtivnicki').post(
    (req,res)=> new ProtivnickiIgracController().deleteIgrac(req,res)
)
protivnickiIgracRouter.route('/getAllProtivnickiKlub').post(
    (req,res)=> new ProtivnickiIgracController().getAllProtivnickiKlub(req,res)
)
protivnickiIgracRouter.route('/getProtivnickiIgracKorisnickoIme').post(
    (req,res)=> new ProtivnickiIgracController().getProtivnickiIgracKorisnickoIme(req,res)
)

protivnickiIgracRouter.route('/updateProtivnickiIgracKorisnickoIme').post(
    (req,res)=> new ProtivnickiIgracController().updateProtivnickiIgracKorisnickoIme(req,res)
)

export default protivnickiIgracRouter