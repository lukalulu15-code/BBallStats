import express from "express";
import bcrypt from "bcryptjs";
import TrenerModel from "../models/trener";
import { generisiToken } from "../utils/token";

export class TrenerController {
  login = async (req: express.Request, res: express.Response) => {
    let user = req.body.korisnickoIme;
    let pass = req.body.lozinka;
    try {
      const trener = await TrenerModel.findOne({ korisnickoIme: user });
      if (!trener) {
        res.json(null);
        return;
      }
      let lozinkaIspravna = await bcrypt.compare(pass, trener.lozinka || "");
      if (!lozinkaIspravna && trener.lozinka === pass) {
        // stari nalog sa lozinkom u čistom tekstu — preheširaj je
        trener.lozinka = await bcrypt.hash(pass, 10);
        await trener.save();
        lozinkaIspravna = true;
      }
      if (!lozinkaIspravna) {
        res.json(null);
        return;
      }
      const token = generisiToken(trener.korisnickoIme || "", "trener");
      res.json({ trener, token });
    } catch (err) {
      console.log(err);
      res.json(null);
    }
  };
  register = async (req: express.Request, res: express.Response) => {
    let username = req.body.korisnickoIme;
    let pass = req.body.lozinka;
    let name = req.body.ime;
    let surname = req.body.prezime;
    let phone = req.body.telefon;
    let mail = req.body.mejl;
    let club = req.body.klub;
    let pic = req.body.slika;
    try {
      let trenerObject = {
        korisnickoIme: username,
        lozinka: await bcrypt.hash(pass, 10),
        ime: name,
        prezime: surname,
        mejl: mail,
        klub: club,
        telefon: phone,
        slika: pic,
      };
      await new TrenerModel(trenerObject).save();
      res.json({ message: "ok" });
    } catch (err) {
      console.log(err);
      res.json({ message: "failed registration" });
    }
  };
  getAllTreneri = (req: express.Request, res: express.Response) => {
    TrenerModel.find({})
      .then((treneri) => {
        res.json(treneri);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  getTrenerKorisnickoIme = (req: express.Request, res: express.Response) => {
    let korisnickoIme = req.body.korisnickoIme;
    let prijavljen = (req as any).user;
    TrenerModel.findOne({ korisnickoIme: korisnickoIme })
      .then((trener) => {
        if (!trener) {
          res.json(null);
          return;
        }
        if (prijavljen.korisnickoIme !== trener.korisnickoIme && prijavljen.tip !== "igrac") {
          res.json(null);
          return;
        }
        res.json(trener);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  updateTrenerIme = (req: express.Request, res: express.Response) => {
    let user = (req as any).user.korisnickoIme;
    let imeC = req.body.ime;
    TrenerModel.updateOne({ korisnickoIme: user }, { $set: { ime: imeC } })
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  updateTrenerPrezime = (req: express.Request, res: express.Response) => {
    let user = (req as any).user.korisnickoIme;
    let prezimeC = req.body.prezime;
    TrenerModel.updateOne(
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
  updateTrenerMejl = (req: express.Request, res: express.Response) => {
    let user = (req as any).user.korisnickoIme;
    let mejlC = req.body.mejl;
    TrenerModel.updateOne({ korisnickoIme: user }, { $set: { mejl: mejlC } })
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  updateTrenerSlika = (req: express.Request, res: express.Response) => {
    let user = (req as any).user.korisnickoIme;
    let slikaC = req.body.slika;
    TrenerModel.updateOne({ korisnickoIme: user }, { $set: { slika: slikaC } })
      .then((ok) => {
        res.json({ message: "ok" });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  updateTrenerTelefon = (req: express.Request, res: express.Response) => {
    let user = (req as any).user.korisnickoIme;
    let telefonC = req.body.telefon;
    TrenerModel.updateOne(
      { korisnickoIme: user },
      { $set: { telefon: telefonC } },
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
    TrenerModel.updateOne(
      { korisnickoIme: user },
      { $set: { korisnickoIme: novoKorisnickoImeC } },
    )
      .then((ok) => {
        const token = generisiToken(novoKorisnickoImeC, "trener");
        res.json({ message: "ok", token });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  updateTrenerLozinka = async (req: express.Request, res: express.Response) => {
    let korisnickoImeC = (req as any).user.korisnickoIme;
    let staraLozinkaC = req.body.staraLozinka;
    let novaLozinkaC = req.body.novaLozinka;

    // nađi trenera
    const user = await TrenerModel.findOne({ korisnickoIme: korisnickoImeC });
    if (!user) {
      res.json({ message: "nemaTrenera" });
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
  zaboravioLozinku = async (req: express.Request, res: express.Response) => {
    const crypto = require("crypto");
    const nodemailer = require("nodemailer");

    let emailC=req.body.email;
    let korisnickoImeC=req.body.korisnickoIme;

    try {
      const igrac = await TrenerModel.findOne({
        $or: [
          { mejl: emailC },
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
        to: igrac.mejl,
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
      const igrac = await TrenerModel.findOne({
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
