import express from "express";
import bcrypt from "bcryptjs";
import IgracModel from "../models/igrac";
import { generisiToken } from "../utils/token";

export class IgracController {
  login = async (req: express.Request, res: express.Response) => {
    let user = req.body.korisnickoIme;
    let pass = req.body.lozinka;
    try {
      const igrac = await IgracModel.findOne({ korisnickoIme: user });
      if (!igrac) {
        res.json(null);
        return;
      }
      let lozinkaIspravna = await bcrypt.compare(pass, igrac.lozinka || "");
      if (!lozinkaIspravna && igrac.lozinka === pass) {
        // stari nalog sa lozinkom u čistom tekstu — preheširaj je
        igrac.lozinka = await bcrypt.hash(pass, 10);
        await igrac.save();
        lozinkaIspravna = true;
      }
      if (!lozinkaIspravna) {
        res.json(null);
        return;
      }
      const token = generisiToken(igrac.korisnickoIme || "", "igrac");
      res.json({ igrac, token });
    } catch (err) {
      console.log(err);
      res.json(null);
    }
  };
  getIgracKorisnickoIme = (req: express.Request, res: express.Response) => {
    let user = req.body.korisnickoIme;
    let prijavljen = (req as any).user;
    IgracModel.findOne({ korisnickoIme: user })
      .then((user) => {
        if (!user) {
          res.json(null);
          return;
        }
        if (prijavljen.korisnickoIme !== user.korisnickoIme && prijavljen.korisnickoIme !== user.trener) {
          res.json(null);
          return;
        }
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };
  updateIgracKorisnickoIme = (req: express.Request, res: express.Response) => {
    let user = req.body.korisnickoIme;
    let prijavljen = (req as any).user;
    let slikaC = req.body.slika;
    let imeC = req.body.ime;
    let prezimeC = req.body.prezime;
    let brojC = req.body.broj;
    let pozicijaC = req.body.pozicija;
    let visinaC = req.body.visina;
    let datumRodjenjaC = req.body.datumRodjenja;
    IgracModel.updateOne(
      {
        korisnickoIme: user,
        $or: [{ trener: prijavljen.korisnickoIme }, { korisnickoIme: prijavljen.korisnickoIme }],
      },
      {
        $set: {
          slika: slikaC,
          ime: imeC,
          prezime: prezimeC,
          broj: brojC,
          pozicija: pozicijaC,
          visina: visinaC,
          datumRodjenja: datumRodjenjaC,
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
  updateIgracIme = (req: express.Request, res: express.Response) => {
    let user = (req as any).user.korisnickoIme;
    let imeC = req.body.ime;
    IgracModel.updateOne({ korisnickoIme: user }, { $set: { ime: imeC } })
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
    IgracModel.updateOne(
      { korisnickoIme: user },
      { $set: { prezime: prezimeC } },
    )
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  updateIgracMejl = (req: express.Request, res: express.Response) => {
    let user = (req as any).user.korisnickoIme;
    let mejlC = req.body.mejl;
    IgracModel.updateOne({ korisnickoIme: user }, { $set: { mail: mejlC } })
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  updateIgracSlika = (req: express.Request, res: express.Response) => {
    let user = (req as any).user.korisnickoIme;
    let slikaC = req.body.slika;
    IgracModel.updateOne({ korisnickoIme: user }, { $set: { slika: slikaC } })
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
    IgracModel.updateOne(
      { korisnickoIme: user },
      { $set: { korisnickoIme: novoKorisnickoImeC } },
    )
      .then((ok) => {
        const token = generisiToken(novoKorisnickoImeC, "igrac");
        res.json({ message: "ok", token });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  updateIgracLozinka = async (req: express.Request, res: express.Response) => {
    let korisnickoImeC = (req as any).user.korisnickoIme;
    let staraLozinkaC = req.body.staraLozinka;
    let novaLozinkaC = req.body.novaLozinka;

    // nađi igrača
    const user = await IgracModel.findOne({ korisnickoIme: korisnickoImeC });
    if (!user) {
      res.json({ message: "nemaIgraca" });
      return;
    }
    const staraIspravna =
      (await bcrypt.compare(staraLozinkaC, user.lozinka || "")) || user.lozinka === staraLozinkaC;
    if (!staraIspravna) {
      res.json({ message: "pogresnaStara" });
      return;
    }
    user.lozinka = await bcrypt.hash(novaLozinkaC, 10);
    user
      .save()
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  addIgrac = async (req: express.Request, res: express.Response) => {
    let korisnickoImeC = req.body.korisnickoIme;
    let lozinkaC = req.body.lozinka;
    let imeC = req.body.ime;
    let prezimeC = req.body.prezime;
    let klubC = req.body.klub;
    let slikaC = req.body.slika;
    let datumRodjenjaC = req.body.datumRodjenja;
    let brojC = req.body.broj;
    let trenerC = (req as any).user.korisnickoIme;
    let pozicijaC = req.body.pozicija;
    let visinaC = req.body.visina;
    let mejlC = req.body.mejl;
    let igracObject = {
      korisnickoIme: korisnickoImeC,
      lozinka: await bcrypt.hash(lozinkaC, 10),
      ime: imeC,
      prezime: prezimeC,
      klub: klubC,
      slika: slikaC,
      datumRodjenja: datumRodjenjaC,
      broj: brojC,
      trener: trenerC,
      pozicija: pozicijaC,
      visina: visinaC,
      mail:mejlC
    };
    new IgracModel(igracObject)
      .save()
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: "failed registration" });
      });
  };

  getAllIgraci = (req: express.Request, res: express.Response) => {
    IgracModel.find({})
      .then((igraci) => {
        res.json(igraci);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  getAllIgraciTrenera = (req: express.Request, res: express.Response) => {
    let coach = (req as any).user.korisnickoIme;
    IgracModel.find({ trener: coach })
      .sort({ broj: 1 })
      .then((igraci) => {
        res.json(igraci);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteIgrac = (req: express.Request, res: express.Response) => {
    console.log("back delete user");
    let korisnickoImeC = req.body.korisnickoImeIgraca;
    let prijavljen = (req as any).user;
    IgracModel.deleteOne({ korisnickoIme: korisnickoImeC, trener: prijavljen.korisnickoIme })
      .then(() => {
        res.json({ message: "User deleted" });
      })
      .catch(() => {
        console.log("Error");
        res.json({ message: "Error" });
      });
  };
  updateTrener = (req: express.Request, res: express.Response) => {
    let staroKorisnickoIme = (req as any).user.korisnickoIme;
    let novoKorisnickoIme = req.body.novoKorisnickoIme;
    IgracModel.updateMany(
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
  zaboravioLozinku = async (req: express.Request, res: express.Response) => {
    const crypto = require("crypto");
    const nodemailer = require("nodemailer");

    let emailC=req.body.email;
    let korisnickoImeC=req.body.korisnickoIme;

    try {
      const igrac = await IgracModel.findOne({
        $or: [
          { mail: emailC },
          { korisnickoIme: korisnickoImeC },
        ],
      });

      // uvek isti odgovor — ne otkrivamo da li korisnik postoji
      if (!igrac) {
        return res.json({ message: "Ako nalog postoji, poslaćemo link" });
      }

      const token = crypto.randomBytes(32).toString("hex");
      igrac.resetToken = token;
      igrac.resetTokenExpiry = new Date(Date.now() + 1800000); // 30 minuta
      await igrac.save();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const resetLink = `${process.env.FRONTEND_URL}/reset-lozinka/${token}`;

      await transporter.sendMail({
        from: process.env.EMAIL,
        to: igrac.mail,
        subject: "BBallStats — Reset lozinke",
        html: `
        <h2>Reset lozinke</h2>
        <p>Kliknite na link da resetujete lozinku:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Link važi 30 minuta.</p>
      `,
      });

      res.json({ message: "Ako nalog postoji, poslaćemo link" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Greška na serveru" });
    }
  };

  resetLozinka = async (req: express.Request, res: express.Response) => {
    let token = req.body.token;
    let novaLozinka = req.body.novaLozinka;

    try {
      const igrac = await IgracModel.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() },
      });

      if (!igrac) {
        return res
          .status(400)
          .json({ message: "Token nije validan ili je istekao" });
      }

      igrac.lozinka = await bcrypt.hash(novaLozinka, 10);
      igrac.resetToken = undefined;
      igrac.resetTokenExpiry = undefined;
      await igrac.save();

      res.json({ message: "ok" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Greška na serveru" });
    }
  };
}
