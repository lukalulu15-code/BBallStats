import express from 'express';
import TreningModel from "../models/trening";
import IgracModel from "../models/igrac";

export class TreningController {

  addTrening = (req: express.Request, res: express.Response) => {
    let prijavljen = (req as any).user;
    let igracIdC = req.body.igracId;
    IgracModel.findOne({ korisnickoIme: igracIdC }).then((igrac) => {
      if (!igrac || igrac.trener !== prijavljen.korisnickoIme) {
        res.json({ message: 'nemaDozvolu' });
        return;
      }
      TreningModel.findOne().sort({ id: -1 }).then((poslednji) => {
        let noviId = poslednji ? poslednji.id + 1 : 1;
        let trening = new TreningModel({
          id: noviId,
          trenerId: prijavljen.korisnickoIme,
          igracId: igracIdC,
          klub: req.body.klub,
          datum: req.body.datum,
          opis: req.body.opis,
          uToku:true
        });
        trening.save().then((ok) => {
          res.json({ message: 'ok', id: noviId });   // vrati id novog treninga
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  // treninzi jednog igrača
  getTreninziIgraca = (req: express.Request, res: express.Response) => {
    let igracIdC = req.body.igracId;
    let prijavljen = (req as any).user;
    if (prijavljen.korisnickoIme === igracIdC) {
      TreningModel.find({ igracId: igracIdC }).sort({ id: -1 }).then((treninzi) => {
        res.json(treninzi);
      }).catch((err) => {
        console.log(err);
      });
      return;
    }
    IgracModel.findOne({ korisnickoIme: igracIdC }).then((igrac) => {
      if (!igrac || igrac.trener !== prijavljen.korisnickoIme) {
        res.json([]);
        return;
      }
      TreningModel.find({ igracId: igracIdC }).sort({ id: -1 }).then((treninzi) => {
        res.json(treninzi);
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  deleteTrening = (req: express.Request, res: express.Response) => {
    let prijavljen = (req as any).user;
    TreningModel.deleteOne({ id: req.body.id, trenerId: prijavljen.korisnickoIme }).then((ok) => {
      res.json({ message: 'ok' });
    }).catch((err) => {
      console.log(err);
    });
  }
  zavrsiTrening = (req: express.Request, res: express.Response) => {
    let prijavljen = (req as any).user;
    TreningModel.updateOne(
      { id: req.body.id, trenerId: prijavljen.korisnickoIme },
      { $set: { uToku: false } },
    ).then((ok) => {
      res.json({ message: 'ok' });
    }).catch((err) => {
      console.log(err);
    });
  }

  updateKorisnickoIme = (req: express.Request, res: express.Response) => {
    let user = (req as any).user.korisnickoIme;
    let novoKorisnickoImeC = req.body.novoKorisnickoIme;
    TreningModel.updateMany(
      { igracId: user },
      { $set: { igracId: novoKorisnickoImeC } },
    )
      .then((ok) => {
        res.json({ message: 'ok' });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updateTrener = (req: express.Request, res: express.Response) => {
    let staroKorisnickoIme = (req as any).user.korisnickoIme;
    let novoKorisnickoIme = req.body.novoKorisnickoIme;
    TreningModel.updateMany(
      { trenerId: staroKorisnickoIme },
      { $set: { trenerId: novoKorisnickoIme } },
    )
      .then((ok) => {
        res.json({ message: 'ok' });
      })
      .catch((err) => {
        console.log(err);
      });
  }

}
