import express from "express";
import UtakmicaModel from "../models/utakmica";
import trener from "../models/trener";

export class UtakmicController {
  getAllUtakmice = (req: express.Request, res: express.Response) => {
    let trenerKorIme = (req as any).user.korisnickoIme;
    UtakmicaModel.find({ trener: trenerKorIme })
      .sort({ id: 1 })
      .then((utakmice) => {
        res.json(utakmice);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  getAllUtakmiceZavrsene = (req: express.Request, res: express.Response) => {
    let trenerKorIme = (req as any).user.korisnickoIme;
    UtakmicaModel.find({
      trener: trenerKorIme,
      status: { $in: ["pobeda", "poraz"] },
    })
      .sort({ id: 1 })
      .then((utakmice) => {
        res.json(utakmice);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  getDateSortedAllUtakmice = (req: express.Request, res: express.Response) => {
    let trenerKorIme = (req as any).user.korisnickoIme;
    UtakmicaModel.find({ trener: trenerKorIme })
      .sort({ datum: 1, vreme: 1 })
      .then((utakmice) => {
        res.json(utakmice);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getUtakmiceSezone = (req: express.Request, res: express.Response) => {
    let trenerKorIme = (req as any).user.korisnickoIme;
    UtakmicaModel.find({
      trener: trenerKorIme,
      sezonaPocetak: req.body.sezonaPocetak,
    })
      .sort({ datum: 1, vreme: 1 })
      .then((utakmice) => {
        res.json(utakmice);
      })
      .catch((err) => console.log(err));
  };

  getSezoneTrenera = (req: express.Request, res: express.Response) => {
    let prijavljen = (req as any).user;
    // trener uvek gleda svoje sezone, igrač gleda sezone svog trenera
    let trenerKorIme = prijavljen.tip === "trener" ? prijavljen.korisnickoIme : req.body.trener;
    UtakmicaModel.find({ trener: trenerKorIme })
      .distinct("sezonaPocetak")
      .then((sezone) => {
        res.json(sezone.sort((a, b) => b - a));
      })
      .catch((err) => console.log(err));
  };

  getUtakmica = (req: express.Request, res: express.Response) => {
    let idC = req.body.id;
    let prijavljen = (req as any).user;
    UtakmicaModel.findOne({ id: idC })
      .then((utakmica) => {
        if (!utakmica) {
          res.json(null);
          return;
        }
        // trener sme samo svoju utakmicu, igrač sme utakmicu svog trenera
        if (utakmica.trener !== prijavljen.korisnickoIme && prijavljen.tip !== "igrac") {
          res.json(null);
          return;
        }
        res.json(utakmica);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  addUtakmica = async (req: express.Request, res: express.Response) => {
    const maxId = await UtakmicaModel.findOne().sort({ id: -1 });
    const newId = maxId ? maxId.id + 1 : 1;
    let idC = newId;
    let domacinC = req.body.domacin;
    let gostC = req.body.gost;
    let datumC = req.body.datum;
    let vremeC = req.body.vreme;
    let takmicenjeC = req.body.takmicenje;
    let trenerC = (req as any).user.korisnickoIme;
    let napomenaC = req.body.napomena;
    let vremeTajmerC = req.body.vremeTajmer;
    let cetvrtinaC = req.body.cetvrtina;
    let tajmerRadiC = req.body.tajmerRadi;
    let poslednjiUpdateC = req.body.poslednjiUpdate;
    let sezonaPocetakC = req.body.sezonaPocetak;
    let sezonaKrajC = req.body.sezonaKraj;
    let utakmicaObject = {
      domacin: domacinC,
      gost: gostC,
      datum: datumC,
      vreme: vremeC,
      takmicenje: takmicenjeC,
      poeniDomacin: 0,
      poeniGost: 0,
      trener: trenerC,
      napomena: napomenaC,
      id: idC,
      status: "zakazano",
      vremeTajmer: vremeTajmerC,
      cetvrtina: cetvrtinaC,
      tajmerRadi: tajmerRadiC,
      poslednjiUpdate: poslednjiUpdateC,
      sezonaPocetak: sezonaPocetakC,
      sezonaKraj: sezonaKrajC,
    };
    new UtakmicaModel(utakmicaObject)
      .save()
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: "failed reservation" });
      });
  };
  updatePoeniUtakmicaDomacin = (
    req: express.Request,
    res: express.Response,
  ) => {
    let idC = req.body.id;
    let poeniDomacinC = req.body.poeniDomacin;
    let prijavljen = (req as any).user;
    UtakmicaModel.updateOne(
      { id: idC, trener: prijavljen.korisnickoIme },
      { $set: { poeniDomacin: poeniDomacinC } },
    )
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  updatePoeniUtakmicaGost = (req: express.Request, res: express.Response) => {
    let idC = req.body.id;
    let poeniGostC = req.body.poeniGost;
    let prijavljen = (req as any).user;
    UtakmicaModel.updateOne(
      { id: idC, trener: prijavljen.korisnickoIme },
      { $set: { poeniGost: poeniGostC } },
    )
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  updateTajmer = async (req: express.Request, res: express.Response) => {
    let idC = req.body.id;
    let vremeTajmerC = req.body.vremeTajmer;
    let cetvrtinaC = req.body.cetvrtina;
    let tajmerRadiC = req.body.tajmerRadi;
    let prijavljen = (req as any).user;
    const updated = await UtakmicaModel.updateOne(
      { id: idC, trener: prijavljen.korisnickoIme },
      {
        $set: {
          vremeTajmer: vremeTajmerC,
          cetvrtina: cetvrtinaC,
          tajmerRadi: tajmerRadiC,
          poslednjiUpdate: new Date(),
        },
      },
    )
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  zavrsiUtakmicu = (req: express.Request, res: express.Response) => {
    let idC = req.body.id;
    let ishodC = req.body.ishod;
    let prijavljen = (req as any).user;
    UtakmicaModel.updateOne(
      { id: idC, trener: prijavljen.korisnickoIme },
      { $set: { status: ishodC } },
    )
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  setStatus = (req: express.Request, res: express.Response) => {
    let idC = req.body.id;
    let statusC = req.body.status;
    let prijavljen = (req as any).user;
    UtakmicaModel.updateOne(
      { id: idC, trener: prijavljen.korisnickoIme },
      { $set: { status: statusC } },
    )
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  updateTrener = (req: express.Request, res: express.Response) => {
    let staroKorisnickoIme = (req as any).user.korisnickoIme;
    let novoKorisnickoIme = req.body.novoKorisnickoIme;
    UtakmicaModel.updateMany(
      { trener: staroKorisnickoIme }, // ← filter: samo utakmice ovog trenera
      { $set: { trener: novoKorisnickoIme } }, // ← postavi novo ime
    )
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  deleteUtakmica = (req: express.Request, res: express.Response) => {
    let prijavljen = (req as any).user;
    UtakmicaModel.deleteOne({ id: req.body.id, trener: prijavljen.korisnickoIme })
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
