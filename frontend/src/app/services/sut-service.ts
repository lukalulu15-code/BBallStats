import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { Sut } from '../models/sut';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SutService {
  uri = 'http://localhost:4000'; // prilagodi svom

  constructor(private http: HttpClient) {}

  addSut(
    tipSesijeF: string,
    utakmicaIdF: number,
    treningIdF: number,
    igracIdF: string,
    klubF: string,
    tipF: string,
    pogodakF: boolean,
    xF: number,
    yF: number,
    datumF: string,
  ) {
    const data = {
      tipSesije: tipSesijeF,
      utakmicaId: utakmicaIdF,
      treningId: treningIdF,
      igracId: igracIdF,
      klub: klubF,
      tip: tipF,
      pogodak: pogodakF,
      x: xF,
      y: yF,
      datum: datumF,
    };
    return this.http.post<Message>(`${this.uri}/sutevi/addSut`, data);
  }

  getSuteviIgraca(igracIdF: string) {
    const data={
      igracId:igracIdF
    }
    return this.http.post<Sut[]>(`${this.uri}/sutevi/getSuteviIgraca`, data);
  }

  getSuteviUtakmica(igracIdF: string, utakmicaIdF: number) {
    const data={
      igracId:igracIdF,
      utakmicaId:utakmicaIdF
    }
    return this.http.post<Sut[]>(`${this.uri}/sutevi/getSuteviUtakmica`, data);
  }
  getSuteviUtakmicaSvih(utakmicaIdF: number) {
    const data={
      utakmicaId:utakmicaIdF
    }
    return this.http.post<Sut[]>(`${this.uri}/sutevi/getSuteviUtakmicaSvih`, data);
  }

  getSuteviTrening(igracIdF: string, treningIdF: number) {
    const data={
      igracId:igracIdF,
      treningId:treningIdF
    }
    return this.http.post<Sut[]>(`${this.uri}/sutevi/getSuteviTrening`, data);
  }

  deleteSut(idF: number) {
    const data={
      id:idF
    }
    return this.http.post<Message>(`${this.uri}/sutevi/deleteSut`, data);
  }

  updateKorisnickoIme(idF: string, novoKorisnickoImeF: string) {
    const data = {
      id: idF,
      novoKorisnickoIme: novoKorisnickoImeF,
    };
    return this.http.post<Message>(`${this.uri}/sutevi/updateKorisnickoIme`, data);
  }
}
