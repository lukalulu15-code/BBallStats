import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utakmica } from '../models/utakmica';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class UtakmiceService {
  constructor(private http: HttpClient) {}
  uri = 'http://localhost:4000';
  getUtakmica(idF: number) {
    const data = {
      id: idF,
    };
    return this.http.post<Utakmica>(`${this.uri}/utakmice/getUtakmica`, data);
  }

  updatePoeniUtakmicaDomacin(idF: number,poeniDomacinF:number) {
    const data = {
      id: idF,
      poeniDomacin:poeniDomacinF
    };
    return this.http.post<Message>(`${this.uri}/utakmice/updatePoeniUtakmicaDomacin`, data);
  }

   updatePoeniUtakmicaGost(idF: number,poeniGostF:number) {
    const data = {
      id: idF,
      poeniGost:poeniGostF
    };
    return this.http.post<Message>(`${this.uri}/utakmice/updatePoeniUtakmicaGost`, data);
  }

  addUtakmica(domacinF:string, gostF:string, datumF:string, vremeF:string, takmicenjeF:string,trenerF:string,napomenaF:string,vremeTajmerF:number,cetvrtinaF:number,tajmerRadiF:boolean,poslednjiUpdateF:Date){
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
      poslednjiUpdate:poslednjiUpdateF
    }
    return this.http.post<Message>(`${this.uri}/utakmice/addUtakmica`,data)
  }
  getAllUtakmice(trenerF:string){
    const data={
      trener:trenerF
    }
    return this.http.post<Utakmica[]>(`${this.uri}/utakmice/getAllUtakmice`,data);
  }
  getAllUtakmiceZavrsene(trenerF:string){
    const data={
      trener:trenerF
    }
    return this.http.post<Utakmica[]>(`${this.uri}/utakmice/getAllUtakmiceZavrsene`,data);
  }
  getDateSortedAllUtakmice(trenerF:string){
    const data={
      trener:trenerF
    }
    return this.http.post<Utakmica[]>(`${this.uri}/utakmice/getDateSortedAllUtakmice`,data);
  }

  updateTajmer(idF: number, vremeTajmerF: number, cetvrtinaF: number, tajmerRadiF: boolean) {
    const data={
      id:idF,
      vremeTajmer:vremeTajmerF,
      cetvrtina:cetvrtinaF,
      tajmerRadi:tajmerRadiF
    }
  return this.http.post(`${this.uri}/utakmice/updateTajmer`, data);
}
 zavrsiUtakmicu(idF: number, ishodF:string) {
    const data = {
      id: idF,
      ishod: ishodF
    };
    return this.http.post<Message>(`${this.uri}/utakmice/zavrsiUtakmicu`, data);
  }

  setStatus(idF: number, statusF:string) {
    const data = {
      id: idF,
      status: statusF
    };
    return this.http.post<Message>(`${this.uri}/utakmice/setStatus`, data);
  }

  updateTrener(staroKorisnickoImeF: string, novoKorisnickoImeF: string) {
  const data = {
    staroKorisnickoIme: staroKorisnickoImeF,
    novoKorisnickoIme: novoKorisnickoImeF,
  };
  return this.http.post<Message>(`${this.uri}/utakmice/updateTrener`, data);
}

deleteUtakmica(idF: number) {
  const data={
    id:idF
  }
  return this.http.post<Message>(`${this.uri}/utakmice/deleteUtakmica`, data);
}

getUtakmiceSezone(trenerF: string, sezonaPocetakF: number) {
  const data ={
     trener: trenerF,
    sezonaPocetak: sezonaPocetakF
  }
  return this.http.post<Utakmica[]>(`${this.uri}/utakmice/getUtakmiceSezone`,data);
}

getSezoneTrenera(trenerF: string) {
  const data={
    trener: trenerF
  }
  return this.http.post<number[]>(`${this.uri}/utakmice/getSezoneTrenera`, data);
}

}
