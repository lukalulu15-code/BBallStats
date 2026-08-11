import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Igrac } from '../models/igrac';
import { IgraciService } from '../services/igraci-service';
import { IzvestajService } from '../services/izvestaj-service';
import { Izvestaj } from '../models/izvestaj';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trener-izvestaj',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './trener-izvestaj.html',
  styleUrls: ['../../styles.css', './trener-izvestaj.css'],
})
export class TrenerIzvestaj implements OnInit {
  constructor(
    private router:Router,
    private igracService: IgraciService,
    private izvestajService: IzvestajService,
  ) {}

  ngOnInit(): void {
    this.igracKorisnickoIme = sessionStorage.getItem('igrac');
    this.trenerKorisnickoIme = sessionStorage.getItem('korisnickoImeT');

    if (this.igracKorisnickoIme != null) {
      this.igracService.getIgracKorisnickoIme(this.igracKorisnickoIme).subscribe((ig) => {
        this.igrac = ig;
      });
      this.izvestajService.getIzvestajiIgraca(this.igracKorisnickoIme).subscribe((data) => {
        this.izvestaji = data;
        this.izvestaji.forEach((i) => {
          i.otvoren = false;
        });
      });
    }
  }

  igracKorisnickoIme: string | null = '';
  trenerKorisnickoIme: string | null = '';
  igrac: Igrac = new Igrac();

  noviIzvestaj: string = '';
  izvestaji: Izvestaj[] = [];
  message: string = '';

  sacuvajIzvestaj() {
    if (this.noviIzvestaj.trim() === '') {
      this.message = 'Izveštaj ne može biti prazan';
      return;
    }
    if (this.igracKorisnickoIme == null || this.trenerKorisnickoIme == null) return;

    const danas = new Date();
    const datum = `${danas.getFullYear()}-${(danas.getMonth() + 1).toString().padStart(2, '0')}-${danas.getDate().toString().padStart(2, '0')}`;

    this.izvestajService
      .dodajIzvestaj(this.igracKorisnickoIme, this.trenerKorisnickoIme, datum, this.noviIzvestaj)
      .subscribe(() => {
        this.noviIzvestaj = '';
        this.message = 'Izveštaj je sačuvan';
        this.izvestajService.getIzvestajiIgraca(this.igrac.korisnickoIme).subscribe((data) => {
          this.izvestaji = data;
          this.izvestaji.forEach((i) => {
            i.otvoren = false;
          });
        });
      });
  }

  obrisiIzvestaj(id: number) {
    this.izvestajService.obrisiIzvestaj(id).subscribe(() => {
      this.izvestajService.getIzvestajiIgraca(this.igrac.korisnickoIme).subscribe((data) => {
        this.izvestaji = data;
        this.izvestaji.forEach((i) => {
          i.otvoren = false;
        });
      });
    });
  }
  otvoriIzvestaj(izvestaj:Izvestaj) {
    izvestaj.otvoren = !izvestaj.otvoren;
  }
  logOut(){
   sessionStorage.clear();
    this.router.navigate(['']);
  }
   trenerPocetna(){
    this.router.navigate(['trener-pocetna']);
  }
  trenerIgraci(){
    this.router.navigate(['trener-igraci']);
  }
}
