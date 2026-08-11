import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { DefaultSlika } from '../models/defaultSlika';

@Injectable({
  providedIn: 'root'
})
export class DefaultSlikaService {

  constructor(private http:HttpClient) { }
  uri='http://localhost:4000';

  addDefaultSlika(slikaF:string){
    const data={
      slika:slikaF
    }
    return this.http.post<Message>(`${this.uri}/defaultSlika/addDefaultSlika`,data)
  }
  getDefaultSlika(){
    return this.http.get<DefaultSlika>(`${this.uri}/defaultSlika/getDefaultSlika`)
  }

}
