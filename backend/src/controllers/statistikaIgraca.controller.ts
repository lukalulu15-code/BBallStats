import StatistikaIgraca from "../models/statistikaIgraca";
import IgracModel from "../models/igrac";
import UtakmicaModel from "../models/utakmica";
import express from "express";
export class StatistikaIgracaController {
  // provera da li utakmica pripada prijavljenom treneru
  proveriVlasnistvoUtakmice(utakmicaId: number, prijavljen: any) {
    return UtakmicaModel.findOne({ id: utakmicaId, trener: prijavljen.korisnickoIme });
  }

  addIgracStatistika = (req: express.Request, res: express.Response) => {
    let idC = req.body.id;
    let utakmicaIdC = req.body.utakmicaId;
    let klubC = req.body.klub;
    let imeC = req.body.ime;
    let prezimeC = req.body.prezime;
    let brojC = req.body.broj;
    let minutiC = req.body.minuti;
    let poeniC = req.body.poeni;
    let dvaPoenaPogodakC = req.body.dvaPoenaPogodak;
    let dvaPoenaPromasajC = req.body.dvaPoenaPromasaj;
    let dvaPoenaProcenatC = req.body.dvaPoenaProcenat;
    let triPoenaPogodakC = req.body.triPoenaPogodak;
    let triPoenaPromasajC = req.body.triPoenaPromasaj;
    let triPoenaProcenatC = req.body.triPoenaProcenat;
    let slobodnoPogodakC = req.body.slobodnoPogodak;
    let slobodnoPromasajC = req.body.slobodnoPromasaj;
    let slobodnoProcenatC = req.body.slobodnoProcenat;
    let skokoviNapadC = req.body.skokoviNapad;
    let skokoviOdbranaC = req.body.skokoviOdbrana;
    let skokoviUkupnoC = req.body.skokoviUkupno;
    let asistencijeC = req.body.asistencije;
    let ukradeneC = req.body.ukradene;
    let izgubljeneC = req.body.izgubljene;
    let blokadeC = req.body.blokade;
    let blokadePrimljeneC = req.body.blokokadePrimljene;
    let licneGreskeC = req.body.licneGreske;
    let iznudjeniFauloviC = req.body.iznudjeniFaulovi;
    let indeksC = req.body.indeks;
    let plusMinusC = req.body.plusMinus;
    let terenC = req.body.teren;
    let starterC = req.body.starter;
    let prijavljen = (req as any).user;
    this.proveriVlasnistvoUtakmice(utakmicaIdC, prijavljen).then((utakmica) => {
      if (!utakmica) {
        res.json({ message: "nemaDozvolu" });
        return;
      }
      let igracObject = {
        id: idC,
        utakmicaId: utakmicaIdC,
        klub: klubC,
        ime: imeC,
        prezime: prezimeC,
        broj: brojC,
        minuti: minutiC,
        poeni: poeniC,
        dvaPoenaPogodak: dvaPoenaPogodakC,
        dvaPoenaPromasaj: dvaPoenaPromasajC,
        dvaPoenaProcenat: dvaPoenaProcenatC,
        triPoenaPogodak: triPoenaPogodakC,
        triPoenaPromasaj: triPoenaPromasajC,
        triPoenaProcenat: triPoenaProcenatC,
        slobodnoPogodak: slobodnoPogodakC,
        slobodnoPromasaj: slobodnoPromasajC,
        slobodnoProcenat: slobodnoProcenatC,
        skokoviNapad: skokoviNapadC,
        skokoviOdbrana: skokoviOdbranaC,
        skokoviUkupno: skokoviUkupnoC,
        asistencije: asistencijeC,
        ukradene: ukradeneC,
        izgubljene: izgubljeneC,
        blokade: blokadeC,
        blokadePrimljene: blokadePrimljeneC,
        licneGreske: licneGreskeC,
        iznudjeniFaulovi: iznudjeniFauloviC,
        indeks: indeksC,
        plusMinus: plusMinusC,
        teren: terenC,
        starter: starterC,
      };
      new StatistikaIgraca(igracObject)
        .save()
        .then((ok) => {
          res.json({ message: "ok" });
        })
        .catch((err) => {
          console.log(err);
          res.json({ message: "failed registration" });
        });
    });
  };

  getIgraciKlubUtakmica = (req: express.Request, res: express.Response) => {
    let utakmicaIdC = req.body.utakmicaId;
    let klubC = req.body.klub;
    let prijavljen = (req as any).user;
    this.proveriVlasnistvoUtakmice(utakmicaIdC, prijavljen).then((utakmica) => {
      if (!utakmica) {
        res.json([]);
        return;
      }
      StatistikaIgraca.find({ utakmicaId: utakmicaIdC, klub: klubC })
        .sort({ broj: 1 })
        .then((igraci) => {
          res.json(igraci);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  getIgraciKlubUtakmicaTeren = (
    req: express.Request,
    res: express.Response,
  ) => {
    let utakmicaIdC = req.body.utakmicaId;
    let klubC = req.body.klub;
    let prijavljen = (req as any).user;
    this.proveriVlasnistvoUtakmice(utakmicaIdC, prijavljen).then((utakmica) => {
      if (!utakmica) {
        res.json([]);
        return;
      }
      StatistikaIgraca.find({ utakmicaId: utakmicaIdC, klub: klubC, teren: true })
        .sort({ broj: 1 })
        .then((igraci) => {
          res.json(igraci);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  getIgraciKlubUtakmicaKlupa = (
    req: express.Request,
    res: express.Response,
  ) => {
    let utakmicaIdC = req.body.utakmicaId;
    let klubC = req.body.klub;
    let prijavljen = (req as any).user;
    this.proveriVlasnistvoUtakmice(utakmicaIdC, prijavljen).then((utakmica) => {
      if (!utakmica) {
        res.json([]);
        return;
      }
      StatistikaIgraca.find({
        utakmicaId: utakmicaIdC,
        klub: klubC,
        teren: false,
      })
        .sort({ broj: 1 })
        .then((igraci) => {
          res.json(igraci);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  getIgracUtakmica = (req: express.Request, res: express.Response) => {
    let utakmicaIdC = req.body.utakmicaId;
    let idC = req.body.id;
    let prijavljen = (req as any).user;
    this.proveriVlasnistvoUtakmice(utakmicaIdC, prijavljen).then((utakmica) => {
      if (!utakmica) {
        res.json(null);
        return;
      }
      StatistikaIgraca.findOne({ id: idC, utakmicaId: utakmicaIdC })
        .then((igrac) => {
          res.json(igrac);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  getIgracStatistika = (req: express.Request, res: express.Response) => {
    let idC = req.body.id;
    let prijavljen = (req as any).user;
    if (prijavljen.korisnickoIme === idC) {
      StatistikaIgraca.find({ id: idC })
        .then((igracStatistika) => {
          res.json(igracStatistika);
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    }
    IgracModel.findOne({ korisnickoIme: idC }).then((igrac) => {
      if (!igrac || igrac.trener !== prijavljen.korisnickoIme) {
        res.json([]);
        return;
      }
      StatistikaIgraca.find({ id: idC })
        .then((igracStatistika) => {
          res.json(igracStatistika);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  deleteIgracUtakmica = (req: express.Request, res: express.Response) => {
    console.log("back delete user");
    let idC = req.body.id;
    let utakmicaIdC = req.body.utakmicaId;
    let prijavljen = (req as any).user;
    this.proveriVlasnistvoUtakmice(utakmicaIdC, prijavljen).then((utakmica) => {
      if (!utakmica) {
        res.json({ message: "nemaDozvolu" });
        return;
      }
      StatistikaIgraca.deleteOne({ id: idC, utakmicaId: utakmicaIdC })
        .then(() => {
          res.json({ message: "User deleted" });
        })
        .catch(() => {
          console.log("Error");
          res.json({ message: "Error" });
        });
    });
  };
  updateIgracStatistika = (req: express.Request, res: express.Response) => {
    let idC = req.body.id;
    let utakmicaIdC = req.body.utakmicaId;
    let poeniC = req.body.poeni;
    let dvaPoenaPogodakC = req.body.dvaPoenaPogodak;
    let dvaPoenaPromasajC = req.body.dvaPoenaPromasaj;
    let dvaPoenaProcenatC = req.body.dvaPoenaProcenat;
    let triPoenaPogodakC = req.body.triPoenaPogodak;
    let triPoenaPromasajC = req.body.triPoenaPromasaj;
    let triPoenaProcenatC = req.body.triPoenaProcenat;
    let slobodnoPogodakC = req.body.slobodnoPogodak;
    let slobodnoPromasajC = req.body.slobodnoPromasaj;
    let slobodnoProcenatC = req.body.slobodnoProcenat;
    let skokoviNapadC = req.body.skokoviNapad;
    let skokoviOdbranaC = req.body.skokoviOdbrana;
    let skokoviUkupnoC = req.body.skokoviUkupno;
    let asistencijeC = req.body.asistencije;
    let ukradeneC = req.body.ukradene;
    let izgubljeneC = req.body.izgubljene;
    let blokadeC = req.body.blokade;
    let blokadePrimljeneC = req.body.blokokadePrimljene;
    let licneGreskeC = req.body.licneGreske;
    let iznudjeniFauloviC = req.body.iznudjeniFaulovi;
    let indeksC = req.body.indeks;
    let plusMinusC = req.body.plusMinus;
    let prijavljen = (req as any).user;
    this.proveriVlasnistvoUtakmice(utakmicaIdC, prijavljen).then((utakmica) => {
      if (!utakmica) {
        res.json({ message: "nemaDozvolu" });
        return;
      }
      StatistikaIgraca.updateOne(
        { id: idC, utakmicaId: utakmicaIdC },
        {
          $set: {
            poeni: poeniC,
            dvaPoenaPogodak: dvaPoenaPogodakC,
            dvaPoenaPromasaj: dvaPoenaPromasajC,
            dvaPoenaProcenat: dvaPoenaProcenatC,
            triPoenaPogodak: triPoenaPogodakC,
            triPoenaPromasaj: triPoenaPromasajC,
            triPoenaProcenat: triPoenaProcenatC,
            slobodnoPogodak: slobodnoPogodakC,
            slobodnoPromasaj: slobodnoPromasajC,
            slobodnoProcenat: slobodnoProcenatC,
            skokoviNapad: skokoviNapadC,
            skokoviOdbrana: skokoviOdbranaC,
            skokoviUkupno: skokoviUkupnoC,
            asistencije: asistencijeC,
            ukradene: ukradeneC,
            izgubljene: izgubljeneC,
            blokade: blokadeC,
            blokadePrimljene: blokadePrimljeneC,
            licneGreske: licneGreskeC,
            iznudjeniFaulovi: iznudjeniFauloviC,
            indeks: indeksC,
            plusMinus: plusMinusC,
          },
        },
      )
        .then((ok) => {
          res.json({ message: "ok" });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  updateIgracIme = (req: express.Request, res: express.Response) => {
    let user = (req as any).user.korisnickoIme;
    let imeC = req.body.ime;
    StatistikaIgraca.updateMany({ id: user }, { $set: { ime: imeC } })
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
    StatistikaIgraca.updateMany(
      { id: user },
      { $set: { prezime: prezimeC } },
    )
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  updateKorisnickoIme = (req: express.Request, res: express.Response) => {
    let user = (req as any).user.korisnickoIme;
    let novoKorisnickoImeC = req.body.novoKorisnickoIme;
    StatistikaIgraca.updateMany(
      { id: user },
      { $set: { id:novoKorisnickoImeC } },
    )
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };


  updateIgracTeren = (req: express.Request, res: express.Response) => {
    let idC = req.body.id;
    let utakmicaIdC = req.body.utakmicaId;
    let terenC = req.body.teren;
    let prijavljen = (req as any).user;
    this.proveriVlasnistvoUtakmice(utakmicaIdC, prijavljen).then((utakmica) => {
      if (!utakmica) {
        res.json({ message: "nemaDozvolu" });
        return;
      }
      StatistikaIgraca.updateOne(
        { id: idC, utakmicaId: utakmicaIdC },
        { $set: { teren: terenC } },
      )
        .then((ok) => {
          res.json({ message: "ok" });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  updateIgracStarter = (req: express.Request, res: express.Response) => {
    let idC = req.body.id;
    let utakmicaIdC = req.body.utakmicaId;
    let starterC = req.body.starter;
    let prijavljen = (req as any).user;
    this.proveriVlasnistvoUtakmice(utakmicaIdC, prijavljen).then((utakmica) => {
      if (!utakmica) {
        res.json({ message: "nemaDozvolu" });
        return;
      }
      StatistikaIgraca.updateOne(
        { id: idC, utakmicaId: utakmicaIdC },
        { $set: { starter: starterC } },
      )
        .then((ok) => {
          res.json({ message: "ok" });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  updateIgracMinuti = (req: express.Request, res: express.Response) => {
    let idC = req.body.id;
    let utakmicaIdC = req.body.utakmicaId;
    let minutiC = req.body.minuti;
    let prijavljen = (req as any).user;
    this.proveriVlasnistvoUtakmice(utakmicaIdC, prijavljen).then((utakmica) => {
      if (!utakmica) {
        res.json({ message: "nemaDozvolu" });
        return;
      }
      StatistikaIgraca.updateOne(
        { id: idC, utakmicaId: utakmicaIdC },
        { $set: { minuti: minutiC } },
      )
        .then((ok) => {
          res.json({ message: "ok" });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  updateIgracPlusMinus = (req: express.Request, res: express.Response) => {
    let idC = req.body.id;
    let utakmicaIdC = req.body.utakmicaId;
    let plusMinusC = req.body.plusMinus;
    let prijavljen = (req as any).user;
    this.proveriVlasnistvoUtakmice(utakmicaIdC, prijavljen).then((utakmica) => {
      if (!utakmica) {
        res.json({ message: "nemaDozvolu" });
        return;
      }
      StatistikaIgraca.updateOne(
        { id: idC, utakmicaId: utakmicaIdC },
        { $set: { plusMinus: plusMinusC } },
      )
        .then((ok) => {
          res.json({ message: "ok" });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
}
