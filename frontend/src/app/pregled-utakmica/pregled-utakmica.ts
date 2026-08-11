import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { UtakmiceService } from '../services/utakmice-service';
import { Utakmica } from '../models/utakmica';
import { TreneriService } from '../services/treneri-service';
import { Trener } from '../models/trener';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pregled-utakmica',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './pregled-utakmica.html',
  styleUrls: ['../../styles.css', './pregled-utakmica.css'],
})
export class PregledUtakmica {
  constructor(
    private router: Router,
    private utakmiceService: UtakmiceService,
    private treneriService: TreneriService,
  ) {}

  ngOnInit() {
    this.korisnickoImeTrenera = sessionStorage.getItem('korisnickoImeT');
    if (this.korisnickoImeTrenera == null) {
      alert('Nije Vam dozvoljen pristup ovoj stranici');
      return;
    } else {
      this.treneriService.getTrenerKorisnickoIme(this.korisnickoImeTrenera).subscribe((data) => {
        this.trener = data;
        this.utakmiceService.getSezoneTrenera(this.trener.korisnickoIme).subscribe((sez) => {
          this.sezone = sez;
          if (this.sezone.length > 0) {
            const now = new Date();
            const nowMonth = now.getMonth();
            const nowYear = now.getFullYear();
            if (nowMonth >= 0 && nowMonth <= 5) {
              for (let i = 0; i < this.sezone.length; i++) {
                if (this.sezone[i] == nowYear - 1) {
                  this.izabranaSezona = this.sezone[i];
                  break;
                } else {
                  this.izabranaSezona = this.sezone[0];
                }
              }
            } else {
              for (let i = 0; i < this.sezone.length; i++) {
                if (this.sezone[i] == nowYear) {
                  this.izabranaSezona = this.sezone[i];
                  break;
                } else {
                  this.izabranaSezona = this.sezone[0];
                }
              }
            }
          } else {
            this.izabranaSezona = -1;
          }

          this.utakmiceService
            .getDateSortedAllUtakmice(this.trener.korisnickoIme)
            .subscribe((utakmice) => {
              this.utakmice = utakmice;
              this.primeniFilterSezone();
            });
        });
      });
    }
  }

  utakmice: Utakmica[] = [];
  ligaUtakmice: Utakmica[] = [];
  kupUtakmice: Utakmica[] = [];
  prijateljskeUtakmice: Utakmica[] = [];
  sortPravacLiga: string = 'asc';
  sortPravacKup: string = 'asc';
  sortPravacPrijateljske: string = 'asc';

  sezone: number[] = [];
  izabranaSezona: number = 0;

  korisnickoImeTrenera: string | null = '';
  trener: Trener = new Trener();

  primeniFilterSezone() {
    let filtrirane=null;
    if(this.izabranaSezona==-1){
     filtrirane=this.utakmice; 
    }else{
      filtrirane=this.utakmice.filter((u)=>u.sezonaPocetak==this.izabranaSezona)
    }
    this.ligaUtakmice = filtrirane.filter((u) => u.takmicenje == 'liga');
    this.prijateljskeUtakmice = filtrirane.filter((u) => u.takmicenje == 'prijateljska');
  }

  promeniSezonu() {
    this.primeniFilterSezone();
  }
/*
  sortirajPoDatumu() {
    this.utakmice.sort((a, b) => {
      const dA = new Date(a.datum).getTime();
      const dB = new Date(b.datum).getTime();
      return this.sortPravac === 'desc' ? dB - dA : dA - dB;
    });
  } */

  promeniSortLiga() {
    this.sortPravacLiga = this.sortPravacLiga === 'desc' ? 'asc' : 'desc';
     this.ligaUtakmice.sort((a, b) => {
      const dA = new Date(a.datum).getTime();
      const dB = new Date(b.datum).getTime();
      return this.sortPravacLiga === 'desc' ? dB - dA : dA - dB;
    });
  }
  promeniSortKup() {
    this.sortPravacKup = this.sortPravacKup === 'desc' ? 'asc' : 'desc';
     this.kupUtakmice.sort((a, b) => {
      const dA = new Date(a.datum).getTime();
      const dB = new Date(b.datum).getTime();
      return this.sortPravacKup === 'desc' ? dB - dA : dA - dB;
    });
  }
  promeniSortPrijateljske() {
    this.sortPravacPrijateljske = this.sortPravacPrijateljske === 'desc' ? 'asc' : 'desc';
     this.prijateljskeUtakmice.sort((a, b) => {
      const dA = new Date(a.datum).getTime();
      const dB = new Date(b.datum).getTime();
      return this.sortPravacPrijateljske === 'desc' ? dB - dA : dA - dB;
    });
  }

  pregled(utakmica: Utakmica) {
    sessionStorage.setItem('utakmica', JSON.stringify(utakmica.id));
    this.router.navigate(['/pregled-utakmica-detalji']);
  }

  logOut(){
   sessionStorage.clear();
    this.router.navigate(['']);
  }
   trenerPocetna(){
    this.router.navigate(['trener-pocetna']);
  }
}
