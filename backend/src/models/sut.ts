import mongoose from "mongoose";

const sutSchema = new mongoose.Schema({
  id: Number,
  tipSesije: String,        // 'utakmica' ili 'trening'
  utakmicaId: Number,       // popunjeno za utakmicu, 0 za trening
  treningId: Number,        // popunjeno za trening, 0 za utakmicu
  igracId: String,          // korisničko ime igrača
  klub: String,
  tip: String,              // '2FG' ili '3FG'
  pogodak: Boolean,         // true = pogodak, false = promašaj
  x: Number,                // 0-100 (procenat)
  y: Number,                // 0-100 (procenat)
  datum: String,
}, { versionKey: false });

export default mongoose.model('SutModel', sutSchema, 'sutevi');