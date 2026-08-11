import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { Igrac } from '../models/igrac';

@Injectable({
  providedIn: 'root',
})
export class IgraciService {
  constructor(private http: HttpClient) {}
  uri = 'http://localhost:4000';

  login(korisnickoImeF: string, lozinkaF: string) {
    const data = {
      korisnickoIme: korisnickoImeF,
      lozinka: lozinkaF,
    };
    return this.http.post<{ igrac: Igrac; token: string } | null>(
      `${this.uri}/igraci/login`,
      data,
    );
  }

  getIgracKorisnickoIme(korisnickoImeF: string) {
    const data = {
      korisnickoIme: korisnickoImeF,
    };
    return this.http.post<Igrac>(`${this.uri}/igraci/getIgracKorisnickoIme`, data);
  }

  updateIgracKorisnickoIme(
    korisnickoImeF: string,
    imeF: string,
    prezimeF: string,
    slikaF: string,
    datumRodjenjaF: string,
    brojF: number,
    pozicijaF: string,
    visinaF: number,
  ) {
    const data = {
      korisnickoIme: korisnickoImeF,
      ime: imeF,
      prezime: prezimeF,
      slika: slikaF,
      datumRodjenja: datumRodjenjaF,
      broj: brojF,
      pozicija: pozicijaF,
      visina: visinaF,
    };
    return this.http.post<Message>(`${this.uri}/igraci/updateIgracKorisnickoIme`, data);
  }

  addIgrac(
    korisnickoImeF: string,
    lozinkaF: string,
    imeF: string,
    prezimeF: string,
    slikaF: string,
    klubF: string,
    datumRodjenjaF: string,
    brojF: number,
    trenerF: string,
    pozicijaF: string,
    visinaF: number,
    mejlF:string
  ) {
    const data = {
      korisnickoIme: korisnickoImeF,
      lozinka: lozinkaF,
      ime: imeF,
      prezime: prezimeF,
      klub: klubF,
      slika: slikaF,
      datumRodjenja: datumRodjenjaF,
      broj: brojF,
      trener: trenerF,
      pozicija: pozicijaF,
      visina: visinaF,
      mejl:mejlF
    };
    return this.http.post<Message>(`${this.uri}/igraci/addIgrac`, data);
  }

  getAllIgraci() {
    return this.http.get<Igrac[]>(`${this.uri}/igraci/getAllIgraci`);
  }
  getAllIgraciTrenera(trenerF: string) {
    const data = {
      trener: trenerF,
    };
    return this.http.post<Igrac[]>(`${this.uri}/igraci/getAllIgraciTrenera`, data);
  }
  deleteIgrac(korisnickoImeIgracaF: string) {
    const data = {
      korisnickoImeIgraca: korisnickoImeIgracaF,
    };
    return this.http.post(`${this.uri}/igraci/deleteIgrac`, data);
  }
  updateIgracIme(korisnickoImeF: string, imeF: string) {
    const data = {
      korisnickoIme: korisnickoImeF,
      ime: imeF,
    };
    return this.http.post<Message>(`${this.uri}/igraci/updateIgracIme`, data);
  }
  updateIgracPrezime(korisnickoImeF: string, prezimeF: string) {
    const data = {
      korisnickoIme: korisnickoImeF,
      prezime: prezimeF,
    };
    return this.http.post<Message>(`${this.uri}/igraci/updateIgracPrezime`, data);
  }
  updateKorisnickoIme(korisnickoImeF: string, novoKorisnickoImeF: string) {
    const data = {
      korisnickoIme: korisnickoImeF,
      novoKorisnickoIme: novoKorisnickoImeF,
    };
    return this.http.post<Message>(`${this.uri}/igraci/updateKorisnickoIme`, data);
  }
  updateIgracMejl(korisnickoImeF: string, mejlF: string) {
    const data = {
      korisnickoIme: korisnickoImeF,
      mejl: mejlF,
    };
    return this.http.post<Message>(`${this.uri}/igraci/updateIgracMejl`, data);
  }
  updateIgracSlika(korisnickoImeF: string, slikaF: string) {
    const data = {
      korisnickoIme: korisnickoImeF,
      slika: slikaF,
    };
    return this.http.post<Message>(`${this.uri}/igraci/updateIgracSlika`, data);
  }
  updateIgracLozinka(korisnickoImeF: string, staraLozinkaF: string, novaLozinkaF: string) {
    const data = {
      korisnickoIme: korisnickoImeF,
      staraLozinka: staraLozinkaF,
      novaLozinka: novaLozinkaF,
    };
    return this.http.post<Message>(`${this.uri}/igraci/updateIgracLozinka`, data);
  }
  updateTrener(staroKorisnickoImeF: string, novoKorisnickoImeF: string) {
    const data = {
      staroKorisnickoIme: staroKorisnickoImeF,
      novoKorisnickoIme: novoKorisnickoImeF,
    };
    return this.http.post<Message>(`${this.uri}/igraci/updateTrener`, data);
  }
  zaboravioLozinku(emailF: string,korisnickoImeF:string) {
     const data = {
      email:emailF,
      korisnickoIme:korisnickoImeF
    };
    return this.http.post<Message>(`${this.uri}/igraci/zaboravioLozinku`, data);
  }

  resetLozinka(tokenF: string, novaLozinkaF: string) {
    const data={
      token:tokenF,
      novaLozinka:novaLozinkaF
    }
    return this.http.post<any>(`${this.uri}/igraci/resetLozinka`,data);
  }
}
