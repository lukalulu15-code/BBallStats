import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import trenerRouter from './routers/trener.router'
import igracRouter from './routers/igrac.router'
import defaultSlikaRouter from './routers/defaultSlika.router'
import utakmicaRouter from './routers/utakmica.router'
import protivnickiIgracRouter from './routers/protivnickiIgrac.router'
import statistikaIgracaRouter from './routers/statistikaIgraca.router'
import utakmicaDogadjajiRouter from './routers/utakmicaDogadjaji.router'
import izvestajRouter from './routers/izvestajRouter';
import treningRouter from './routers/trening.router';
import sutRouter from './routers/sut.router';

const app = express()
app.use(cors())
app.use(express.json())
//Povezivanje na bazu podataka
mongoose.connect('mongodb://localhost:27017/BBallStats')
const conn = mongoose.connection
conn.once('open',()=>{
    console.log("DB ok")
})

const router = express.Router()
router.use("/treneri", trenerRouter)
router.use("/igraci", igracRouter)
router.use('/defaultSlika',defaultSlikaRouter)
router.use('/utakmice',utakmicaRouter)
router.use('/protivnickiIgraci',protivnickiIgracRouter)
router.use('/statistikaIgraca',statistikaIgracaRouter)
router.use('/utakmicaDogadjaji',utakmicaDogadjajiRouter)
router.use('/izvestaji', izvestajRouter)
router.use('/treninzi',treningRouter)
router.use('/sutevi',sutRouter)

app.use("/", router)
app.listen(4000, ()=>console.log("Express running on port 4000!"))