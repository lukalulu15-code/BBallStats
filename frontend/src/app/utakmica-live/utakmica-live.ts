import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { IgraciService } from '../services/igraci-service';
import { TreneriService } from '../services/treneri-service';
import { Trener } from '../models/trener';
import { Utakmica } from '../models/utakmica';
import { Igrac } from '../models/igrac';
import { CommonModule } from '@angular/common';
import { ProtivnickiIgraciService } from '../services/protivnicki-igraci-service';
import { ProtivnickiIgrac } from '../models/protivnickiIgrac';
import { StatistikaIgracaService } from '../services/statistika-igraca-service';
import { StatistikaIgraca } from '../models/statistkaIgraca';
import { firstValueFrom, Subject } from 'rxjs';
import { TajmerService } from '../services/tajmer-service';
import { UtakmiceService } from '../services/utakmice-service';

@Component({
  selector: 'app-utakmica-live',
  imports: [FormsModule, RouterOutlet, CommonModule],
  templateUrl: './utakmica-live.html',
  styleUrls: ['./utakmica-live.css', '../../styles.css'],
})
export class UtakmicaLive {
  constructor(
    private router: Router,
    private igraciService: IgraciService,
    private treneriService: TreneriService,
    private protivnickiIgraciService: ProtivnickiIgraciService,
    private statistikaIgracaService: StatistikaIgracaService,
    private tajmerService: TajmerService,
    private utakmicaService:UtakmiceService
  ) {}

  ngOnInit(): void {
    this.korisnickoImeTrenera = sessionStorage.getItem('korisnickoImeT');
    const utakmicaString = sessionStorage.getItem('utakmica');
    if (utakmicaString != null) {
      this.utakmica = JSON.parse(utakmicaString);
      if (this.utakmica != null) {
        this.utakmicaId = this.utakmica.id;
      }
    } else {
      this.utakmica = null;
    }
    if (this.korisnickoImeTrenera == null) {
      alert('Nije Vam dozvoljen pristup ovoj stranici');
      return;
    } else {
      this.treneriService.getTrenerKorisnickoIme(this.korisnickoImeTrenera).subscribe((data) => {
        this.trener = data;
        if (this.utakmica != null) {
          if (this.utakmica.domacin == this.trener.klub) {
            this.protivnik = this.utakmica.gost;
          } else {
            this.protivnik = this.utakmica.domacin;
          }
          this.protivnickiIgraciService.getAllProtivnickiKlub(this.protivnik).subscribe((data3) => {
            this.protivnickiIgraci = data3;
          });
          this.statistikaIgracaService
            .getIgraciKlubUtakmica(this.utakmica.id, this.trener.klub)
            .subscribe((data) => {
              this.igraciStatistikaUtakmicaNasi = data;
            });
          this.statistikaIgracaService
            .getIgraciKlubUtakmica(this.utakmicaId, this.protivnik)
            .subscribe((data) => {
              this.igraciStatistikaUtakmicaProtivnicki = data;
            });
        }
        this.igraciService.getAllIgraciTrenera(this.trener.korisnickoIme).subscribe((data2) => {
          this.brojNasihIgraca = data2.length;
          this.nasiIgraci = data2;
          while (this.cnt < 5) {
            this.terenIgraci.push(data2[this.cnt]);
            this.cnt++;
          }
          while (this.cnt >= 5 && this.cnt < data2.length) {
            this.klupaIgraci.push(data2[this.cnt]);
            this.cnt++;
          }
        });
      });
      this.protivnickiIgraciService.getAllProtivnickiIgraci().subscribe((data) => {
        this.sviProtivnickiIgraci = data;
      });
    }
    this.cetvrtina = this.tajmerService.cetvrtina;
  }

  korisnickoImeTrenera: string | null = '';
  trener: Trener = new Trener();
  utakmica: Utakmica | null = new Utakmica();
  igraci: Igrac[] = [];
  terenIgraci: Igrac[] = [];
  klupaIgraci: Igrac[] = [];
  brojNasihIgraca: number = 0;

  protivnickiIgraci: ProtivnickiIgrac[] = [];
  sviProtivnickiIgraci: ProtivnickiIgrac[] = [];
  nasiIgraci: Igrac[] = [];

  cnt: number = 0;

  nasRezultat: number = 0;
  cetvrtina: number = 0;
  tajmerAktivan: boolean = true;
  njihovRezultat: number = 0;
  protivnik: string = '';

  poruka: string = '';
  message: string = '';

  greska: string = '';

  idProtivnicki: number = 0;
  imeProtivnicki: string = '';
  prezimeProtivnicki: string = '';
  brojProtivnicki: number = 0;
  pozicijaProtivnicki: string = '';

  odabraniIgrac: any = null;
  dragIgrac: any = null;
  dragoverZona: string | null = null;
  pbpLog: any[] = [];

  noviIgrac: Igrac = new Igrac();

  selectFokus: boolean = false;

  utakmicaId: number = -1;
  igraciStatistikaUtakmicaNasi: StatistikaIgraca[] = [];
  igraciStatistikaUtakmicaProtivnicki: StatistikaIgraca[] = [];

  ubaciNasi: boolean = false;
  ubaciNjihovi: boolean = false;

  protivnikIdUredi: number = -1;
  protivnikImeUredi: string = '';
  protivnikPrezimeUredi: string = '';
  protivnikBrojUredi: number = 0;
  protivnikPozicijaUredi: string = '';

  pozicijeNasi = [
    { x: 110, y: 180 },
    { x: 185, y: 110 },
    { x: 185, y: 250 },
    { x: 255, y: 140 },
    { x: 255, y: 220 },
  ];

  pozicijeProtivnik = [
    { x: 530, y: 180 },
    { x: 455, y: 110 },
    { x: 455, y: 250 },
    { x: 385, y: 140 },
    { x: 385, y: 220 },
  ];

  obrisi(igracKorIme: string) {
    this.nasiIgraci = this.nasiIgraci.filter((igrac) => igrac.korisnickoIme != igracKorIme);
    if (this.utakmica != null) {
      this.statistikaIgracaService
        .deleteIgracUtakmica(igracKorIme, this.utakmica.id)
        .subscribe((msg) => {});
    }
    this.brojNasihIgraca--;
  }

  dodajProtivnickog() {
    //alert(this.protivnickiIgraci.length)
    /*
    if (this.protivnickiIgraci.length == 12 && this.utakmica?.takmicenje != 'prijateljska') {
      alert('Ne moze vise od 12 igraca');
      return;
    }*/

    let regexIme=/^[A-Z][a-zA-Z]+(?:['\s-][a-zA-Z]+)*$/;
     if(!regexIme.test(this.imeProtivnicki)){
       alert("Ime nije u ispravnom formatu");
       return;
     }
     let regexPrezime=/^[A-Z][a-zA-Z]+(?:['\s-][a-zA-Z]+)*$/;
     if(!regexPrezime.test(this.prezimeProtivnicki)){
       alert("Prezime nije u ispravnom formatu");
       return;
     }

    if (this.brojProtivnicki < 0 || this.brojProtivnicki > 99) {
      alert('Broj mora biti izmedju  0 i 99');
      return;
    }

    this.protivnickiIgraciService.getAllProtivnickiIgraci().subscribe((data) => {
      /*
      if (data.length == 0) {
        this.idProtivnicki = 1;
      } else {
        this.idProtivnicki = data[data.length - 1].id + 1;
      }
      
      for(let i=0;i<data.length;i++){
        if(data[i].broj==this.brojProtivnicki && data[i].klub==this.protivnik){
          alert("Broj " +  this.brojProtivnicki + "je zauzet");
          return
        }
      } */
      this.protivnickiIgraciService
        .addProtivnickiIgrac(
          this.imeProtivnicki,
          this.prezimeProtivnicki,
          this.protivnik,
          this.brojProtivnicki,
          this.pozicijaProtivnicki,
          this.utakmicaId,
        )
        .subscribe((data1) => {
          if (data1.message == 'ok') {
            this.protivnickiIgraciService
              .getAllProtivnickiKlub(this.protivnik)
              .subscribe((data3) => {
                this.protivnickiIgraci = data3;
              });
            alert('Uspešno ste registrovali novog igrača');
          }
        });
    });

    /*
    this.protivnickiIgraciService
      .getAllProtivnickiKlub(this.protivnik)
      .subscribe((protivnickiData) => {
        if (protivnickiData.length == 12 && this.utakmica?.takmicenje != 'prijateljska') {
          alert('Ne moze vise od 12 igraca');
          return;
        }
        for (let i = 0; i < protivnickiData.length; i++) {
          if (protivnickiData[i].broj == this.brojProtivnicki) {
            alert('Broj ' + this.brojProtivnicki + ' je zauzet');
            return;
          }
        }
        if (this.brojProtivnicki < 0 || this.brojProtivnicki > 99) {
          alert('Broj mora biti izmedju  0 i 99');
          return;
        }

        this.protivnickiIgraciService.getAllProtivnickiIgraci().subscribe((data) => {
          if (data.length == 0) {
            this.idProtivnicki = 1;
          } else {
            this.idProtivnicki = data[data.length - 1].id + 1;
          }
          this.protivnickiIgraciService
            .addProtivnickiIgrac(
              this.idProtivnicki,
              this.imeProtivnicki,
              this.prezimeProtivnicki,
              this.protivnik,
              this.brojProtivnicki,
              this.pozicijaProtivnicki,
              this.utakmicaId,
            )
            .subscribe((data1) => {
              if (data1.message == 'ok') {
                this.protivnickiIgraciService
                  .getAllProtivnickiKlub(this.protivnik)
                  .subscribe((data3) => {
                    this.protivnickiIgraci = data3;
                  });
                alert('Uspešno ste registrovali novog igrača');
                location.reload();
              }
            });
        });
      }); */
  }
  /*

   obrisiIgraca(korisnickoImeIgraca:string){
    this.igraciService.deleteIgrac(korisnickoImeIgraca).subscribe(resp=>{
      alert("Uspesno ste obrisali igraca");
      this.igraciService.getAllIgraciTrenera(this.trener.korisnickoIme).subscribe(data=>{
        this.sviIgraciTrenera=data;
      })
    })
    
   }

   */

  obrisiProtivnickog(id: number) {
  //  alert('pre ' + this.protivnickiIgraci.length);
    this.protivnickiIgraci = this.protivnickiIgraci.filter((igrac) => igrac.id != id);
 //   alert('posle' + this.protivnickiIgraci.length);
    if (this.utakmica != null) {
      this.statistikaIgracaService
        .deleteIgracUtakmica(JSON.stringify(id), this.utakmica.id)
        .subscribe((msg) => {});
    }
    /*
    this.protivnickiIgraciService.deleteIgrac(id).subscribe((resp) => {
      this.idProtivnicki--;
      this.protivnickiIgraciService.getAllProtivnickiKlub(this.protivnik).subscribe((data) => {
        this.protivnickiIgraci = data;
      });
    });
    */
  }

  // ─── DRAG & DROP ───

  async predjiNaUtakmicu() {
    if (this.nasiIgraci.length < 5) {
      alert('Izabrali ste manje od 5 svojih igraca');
      return;
    }
    if (this.nasiIgraci.length > 12) {
      alert('Izabrali ste vise od 12 svojih igraca');
      return;
    }
    if (this.protivnickiIgraci.length < 5) {
      alert('Izabrali ste manje od 5 protivnickih igraca');
      return;
    }
    if (this.protivnickiIgraci.length > 12) {
      alert('Izabrali ste vise od 12 protivnickih igraca');
      return;
    }

    this.utakmicaService.setStatus(this.utakmicaId,'u toku').subscribe(()=>{
      
    })

    for (let i = 0; i < this.protivnickiIgraci.length - 1; i++) {
      for (let j = i + 1; j < this.protivnickiIgraci.length; j++) {
        if (this.protivnickiIgraci[i].broj == this.protivnickiIgraci[j].broj) {
          alert(
            'Ne mogu dva igraca da imaju isti broj: ' +
              this.protivnickiIgraci[i].broj +
              ' (kod protivnika)',
          );
          this.protivnickiIgraci = await firstValueFrom(
            this.protivnickiIgraciService.getAllProtivnickiKlub(this.protivnik),
          );
          return;
        }
      }
    }

    for (let i = 0; i < this.nasiIgraci.length; i++) {
      // alert(i);
      this.ubaciNasi = true;
      for (let j = 0; j < this.igraciStatistikaUtakmicaNasi.length; j++) {
        if (this.nasiIgraci[i].korisnickoIme === this.igraciStatistikaUtakmicaNasi[j].id) {
          this.ubaciNasi = false;
          break;
        }
      }
      if (this.ubaciNasi) {
        // alert(this.nasiIgraci[i].korisnickoIme);
        if (i < 5) {
          await firstValueFrom(
            this.statistikaIgracaService.addIgracStatistika(
              this.nasiIgraci[i].korisnickoIme,
              this.utakmicaId,
              this.nasiIgraci[i].klub,
              this.nasiIgraci[i].ime,
              this.nasiIgraci[i].prezime,
              this.nasiIgraci[i].broj,
              '00:00',
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              true,
              true,
            ),
          );
        } else {
          await firstValueFrom(
            this.statistikaIgracaService.addIgracStatistika(
              this.nasiIgraci[i].korisnickoIme,
              this.utakmicaId,
              this.nasiIgraci[i].klub,
              this.nasiIgraci[i].ime,
              this.nasiIgraci[i].prezime,
              this.nasiIgraci[i].broj,
              '00:00',
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              false,
              false,
            ),
          );
        }
      }
      this.igraciStatistikaUtakmicaNasi = await firstValueFrom(
        this.statistikaIgracaService.getIgraciKlubUtakmica(this.utakmicaId, this.trener.klub),
      );
    }

    for (let i = 0; i < this.protivnickiIgraci.length; i++) {
      this.ubaciNjihovi = true;
      for (let j = 0; j < this.igraciStatistikaUtakmicaProtivnicki.length; j++) {
        if (
          JSON.stringify(this.protivnickiIgraci[i].id) ===
          this.igraciStatistikaUtakmicaProtivnicki[j].id
        ) {
          this.ubaciNjihovi = false;
          break;
        }
      }

      if (this.ubaciNjihovi == true && this.igraciStatistikaUtakmicaProtivnicki.length < 12) {
        if(i<5){
          this.statistikaIgracaService
          .addIgracStatistika(
            JSON.stringify(this.protivnickiIgraci[i].id),
            this.utakmicaId,
            this.protivnickiIgraci[i].klub,
            this.protivnickiIgraci[i].ime,
            this.protivnickiIgraci[i].prezime,
            this.protivnickiIgraci[i].broj,
            '00:00',
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            true,
            true
          )
          .subscribe((data) => {});
        }else{
          this.statistikaIgracaService
          .addIgracStatistika(
            JSON.stringify(this.protivnickiIgraci[i].id),
            this.utakmicaId,
            this.protivnickiIgraci[i].klub,
            this.protivnickiIgraci[i].ime,
            this.protivnickiIgraci[i].prezime,
            this.protivnickiIgraci[i].broj,
            '00:00',
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            false,
            false
          )
          .subscribe((data) => {});
        }
        
      }
    }
    sessionStorage.setItem('nasiIgraci', JSON.stringify(this.nasiIgraci));
    sessionStorage.setItem('protivnickiIgraci', JSON.stringify(this.protivnickiIgraci));
    this.router.navigate(['utakmica-live-krenula']);
  }

  urediProtivnickog(id: number) {
    this.protivnikIdUredi = id;
    this.protivnickiIgraciService.getProtivnickiIgracKorisnickoIme(id).subscribe((data) => {
      this.protivnikImeUredi = data.ime;
      this.protivnikPrezimeUredi = data.prezime;
      this.protivnikBrojUredi = data.broj;
      this.protivnikPozicijaUredi = data.pozicija;
    });
  }

  odustani() {
    this.protivnikIdUredi = -1;
  }

  izmeniProtivnikcog(id: number) {
    this.protivnickiIgraciService
      .updateIgracKorisnickoIme(
        id,
        this.protivnikImeUredi,
        this.protivnikPrezimeUredi,
        this.protivnikBrojUredi,
        this.protivnikPozicijaUredi,
      )
      .subscribe((data) => {
        if (data.message == 'ok') {
          alert('Uspesno ste azurirali');
          location.reload();
        }
      });
  } 
  logOut(){
   sessionStorage.clear();
    this.router.navigate(['']);
  }
   trenerPocetna(){
    this.router.navigate(['trener-pocetna']);
  }
}
