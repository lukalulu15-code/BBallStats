import express from 'express'
import { UtakmicaDogadjajiController } from '../controllers/utakmicaDogadjaji.controller';
import { authMiddleware } from '../middleware/auth.middleware';


const utakmicaDogadjajiRouter = express.Router();
utakmicaDogadjajiRouter.use(authMiddleware);

utakmicaDogadjajiRouter.route('/addDogadjaj').post(
    (req,res)=> new UtakmicaDogadjajiController().addDogadjaj(req,res)
)
utakmicaDogadjajiRouter.route('/deleteDogadjaj').post(
    (req,res)=> new UtakmicaDogadjajiController().deleteDogadjaj(req,res)
)
utakmicaDogadjajiRouter.route('/getAllDogadjajiCetvrtina').post(
    (req,res)=> new UtakmicaDogadjajiController().getAllDogadjajiCetvrtina(req,res)
)
utakmicaDogadjajiRouter.route('/getAllDogadjajiProduzeci').post(
    (req,res)=> new UtakmicaDogadjajiController().getAllDogadjajiProduzeci(req,res)
)
utakmicaDogadjajiRouter.route('/getAllDogadjaji').post(
    (req,res)=> new UtakmicaDogadjajiController().getAllDogadjaji(req,res)
)
utakmicaDogadjajiRouter.route('/updateKorisnickoIme').post(
    (req,res)=> new UtakmicaDogadjajiController().updateKorisnickoIme(req,res)
)
utakmicaDogadjajiRouter.route('/updateIgracIme').post(
    (req,res)=> new UtakmicaDogadjajiController().updateIgracIme(req,res)
)
utakmicaDogadjajiRouter.route('/updateIgracPrezime').post(
    (req,res)=> new UtakmicaDogadjajiController().updateIgracPrezime(req,res)
)

export default utakmicaDogadjajiRouter