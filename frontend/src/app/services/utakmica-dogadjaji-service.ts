import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtakmicaDogadjaji } from '../models/utakmicaDogadjaji';
import { Message } from '../models/message';
import { StatistikaIgraca } from '../models/statistkaIgraca';

@Injectable({
  providedIn: 'root',
})
export class UtakmicaDogadjajiService {
  constructor(private http: HttpClient) {}
  uri = 'http://localhost:4000';


   getAllDogadjaji(utakmicaIdF:number) {
    const data={
      utakmicaId:utakmicaIdF
    }
    return this.http.post<UtakmicaDogadjaji[]>(
      `${this.uri}/utakmicaDogadjaji/getAllDogadjaji`,data
    );
  }
  getAllDogadjajiCetvrtina(utakmicaIdF: number, cetvrtinaF: number) {
    const data = {
      utakmicaId: utakmicaIdF,
      cetvrtina: cetvrtinaF,
    };
    return this.http.post<UtakmicaDogadjaji[]>(
      `${this.uri}/utakmicaDogadjaji/getAllDogadjajiCetvrtina`,
      data,
    );
  }
  getAllDogadjajiProduzeci(utakmicaIdF: number) {
    const data = {
      utakmicaId: utakmicaIdF,
    };
    return this.http.post<UtakmicaDogadjaji[]>(
      `${this.uri}/utakmicaDogadjaji/getAllDogadjajiProduzeci`,
      data,
    );
  }

  deleteDogadjaj(idF: number, utakmicaIdF: number) {
    const data = {
      id: idF,
      utakmicaId: utakmicaIdF,
    };
    return this.http.post<Message>(`${this.uri}/utakmicaDogadjaji/deleteDogadjaj`, data);
  }

  addDogadjaj(
    utakmicaIdF: number,
    domacinF: string,
    gostF: string,
    vremeF: string,
    cetvrtinaF: number,
    poeniDomacinF: number,
    poeniGostF: number,
    opisF: string,
    klubF: string,
    imeIgracaF: string,
    prezimeIgracaF: string,
    brojIgracaF: number,
    igracF:StatistikaIgraca | null
  ) {
    const data = {
      utakmicaId: utakmicaIdF,
      domacin: domacinF,
      gost: gostF,
      vreme: vremeF,
      cetvrtina: cetvrtinaF,
      poeniDomacin: poeniDomacinF,
      poeniGost: poeniGostF,
      opis: opisF,
      klub: klubF,
      imeIgraca: imeIgracaF,
      prezimeIgraca: prezimeIgracaF,
      brojIgraca: brojIgracaF,
      igrac:igracF
    };
    return this.http.post<Message>(`${this.uri}/utakmicaDogadjaji/addDogadjaj`, data);
  }
  updateKorisnickoIme(idF: string, novoKorisnickoImeF:string) {
    const data = {
      id: idF,
      novoKorisnickoIme:novoKorisnickoImeF
    };
    return this.http.post<Message>(`${this.uri}/utakmicaDogadjaji/updateKorisnickoIme`, data);
  }
   updateIgracIme(idF: string, imeF:string) {
    const data = {
      id: idF,
      ime:imeF
    };
    return this.http.post<Message>(`${this.uri}/utakmicaDogadjaji/updateIgracIme`, data);
  }
  updateIgracPrezime(idF: string, prezimeF:string) {
    const data = {
      id: idF,
      prezime:prezimeF
    };
    return this.http.post<Message>(`${this.uri}/utakmicaDogadjaji/updateIgracPrezime`, data);
  }
}
