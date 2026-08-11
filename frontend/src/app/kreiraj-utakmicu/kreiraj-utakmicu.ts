import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { TreneriService } from '../services/treneri-service';
import { Trener } from '../models/trener';
import { Utakmica } from '../models/utakmica';

@Component({
  selector: 'app-kreiraj-utakmicu',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './kreiraj-utakmicu.html',
  styleUrls: ['./kreiraj-utakmicu.css', '../../styles.css'],
})
export class KreirajUtakmicu implements OnInit {
  constructor(
    private router: Router,
    private treneriService: TreneriService,
  ) {}
  ngOnInit(): void {
    this.korisnickoImeTrenera = sessionStorage.getItem('korisnickoImeT');
    if (this.korisnickoImeTrenera == null) {
      alert('Nije Vam dozvoljen pristup ovoj stranici');
      return;
    } else {
      this.treneriService.getTrenerKorisnickoIme(this.korisnickoImeTrenera).subscribe((data) => {
        this.trener = data;
      });
      this.treneriService.getAllUtakmice(this.korisnickoImeTrenera).subscribe((data) => {
        this.sveUtakmiceTrenera = data;
        const d = new Date();
        const godina = d.getFullYear();
        const mesec = (d.getMonth() + 1).toString().padStart(2, '0');
        const dan = d.getDate().toString().padStart(2, '0');
        this.danasnjiDatum = `${godina}-${mesec}-${dan}`;
      });
    }
  }

  idUtakmice: number = 0;
  protivnik: string = '';
  datum: string = '';
  vreme: string = '';
  mesto: string = 'domacin';
  takmicenje: string = '';
  napomena: string = '';
  greske: any = {};
  korisnickoImeTrenera: string | null = '';
  trener: Trener = new Trener();
  domacin: string = '';
  gost: string = '';
  sveUtakmiceTrenera: Utakmica[] = [];
  danasnjiDatum: string = '';

  kreirajUtakmicu() {
    if (!this.protivnik.trim()) {
      alert('Neispravno ste uneli ime protivnika');
      this.greske['protivnik'] = true;
      return;
    } else if (this.datum == '') {
      alert('Morate uneti datum odigravanja utakmice');
      this.greske['datum'] = true;
      return;
    } else if (this.takmicenje == '') {
      alert('Morate uneti takmičenje');
      this.greske['takmicenje'] = true;
      return;
    } else if (this.vreme == '') {
      alert('Morate uneti vreme');
      this.greske['vreme'] = true;
      return
    }

    let godina = parseInt(this.datum.substring(0, 4), 10);
    let mesec = parseInt(this.datum.substring(5, 7), 10);
    let dan = parseInt(this.datum.substring(8, 10), 10);
    let sat = parseInt(this.vreme.substring(0, 2), 10);
    let minut = parseInt(this.vreme.substring(3, 5), 10);

    let sezonaPocetak=0;
    let sezonaKraj=0;

    if(mesec>=7){
      sezonaPocetak=godina;
      sezonaKraj=godina+1
    }else{
      sezonaPocetak=godina-1;
      sezonaKraj=godina;
    }

    let zakazano = new Date(godina, mesec - 1, dan, sat, minut);
    let sada = new Date();

    if (zakazano < sada) {
      alert('Ne možete zakazati utakmicu u prošlosti');
      return;
    }

    this.treneriService.getAllUtakmice(this.trener.korisnickoIme).subscribe((data) => {
      this.sveUtakmiceTrenera = data;
      for (let i = 0; i < this.sveUtakmiceTrenera.length; i++) {
        const godinaDb = parseInt(this.sveUtakmiceTrenera[i].datum.substring(0, 4), 10);
        const mesecDb = parseInt(this.sveUtakmiceTrenera[i].datum.substring(5, 7), 10);
        const danDb = parseInt(this.sveUtakmiceTrenera[i].datum.substring(8, 10), 10);
        const satDb = parseInt(this.sveUtakmiceTrenera[i].vreme.substring(0, 2), 10);
        const minutDb = parseInt(this.sveUtakmiceTrenera[i].vreme.substring(3, 5), 10);
        const dateDb = new Date(godinaDb, mesecDb - 1, danDb, satDb, minutDb);

        // razlika u milisekundama
        const razlika = Math.abs(zakazano.getTime() - dateDb.getTime());

        if (razlika < 3 * 60 * 60 * 1000) {
          alert('Utakmica mora biti zakazana sa najmanje 3 sata razmaka u odnosu na drugu');
          return;
        }
      }
      if (this.mesto == 'domacin') {
        this.domacin = this.trener.klub;
        this.gost = this.protivnik;
      } else {
        this.domacin = this.protivnik;
        this.gost = this.trener.klub;
      }
      this.treneriService
        .addUtakmica(
          this.domacin,
          this.gost,
          this.datum,
          this.vreme,
          this.takmicenje,
          this.trener.korisnickoIme,
          this.napomena,
          600,
          1,
          false,
          null,
          sezonaPocetak,
          sezonaKraj
        )
        .subscribe((data) => {
          if (data.message == 'ok') {
            alert('Uspesno ste kreirali utakmicu');
            location.reload();
          }
        });
    });

  }

  otkazi() {
    this.router.navigate(['/trener']);
  }
  logOut() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }
  trenerPocetna() {
    this.router.navigate(['trener-pocetna']);
  }
}
