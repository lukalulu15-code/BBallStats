import express from 'express';
import SutModel from "../models/sut";
import IgracModel from "../models/igrac";
import UtakmicaModel from "../models/utakmica";

export class SutController {

  addSut = (req: express.Request, res: express.Response) => {
    let prijavljen = (req as any).user;
    let igracIdC = req.body.igracId;
    IgracModel.findOne({ korisnickoIme: igracIdC }).then((igrac) => {
      if (!igrac || igrac.trener !== prijavljen.korisnickoIme) {
        res.json({ message: 'nemaDozvolu' });
        return;
      }
      SutModel.findOne().sort({ id: -1 }).then((poslednji) => {
        let noviId = poslednji ? poslednji.id + 1 : 1;
        let sut = new SutModel({
          id: noviId,
          tipSesije: req.body.tipSesije,
          utakmicaId: req.body.utakmicaId,
          treningId: req.body.treningId,
          igracId: igracIdC,
          klub: req.body.klub,
          tip: req.body.tip,
          pogodak: req.body.pogodak,
          x: req.body.x,
          y: req.body.y,
          datum: req.body.datum,
        });
        sut.save().then((ok) => {
          res.json({ message: 'ok' });
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  // svi šutevi igrača (kroz sve utakmice i treninge)
  getSuteviIgraca = (req: express.Request, res: express.Response) => {
    let igracIdC = req.body.igracId;
    let prijavljen = (req as any).user;
    if (prijavljen.korisnickoIme === igracIdC) {
      SutModel.find({ igracId: igracIdC }).then((sutevi) => {
        res.json(sutevi);
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
      SutModel.find({ igracId: igracIdC }).then((sutevi) => {
        res.json(sutevi);
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  // šutevi igrača za jednu utakmicu
  getSuteviUtakmica = (req: express.Request, res: express.Response) => {
    let igracIdC = req.body.igracId;
    let utakmicaIdC = req.body.utakmicaId;
    let prijavljen = (req as any).user;
    if (prijavljen.korisnickoIme === igracIdC) {
      SutModel.find({ igracId: igracIdC, utakmicaId: utakmicaIdC }).then((sutevi) => {
        res.json(sutevi);
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
      SutModel.find({ igracId: igracIdC, utakmicaId: utakmicaIdC }).then((sutevi) => {
        res.json(sutevi);
      }).catch((err) => {
        console.log(err);
      });
    });
  }
  getSuteviUtakmicaSvih = (req: express.Request, res: express.Response) => {
    let utakmicaIdC = req.body.utakmicaId;
    let prijavljen = (req as any).user;
    UtakmicaModel.findOne({ id: utakmicaIdC, trener: prijavljen.korisnickoIme }).then((utakmica) => {
      if (!utakmica) {
        res.json([]);
        return;
      }
      SutModel.find({
        utakmicaId: utakmicaIdC
      }).then((sutevi) => {
        res.json(sutevi);
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  // šutevi igrača za jedan trening
  getSuteviTrening = (req: express.Request, res: express.Response) => {
    let igracIdC = req.body.igracId;
    let treningIdC = req.body.treningId;
    let prijavljen = (req as any).user;
    if (prijavljen.korisnickoIme === igracIdC) {
      SutModel.find({ igracId: igracIdC, treningId: treningIdC }).then((sutevi) => {
        res.json(sutevi);
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
      SutModel.find({ igracId: igracIdC, treningId: treningIdC }).then((sutevi) => {
        res.json(sutevi);
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  deleteSut = (req: express.Request, res: express.Response) => {
    let prijavljen = (req as any).user;
    let idC = req.body.id;
    SutModel.findOne({ id: idC }).then((sut) => {
      if (!sut) {
        res.json({ message: 'ok' });
        return;
      }
      IgracModel.findOne({ korisnickoIme: sut.igracId }).then((igrac) => {
        if (!igrac || igrac.trener !== prijavljen.korisnickoIme) {
          res.json({ message: 'nemaDozvolu' });
          return;
        }
        SutModel.deleteOne({ id: idC }).then((ok) => {
          res.json({ message: 'ok' });
        }).catch((err) => {
          console.log(err);
        });
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  updateKorisnickoIme = (req: express.Request, res: express.Response) => {
    let user = (req as any).user.korisnickoIme;
    let novoKorisnickoImeC = req.body.novoKorisnickoIme;
    SutModel.updateMany(
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
}
