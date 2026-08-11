import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { ProtivnickiIgrac } from '../models/protivnickiIgrac';

@Injectable({
  providedIn: 'root',
})
export class ProtivnickiIgraciService {
  constructor(private http:HttpClient) { }
  uri='http://localhost:4000';

   addProtivnickiIgrac(imeF:string,prezimeF:string,klubF:string,brojF:number,pozicijaF:string,utakmicaIdF:number){
      const data = {
        ime:imeF,
        prezime:prezimeF,
        klub:klubF,
        broj:brojF,
        pozicija:pozicijaF,
        utakmicaId:utakmicaIdF
      }
      return this.http.post<Message>(`${this.uri}/protivnickiIgraci/addProtivnickiIgrac`,data)
    }
  
    getAllProtivnickiIgraci(){
      return this.http.get<ProtivnickiIgrac[]>(`${this.uri}/protivnickiIgraci/getAllProtivnicki`)
    }

    getAllProtivnickiKlub(klubF:string){
      const data={
        klub:klubF
      }
      return this.http.post<ProtivnickiIgrac[]>(`${this.uri}/protivnickiIgraci/getAllProtivnickiKlub`,data)
    }

     deleteIgrac(idF:number){
    const data={
      id:idF
    }
    return this.http.post(`${this.uri}/protivnickiIgraci/deleteProtivnicki`,data)
  }

   getProtivnickiIgracKorisnickoIme(idF:number){
      const data={
        id:idF
      }
      return this.http.post<ProtivnickiIgrac>(`${this.uri}/protivnickiIgraci/getProtivnickiIgracKorisnickoIme`,data)
    }
  
    updateIgracKorisnickoIme(idF:number,imeF:string,prezimeF:string,brojF:number,pozicijaF:string){
      const data={
        id:idF,
        ime:imeF,
        prezime:prezimeF,
        broj:brojF,
        pozicija:pozicijaF,
      }
      return this.http.post<Message>(`${this.uri}/protivnickiIgraci/updateProtivnickiIgracKorisnickoIme`,data)
    }

}
