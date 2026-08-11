import express from "express";
import IzvestajModel from "../models/izvestaj";
import IgracModel from "../models/igrac";

export class IzvestajController {
  dodajIzvestaj = (req: express.Request, res: express.Response) => {
    let igracKorisnickoImeC = req.body.igracKorisnickoIme;
    let prijavljen = (req as any).user;
    IgracModel.findOne({ korisnickoIme: igracKorisnickoImeC }).then((igrac) => {
      if (!igrac || igrac.trener !== prijavljen.korisnickoIme) {
        res.json({ message: "nemaDozvolu" });
        return;
      }
      IzvestajModel.findOne()
        .sort({ id: -1 })
        .then((poslednji) => {
          let noviId = poslednji ? poslednji.id + 1 : 1;
          let izvestaj = new IzvestajModel({
            id: noviId,
            igracKorisnickoIme: igracKorisnickoImeC,
            trenerKorisnickoIme: prijavljen.korisnickoIme,
            datum: req.body.datum,
            tekst: req.body.tekst,
            procitan: false,
          });
          izvestaj
            .save()
            .then((ok) => {
              res.json({ message: "ok" });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  getIzvestajiIgraca = (req: express.Request, res: express.Response) => {
    let igracKorisnickoImeC = req.body.igracKorisnickoIme;
    let prijavljen = (req as any).user;
    if (prijavljen.korisnickoIme === igracKorisnickoImeC) {
      IzvestajModel.find({ igracKorisnickoIme: igracKorisnickoImeC })
        .sort({ id: -1 })
        .then((izvestaji) => {
          res.json(izvestaji);
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    }
    IgracModel.findOne({ korisnickoIme: igracKorisnickoImeC }).then((igrac) => {
      if (!igrac || igrac.trener !== prijavljen.korisnickoIme) {
        res.json([]);
        return;
      }
      IzvestajModel.find({ igracKorisnickoIme: igracKorisnickoImeC })
        .sort({ id: -1 })
        .then((izvestaji) => {
          res.json(izvestaji);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  obrisiIzvestaj = (req: express.Request, res: express.Response) => {
    let prijavljen = (req as any).user;
    IzvestajModel.deleteOne({ id: req.body.id, trenerKorisnickoIme: prijavljen.korisnickoIme })
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  procitaoIzvestaj = (req: express.Request, res: express.Response) => {
    let prijavljen = (req as any).user;
    IzvestajModel.updateOne(
      { id: req.body.id, igracKorisnickoIme: prijavljen.korisnickoIme },
      { $set: { procitan: true } },
    )
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
