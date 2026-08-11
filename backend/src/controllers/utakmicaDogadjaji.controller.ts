import express from "express";
import UtakmicaDogadadjajiModel from "../models/utakmicaDogadjaji";
import UtakmicaModel from "../models/utakmica";

export class UtakmicaDogadjajiController {
  // provera da li utakmica pripada prijavljenom treneru
  proveriVlasnistvoUtakmice(utakmicaId: number, prijavljen: any) {
    return UtakmicaModel.findOne({ id: utakmicaId, trener: prijavljen.korisnickoIme });
  }

  addDogadjaj = async (req: express.Request, res: express.Response) => {
    let utakmicaIdC = req.body.utakmicaId;
    let prijavljen = (req as any).user;
    const utakmica = await this.proveriVlasnistvoUtakmice(utakmicaIdC, prijavljen);
    if (!utakmica) {
      res.json({ message: "nemaDozvolu" });
      return;
    }
    const maxId = await UtakmicaDogadadjajiModel.findOne().sort({ id: -1 });
    const newId = maxId ? maxId.id + 1 : 1;
    let idC = newId;
    let domacinC = req.body.domacin;
    let gostC = req.body.gost;
    let vremeC = req.body.vreme;
    let cetvrtinaC = req.body.cetvrtina;
    let poeniDomacinC = req.body.poeniDomacin;
    let poeniGostC = req.body.poeniGost;
    let opisC = req.body.opis;
    let klubC = req.body.klub;
    let imeIgracaC = req.body.imeIgraca;
    let prezimeIgracaC = req.body.prezimeIgraca;
    let brojIgracaC = req.body.brojIgraca;
    let igracC = req.body.igrac;
    let dogadjajObject = {
      id: idC,
      utakmicaId: utakmicaIdC,
      domacin: domacinC,
      gost: gostC,
      vreme: vremeC,
      cetvrtina: cetvrtinaC,
      poeniDomacin: poeniDomacinC,
      poeniGost: poeniGostC,
      opis: opisC,
      klub: klubC,
      imeIgraca: imeIgracaC,
      prezimeIgraca: prezimeIgracaC,
      brojIgraca: brojIgracaC,
      igrac: igracC,
    };
    new UtakmicaDogadadjajiModel(dogadjajObject)
      .save()
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: "failed reservation" });
      });
  };

  deleteDogadjaj = (req: express.Request, res: express.Response) => {
    console.log("back delete event");
    let idC = req.body.id;
    let utakmicaIdC = req.body.utakmicaId;
    let prijavljen = (req as any).user;
    this.proveriVlasnistvoUtakmice(utakmicaIdC, prijavljen).then((utakmica) => {
      if (!utakmica) {
        res.json({ message: "nemaDozvolu" });
        return;
      }
      UtakmicaDogadadjajiModel.deleteOne({ id: idC, utakmicaId: utakmicaIdC })
        .then(() => {
          res.json({ message: "ok" });
        })
        .catch(() => {
          console.log("Error");
          res.json({ message: "Error" });
        });
    });
  };
  getAllDogadjajiCetvrtina = (req: express.Request, res: express.Response) => {
    let utakmicaIdC = req.body.utakmicaId;
    let cetvrtinaC = req.body.cetvrtina;
    let prijavljen = (req as any).user;
    this.proveriVlasnistvoUtakmice(utakmicaIdC, prijavljen).then((utakmica) => {
      if (!utakmica) {
        res.json([]);
        return;
      }
      UtakmicaDogadadjajiModel.find({
        utakmicaId: utakmicaIdC,
        cetvrtina: cetvrtinaC,
      })
        .then((dogadjaji) => {
          dogadjaji.sort((a, b) => {
            const [minA, secA] = (a.vreme ?? "0:00").split(":").map(Number);
            const [minB, secB] = (b.vreme ?? "0:00").split(":").map(Number);
            const sekA = minA * 60 + secA;
            const sekB = minB * 60 + secB;
            if (sekA !== sekB) {
              return sekA - sekB;
            }
            return Number(b.id ?? 0) - Number(a.id ?? 0); // i id može biti null, pa zaštiti i njega
          });
          res.json(dogadjaji);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  getAllDogadjajiProduzeci = (req: express.Request, res: express.Response) => {
    let utakmicaIdC = req.body.utakmicaId;
    let prijavljen = (req as any).user;
    this.proveriVlasnistvoUtakmice(utakmicaIdC, prijavljen).then((utakmica) => {
      if (!utakmica) {
        res.json([]);
        return;
      }
      UtakmicaDogadadjajiModel.find({
        utakmicaId: utakmicaIdC,
        cetvrtina: { $gt: 4 },
      })
        .then((dogadjaji) => {
          dogadjaji.sort((a, b) => {
            const [minA, secA] = (a.vreme ?? "0:00").split(":").map(Number);
            const [minB, secB] = (b.vreme ?? "0:00").split(":").map(Number);
            const sekA = minA * 60 + secA;
            const sekB = minB * 60 + secB;
            const cetA = a.cetvrtina ?? 0;
            const cetB = b.cetvrtina ?? 0;
            if (cetA !== cetB) {
              return cetB - cetA;
            }
            if (sekA !== sekB) {
              return sekA - sekB;
            }
            return Number(b.id ?? 0) - Number(a.id ?? 0); // i id može biti null, pa zaštiti i njega
          });
          res.json(dogadjaji);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  getAllDogadjaji = (req: express.Request, res: express.Response) => {
    let utakmicaIdC = req.body.utakmicaId;
    let prijavljen = (req as any).user;
    this.proveriVlasnistvoUtakmice(utakmicaIdC, prijavljen).then((utakmica) => {
      if (!utakmica) {
        res.json([]);
        return;
      }
      UtakmicaDogadadjajiModel.find({ utakmicaId: utakmicaIdC })
        .then((dogadjaji) => {
          dogadjaji.sort((a, b) => {
            if (a.cetvrtina != b.cetvrtina) {
              return (b.cetvrtina ?? 0) - (a.cetvrtina ?? 0);
            }
            const [minA, secA] = (a.vreme ?? "0:00").split(":").map(Number);
            const [minB, secB] = (b.vreme ?? "0:00").split(":").map(Number);
            const sekA = minA * 60 + secA;
            const sekB = minB * 60 + secB;
            if (sekA !== sekB) {
              return sekA - sekB;
            }
            return Number(b.id ?? 0) - Number(a.id ?? 0); // i id može biti null, pa zaštiti i njega
          });
          res.json(dogadjaji);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  updateKorisnickoIme = (req: express.Request, res: express.Response) => {
    let user = (req as any).user.korisnickoIme;
    let novoKorisnickoImeC = req.body.novoKorisnickoIme;
    UtakmicaDogadadjajiModel.updateMany(
      { "igrac.id": user },
      { $set: { "igrac.id": novoKorisnickoImeC } },
    )
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  updateIgracIme = (req: express.Request, res: express.Response) => {
    let user = (req as any).user.korisnickoIme;
    let imeC = req.body.ime;
    UtakmicaDogadadjajiModel.updateMany(
      { "igrac.id": user },
      { $set: { imeIgraca: imeC, "igrac.ime": imeC } },
    )
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  updateIgracPrezime = (req: express.Request, res: express.Response) => {
    let user = (req as any).user.korisnickoIme;
    let prezimeC = req.body.prezime;
    UtakmicaDogadadjajiModel.updateMany(
      { "igrac.id": user },
      { $set: { "igrac.prezime": prezimeC, prezimeIgraca: prezimeC } },
    )
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
