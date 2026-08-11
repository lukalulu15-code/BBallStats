import express from "express";
import ProtivnickiIgracModel from "../models/protivnickiIgrac";
import UtakmicaModel from "../models/utakmica";
export class ProtivnickiIgracController {
  addIgrac = async (req: express.Request, res: express.Response) => {
    let prijavljen = (req as any).user;
    let utakmicaIdC = req.body.utakmicaId;
    const utakmica = await UtakmicaModel.findOne({
      id: utakmicaIdC,
      trener: prijavljen.korisnickoIme,
    });
    if (!utakmica) {
      res.json({ message: "nemaDozvolu" });
      return;
    }
    const maxId = await ProtivnickiIgracModel.findOne().sort({ id: -1 });
    const newId = maxId ? maxId.id + 1 : 1;
    let idC = newId;
    let imeC = req.body.ime;
    let prezimeC = req.body.prezime;
    let klubC = req.body.klub;
    let brojC = req.body.broj;
    let pozicijaC = req.body.pozicija;
    let igracObject = {
      id: idC,
      ime: imeC,
      prezime: prezimeC,
      klub: klubC,
      broj: brojC,
      pozicija: pozicijaC,
      utakmicaId: utakmicaIdC,
    };
    new ProtivnickiIgracModel(igracObject)
      .save()
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: "failed registration" });
      });
  };

  deleteIgrac = (req: express.Request, res: express.Response) => {
    console.log("back delete user");
    let idC = req.body.id;
    let prijavljen = (req as any).user;
    ProtivnickiIgracModel.findOne({ id: idC }).then((igrac) => {
      if (!igrac) {
        res.json({ message: "User deleted" });
        return;
      }
      UtakmicaModel.findOne({ id: igrac.utakmicaId, trener: prijavljen.korisnickoIme }).then(
        (utakmica) => {
          if (!utakmica) {
            res.json({ message: "nemaDozvolu" });
            return;
          }
          ProtivnickiIgracModel.deleteOne({ id: idC })
            .then(() => {
              res.json({ message: "User deleted" });
            })
            .catch(() => {
              console.log("Error");
              res.json({ message: "Error" });
            });
        },
      );
    });
  };

  getProtivnickiIgracKorisnickoIme = (
    req: express.Request,
    res: express.Response,
  ) => {
    let user = req.body.id;
    let prijavljen = (req as any).user;
    ProtivnickiIgracModel.findOne({ id: user })
      .then((igrac) => {
        if (!igrac) {
          res.json(null);
          return;
        }
        UtakmicaModel.findOne({ id: igrac.utakmicaId, trener: prijavljen.korisnickoIme }).then(
          (utakmica) => {
            if (!utakmica) {
              res.json(null);
              return;
            }
            res.json(igrac);
          },
        );
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };

  updateProtivnickiIgracKorisnickoIme = (req: express.Request, res: express.Response) => {
    let user = req.body.id;
    let imeC = req.body.ime;
    let prezimeC = req.body.prezime;
    let brojC = req.body.broj;
    let pozicijaC = req.body.pozicija;
    let prijavljen = (req as any).user;
    ProtivnickiIgracModel.findOne({ id: user }).then((igrac) => {
      if (!igrac) {
        res.json({ message: "nemaDozvolu" });
        return;
      }
      UtakmicaModel.findOne({ id: igrac.utakmicaId, trener: prijavljen.korisnickoIme }).then(
        (utakmica) => {
          if (!utakmica) {
            res.json({ message: "nemaDozvolu" });
            return;
          }
          ProtivnickiIgracModel.updateOne(
            { id: user },
            {
              $set: {
                ime: imeC,
                prezime: prezimeC,
                broj: brojC,
                pozicija: pozicijaC,
              },
            },
          )
            .then((ok) => {
              res.json({ message: "ok" });
            })
            .catch((err) => {
              console.log(err);
            });
        },
      );
    });
  };

  getAllProtivnicki = (req: express.Request, res: express.Response) => {
    let prijavljen = (req as any).user;
    UtakmicaModel.find({ trener: prijavljen.korisnickoIme })
      .distinct("id")
      .then((utakmiceIds) => {
        ProtivnickiIgracModel.find({ utakmicaId: { $in: utakmiceIds as unknown as number[] } })
          .then((igraci) => {
            res.json(igraci);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  getAllProtivnickiKlub = (req: express.Request, res: express.Response) => {
    let klubC = req.body.klub;
    let prijavljen = (req as any).user;
    UtakmicaModel.find({ trener: prijavljen.korisnickoIme })
      .distinct("id")
      .then((utakmiceIds) => {
        ProtivnickiIgracModel.find({
          klub: klubC,
          utakmicaId: { $in: utakmiceIds as unknown as number[] },
        })
          .sort({ broj: 1 })
          .then((igraci) => {
            res.json(igraci);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
