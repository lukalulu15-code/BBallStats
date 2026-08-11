import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { Trener } from '../models/trener';
import { Utakmica } from '../models/utakmica';

@Injectable({
  providedIn: 'root',
})
export class TreneriService {
  constructor(private http: HttpClient) {}
  uri = 'http://localhost:4000';

  login(korisnickoImeF: string, lozinkaF: string) {
    const data = {
      korisnickoIme: korisnickoImeF,
      lozinka: lozinkaF,
    };
    return this.http.post<{ trener: Trener; token: string } | null>(
      `${this.uri}/treneri/login`,
      data,
    );
  }

  register(
    korisnickoImeF: string,
    lozinkaF: string,
    imeF: string,
    prezimeF: string,
    telefonF: string,
    mejlF: string,
    slikaF: string,
    klubF: string,
  ) {
    const data = {
      korisnickoIme: korisnickoImeF,
      lozinka: lozinkaF,
      ime: imeF,
      prezime: prezimeF,
      telefon: telefonF,
      mejl: mejlF,
      klub: klubF,
      slika: slikaF,
    };
    return this.http.post<Message>(`${this.uri}/treneri/register`, data);
  }
  getAllTreneri() {
    return this.http.get<Trener[]>(`${this.uri}/treneri/getAllTreneri`);
  }
  getTrenerKorisnickoIme(korisnickoImeF:string) {
    const data = {
      korisnickoIme: korisnickoImeF
    }
    return this.http.post<Trener>(`${this.uri}/treneri/getTrenerKorisnickoIme`,data);
  }
  addUtakmica(domacinF:string, gostF:string, datumF:string, vremeF:string, takmicenjeF:string,trenerF:string,napomenaF:string,vremeTajmerF:number,cetvrtinaF:number,tajmerRadiF:boolean,poslednjiUpdateF:Date|null,
    sezonaPocetakF:number, sezonaKrajF:number
  ){
    const data={
      domacin:domacinF,
      gost:gostF,
      datum:datumF,
      vreme:vremeF,
      takmicenje:takmicenjeF,
      trener:trenerF,
      napomena:napomenaF,
      vremeTajmer:vremeTajmerF,
      cetvrtina:cetvrtinaF,
      tajmerRadi:tajmerRadiF,
      poslednjiUpdate:poslednjiUpdateF,
      sezonaPocetak:sezonaPocetakF,
      sezonaKraj:sezonaKrajF
    }
    return this.http.post<Message>(`${this.uri}/utakmice/addUtakmica`,data)
  }
  getAllUtakmice(trenerF:string){
    const data={
      trener:trenerF
    }
    return this.http.post<Utakmica[]>(`${this.uri}/utakmice/getAllUtakmice`,data);
  }
  getDateSortedAllUtakmice(trenerF:string){
    const data={
      trener:trenerF
    }
    return this.http.post<Utakmica[]>(`${this.uri}/utakmice/getDateSortedAllUtakmice`,data);
  }

  updateTrenerIme(korisnickoImeF: string, imeF: string) {
  const data = {
    korisnickoIme: korisnickoImeF,
    ime: imeF,
  };
  return this.http.post<Message>(`${this.uri}/treneri/updateTrenerIme`, data);
}

updateTrenerPrezime(korisnickoImeF: string, prezimeF: string) {
  const data = {
    korisnickoIme: korisnickoImeF,
    prezime: prezimeF,
  };
  return this.http.post<Message>(`${this.uri}/treneri/updateTrenerPrezime`, data);
}

updateTrenerMejl(korisnickoImeF: string, mejlF: string) {
  const data = {
    korisnickoIme: korisnickoImeF,
    mejl: mejlF,
  };
  return this.http.post<Message>(`${this.uri}/treneri/updateTrenerMejl`, data);
}

updateTrenerSlika(korisnickoImeF: string, slikaF: string) {
  const data = {
    korisnickoIme: korisnickoImeF,
    slika: slikaF,
  };
  return this.http.post<Message>(`${this.uri}/treneri/updateTrenerSlika`, data);
}

updateTrenerTelefon(korisnickoImeF: string, telefonF: string) {
  const data = {
    korisnickoIme: korisnickoImeF,
    telefon: telefonF,
  };
  return this.http.post<Message>(`${this.uri}/treneri/updateTrenerTelefon`, data);
}

updateKorisnickoIme(korisnickoImeF: string, novoKorisnickoImeF: string) {
  const data = {
    korisnickoIme: korisnickoImeF,
    novoKorisnickoIme: novoKorisnickoImeF,
  };
  return this.http.post<Message>(`${this.uri}/treneri/updateKorisnickoIme`, data);
}

updateTrenerLozinka(korisnickoImeF: string, staraLozinkaF: string, novaLozinkaF: string) {
  const data = {
    korisnickoIme: korisnickoImeF,
    staraLozinka: staraLozinkaF,
    novaLozinka: novaLozinkaF,
  };
  return this.http.post<Message>(`${this.uri}/treneri/updateTrenerLozinka`, data);
}

zaboravioLozinku(emailF: string,korisnickoImeF:string) {
  const data = {
      email:emailF,
      korisnickoIme:korisnickoImeF
    };
  return this.http.post<Message>(`${this.uri}/treneri/zaboravioLozinku`,data);
}

resetLozinka(tokenF: string, novaLozinkaF: string) {
  const data={
      token:tokenF,
      novaLozinka:novaLozinkaF
    }
  return this.http.post<Message>(`${this.uri}/treneri/resetLozinka`,data);
}

}
