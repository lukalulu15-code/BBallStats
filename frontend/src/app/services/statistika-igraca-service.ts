import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { StatistikaIgraca } from '../models/statistkaIgraca';

@Injectable({
  providedIn: 'root',
})
export class StatistikaIgracaService {
  constructor(private http: HttpClient) {}
  uri = 'http://localhost:4000';
  addIgracStatistika(
    idF: string,
    utakmicaIdF: number,
    klubF: string,
    imeF: string,
    prezimeF: string,
    brojF: number,
    minutiF: string,
    poeniF: number,
    dvaPoenaPogodakF: number,
    dvaPoenaPromasajF: number,
    dvaPoenaProcenatF: number,
    triPoenaPogodakF: number,
    triPoenaPromasajF: number,
    triPoenaProcenatF: number,
    slobodnoPogodakF: number,
    slobodnoPromasajF: number,
    slobodnoProcenatF: number,
    skokoviNapadF: number,
    skokoviOdbranaF: number,
    skokoviUkupnoF: number,
    asistencijeF: number,
    ukradeneF: number,
    izgubljeneF: number,
    blokadeF: number,
    blkokadePrimljeneF: number,
    licneGreskeF: number,
    iznudjeniFauloviF: number,
    indeksF: number,
    plusMinusF: number,
    terenF:boolean,
    starterF:boolean
  ) {
    const data = {
      id: idF,
      utakmicaId: utakmicaIdF,
      klub: klubF,
      ime: imeF,
      prezime: prezimeF,
      broj: brojF,
      minuti: minutiF,
      poeni: poeniF,
      dvaPoenaPogodak: dvaPoenaPogodakF,
      dvaPoenaPromasaj: dvaPoenaPromasajF,
      dvaPoenaProcenat: dvaPoenaProcenatF,
      triPoenaPogodak: triPoenaPogodakF,
      triPoenaPromasaj: triPoenaPromasajF,
      triPoenaProcenat: triPoenaProcenatF,
      slobodnoPogodak: slobodnoPogodakF,
      slobodnoPromasaj: slobodnoPromasajF,
      slobodnoProcenat: slobodnoProcenatF,
      skokoviNapad: skokoviNapadF,
      skokoviOdbrana: skokoviOdbranaF,
      skokoviUkupno: skokoviUkupnoF,
      asistencije: asistencijeF,
      ukradene: ukradeneF,
      izgubljene: izgubljeneF,
      blokade: blokadeF,
      blokokadePrimljene: blkokadePrimljeneF,
      licneGreske: licneGreskeF,
      iznudjeniFaulovi: iznudjeniFauloviF,
      indeks: indeksF,
      plusMinus: plusMinusF,
      teren:terenF,
      starter:starterF
    };
    return this.http.post<Message>(`${this.uri}/statistikaIgraca/addIgracStatistika`, data);
  }

  updateIgracStatistika(
    idF: string,
    utakmicaIdF: number,
    //minutiF: number,
    poeniF: number,
    dvaPoenaPogodakF: number,
    dvaPoenaPromasajF: number,
    dvaPoenaProcenatF: number,
    triPoenaPogodakF: number,
    triPoenaPromasajF: number,
    triPoenaProcenatF: number,
    slobodnoPogodakF: number,
    slobodnoPromasajF: number,
    slobodnoProcenatF: number,
    skokoviNapadF: number,
    skokoviOdbranaF: number,
    skokoviUkupnoF: number,
    asistencijeF: number,
    ukradeneF: number,
    izgubljeneF: number,
    blokadeF: number,
    blkokadePrimljeneF: number,
    licneGreskeF: number,
    iznudjeniFauloviF: number,
    indeksF: number,
    plusMinusF: number,
  ) {
    const data = {
      id: idF,
      utakmicaId: utakmicaIdF,
    //  minuti: minutiF,
      poeni: poeniF,
      dvaPoenaPogodak: dvaPoenaPogodakF,
      dvaPoenaPromasaj: dvaPoenaPromasajF,
      dvaPoenaProcenat: dvaPoenaProcenatF,
      triPoenaPogodak: triPoenaPogodakF,
      triPoenaPromasaj: triPoenaPromasajF,
      triPoenaProcenat: triPoenaProcenatF,
      slobodnoPogodak: slobodnoPogodakF,
      slobodnoPromasaj: slobodnoPromasajF,
      slobodnoProcenat: slobodnoProcenatF,
      skokoviNapad: skokoviNapadF,
      skokoviOdbrana: skokoviOdbranaF,
      skokoviUkupno: skokoviUkupnoF,
      asistencije: asistencijeF,
      ukradene: ukradeneF,
      izgubljene: izgubljeneF,
      blokade: blokadeF,
      blokokadePrimljene: blkokadePrimljeneF,
      licneGreske: licneGreskeF,
      iznudjeniFaulovi: iznudjeniFauloviF,
      indeks: indeksF,
      plusMinus: plusMinusF,
    };
    return this.http.post<Message>(`${this.uri}/statistikaIgraca/updateIgracStatistika`, data);
  }

  getIgraciKlubUtakmica(utakmicaIdF: number, klubF: string) {
    const data = {
      utakmicaId: utakmicaIdF,
      klub: klubF,
    };
    return this.http.post<StatistikaIgraca[]>(`${this.uri}/statistikaIgraca/getIgraciKlubUtakmica`,data);
  }

  deleteIgracUtakmica(idF: string, utakmicaIdF: number) {
    const data = {
      id: idF,
      utakmicaId: utakmicaIdF,
    };
    return this.http.post(`${this.uri}/statistikaIgraca/deleteIgracUtakmica`, data);
  }

  getIgracUtakmica(idF: string, utakmicaIdF: number) {
    const data = {
      id: idF,
      utakmicaId: utakmicaIdF,
    };
    return this.http.post<StatistikaIgraca>(`${this.uri}/statistikaIgraca/getIgracUtakmica`, data);
  }

  getIgracStatistika(idF: string) {
    const data = {
      id: idF
    };
    return this.http.post<StatistikaIgraca[]>(`${this.uri}/statistikaIgraca/getIgracStatistika`, data);
  }

  updateIgracTeren(idF:string,utakmicaIdF:number,terenF:boolean){
    const data={
      id: idF,
      utakmicaId: utakmicaIdF,
      teren:terenF
    };
    return this.http.post<Message>(`${this.uri}/statistikaIgraca/updateIgracTeren`, data);
  }
   updateIgracStarter(idF:string,utakmicaIdF:number,starterF:boolean){
    const data={
      id: idF,
      utakmicaId: utakmicaIdF,
      starter:starterF
    };
    return this.http.post<Message>(`${this.uri}/statistikaIgraca/updateIgracStarter`, data);
  }

  getIgraciKlubUtakmicaKlupa(utakmicaIdF: number, klubF: string) {
    const data = {
      utakmicaId: utakmicaIdF,
      klub: klubF,
    };
    return this.http.post<StatistikaIgraca[]>(`${this.uri}/statistikaIgraca/getIgraciKlubUtakmicaKlupa`,data);
  }
  getIgraciKlubUtakmicaTeren(utakmicaIdF: number, klubF: string) {
    const data = {
      utakmicaId: utakmicaIdF,
      klub: klubF,
    };
    return this.http.post<StatistikaIgraca[]>(`${this.uri}/statistikaIgraca/getIgraciKlubUtakmicaTeren`,data);
  }

  updateIgracMinuti(idF:string,utakmicaIdF:number,minutiF:string){
    const data={
      id: idF,
      utakmicaId: utakmicaIdF,
      minuti:minutiF
    };
    return this.http.post<Message>(`${this.uri}/statistikaIgraca/updateIgracMinuti`, data);
  }

  updateIgracPlusMinus(idF:string,utakmicaIdF:number,plusMinusF:number){
    const data={
      id: idF,
      utakmicaId: utakmicaIdF,
      plusMinus:plusMinusF
    };
    return this.http.post<Message>(`${this.uri}/statistikaIgraca/updateIgracPlusMinus`, data);
  }
  updateIgracIme(idF:string,imeF:string){
    const data={
      id: idF,
      ime:imeF
    };
    return this.http.post<Message>(`${this.uri}/statistikaIgraca/updateIgracIme`, data);
  }
  updateIgracPrezime(idF:string,prezimeF:string){
    const data={
      id: idF,
      prezime:prezimeF
    };
    return this.http.post<Message>(`${this.uri}/statistikaIgraca/updateIgracPrezime`, data);
  }
  updateKorisnickoIme(idF:string,novoKorisnickoImeF:string){
    const data={
      id: idF,
      novoKorisnickoIme:novoKorisnickoImeF
    };
    return this.http.post<Message>(`${this.uri}/statistikaIgraca/updateKorisnickoIme`, data);
  }

}
