import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { MessageTr } from '../models/messageTr';
import { Trening } from '../models/trening';

@Injectable({
  providedIn: 'root',
})
export class TreningService {
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  addTrening(trenerIdF: string, igracIdF: string, klubF: string, datumF: string, opisF: string) {
    const data = {
      trenerId: trenerIdF,
      igracId: igracIdF,
      klub: klubF,
      datum: datumF,
      opis: opisF,
    };
    return this.http.post<MessageTr>(`${this.uri}/treninzi/addTrening`, data);
  }

  getTreninziIgraca(igracIdF: string) {
    const data={
      igracId:igracIdF
    }
    return this.http.post<Trening[]>(`${this.uri}/treninzi/getTreninziIgraca`, data);
  }

  deleteTrening(idF: number) {
    const data={
      id:idF
    }
    return this.http.post<MessageTr>(`${this.uri}/treninzi/deleteTrening`, data);
  }
  zavrsiTrening(idF: number) {
    const data={
      id:idF
    }
    return this.http.post<MessageTr>(`${this.uri}/treninzi/zavrsiTrening`, data);
  }

  updateKorisnickoIme(idF: string, novoKorisnickoImeF: string) {
    const data = {
      id: idF,
      novoKorisnickoIme: novoKorisnickoImeF,
    };
    return this.http.post<Message>(`${this.uri}/treninzi/updateKorisnickoIme`, data);
  }

  updateTrener(staroKorisnickoImeF: string, novoKorisnickoImeF: string) {
    const data = {
      staroKorisnickoIme: staroKorisnickoImeF,
      novoKorisnickoIme: novoKorisnickoImeF,
    };
    return this.http.post<Message>(`${this.uri}/treninzi/updateTrener`, data);
  }
}
