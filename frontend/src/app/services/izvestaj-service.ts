import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { Izvestaj } from '../models/izvestaj';

@Injectable({
  providedIn: 'root',
})
export class IzvestajService {
  constructor(private http: HttpClient) {}
  uri = 'http://localhost:4000';
  dodajIzvestaj(igracF: string, trenerF: string, datumF: string, tekstF: string) {
    const data = {
      igracKorisnickoIme: igracF,
      trenerKorisnickoIme: trenerF,
      datum: datumF,
      tekst: tekstF,
    };
    return this.http.post<Message>(`${this.uri}/izvestaji/dodajIzvestaj`, data);
  }

  getIzvestajiIgraca(igracF: string) {
    const data = {
      igracKorisnickoIme: igracF,
    };
    return this.http.post<Izvestaj[]>(`${this.uri}/izvestaji/getIzvestajiIgraca`, data);
  }

  obrisiIzvestaj(idF: number) {
    const data = {
      id: idF,
    };
    return this.http.post<Message>(`${this.uri}/izvestaji/obrisiIzvestaj`, data);
  }
  procitaoIzvestaj(idF: number) {
    const data={
      id:idF
    }
    return this.http.post<Message>(`${this.uri}/izvestaji/procitaoIzvestaj`,data);
  }
}
