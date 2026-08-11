import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IgraciService } from '../services/igraci-service';
import { TreneriService } from '../services/treneri-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Trener } from '../models/trener';
import { Utakmica } from '../models/utakmica';
import { UtakmiceService } from '../services/utakmice-service';
import { StatistikaIgracaService } from '../services/statistika-igraca-service';
import { Igrac } from '../models/igrac';
import { StatistikaIgraca } from '../models/statistkaIgraca';
import { ProtivnickiIgrac } from '../models/protivnickiIgrac';
import { ProtivnickiIgraciService } from '../services/protivnicki-igraci-service';

@Component({
  selector: 'app-trener-pocetna',
  imports: [FormsModule, RouterOutlet, CommonModule],
  templateUrl: './trener-pocetna.html',
  styleUrls: ['./trener-pocetna.css', '../../styles.css'],
})
export class TrenerPocetna {
  constructor(
    private router: Router,
    private igraciService: IgraciService,
    private treneriService: TreneriService,
    private utakmiceService: UtakmiceService,
    private statistikaIgracaService: StatistikaIgracaService,
    private protivnickiIgraciService: ProtivnickiIgraciService,
  ) {}

  ngOnInit(): void {
    this.korisnickoImeTrenera = sessionStorage.getItem('korisnickoImeT');
    if (this.korisnickoImeTrenera == null) {
      alert('Nije Vam dozvoljen pristup ovoj stranici');
      return;
    } else {
      this.treneriService
        .getTrenerKorisnickoIme(this.korisnickoImeTrenera)
        .subscribe((dataTrener) => {
          console.log('Ime u sesiji:', this.korisnickoImeTrenera);
          console.log('Vraćen trener:', dataTrener);
          this.trener = dataTrener;
          this.treneriService
            .getDateSortedAllUtakmice(this.trener.korisnickoIme)
            .subscribe((dataUtakmice) => {
              this.igraciService
                .getAllIgraciTrenera(this.trener.korisnickoIme)
                .subscribe((dataIgraci) => {
                  for (let i = 0; i < dataIgraci.length; i++) {
                    this.brojIgraca++;
                  }
                });
              for (let i = 0; i < dataUtakmice.length; i++) {
                let utakmica = dataUtakmice[i];
                let datum = dataUtakmice[i].datum;
                let vreme = dataUtakmice[i].vreme;
                let date = new Date(
                  parseInt(datum.substring(0, 4), 10),
                  parseInt(datum.substring(5, 7), 10) - 1,
                  parseInt(datum.substring(8), 10),
                  parseInt(vreme.substring(0, 2), 10),
                  parseInt(vreme.substring(3), 10),
                );
                let now = new Date();
                if (date < now) {
                  this.utakmiceProslost.push(utakmica);
                  this.brojOdigranih++;
                  if (utakmica.status == 'pobeda') {
                    this.brojPobeda++;
                  }
                  if (i == dataUtakmice.length - 1) {
                    this.sledecaUtakmica = null;
                  }
                } else if (
                  now.getDate() == parseInt(datum.substring(8, 10), 10) &&
                  now.getFullYear() == parseInt(datum.substring(0, 4), 10) &&
                  now.getMonth() == parseInt(datum.substring(5, 7), 10) - 1
                ) {
                  if (this.cnt == 0) {
                    this.sledecaUtakmica = dataUtakmice[i];
                    if (dataUtakmice[i].domacin == this.trener.klub) {
                      this.naredniProtivnik = dataUtakmice[i].gost;
                    } else {
                      this.naredniProtivnik = dataUtakmice[i].domacin;
                      this.gostujemo = true;
                    }
                  }
                  this.utakmiceDanas.push(utakmica);
                  this.cnt++;
                } else {
                  if (this.cnt == 0) {
                    this.sledecaUtakmica = dataUtakmice[i];
                    if (dataUtakmice[i].domacin == this.trener.klub) {
                      this.naredniProtivnik = dataUtakmice[i].gost;
                    } else {
                      this.naredniProtivnik = dataUtakmice[i].domacin;
                      this.gostujemo = true;
                    }
                  }
                  this.utakmiceBuducnost.push(utakmica);
                  this.cnt++;
                }
              }
            });
        });
    }
  }
  utakmiceDanas: Utakmica[] = [];
  utakmiceProslost: Utakmica[] = [];
  utakmiceBuducnost: Utakmica[] = [];
  sledecaUtakmica: Utakmica | null = new Utakmica();
  korisnickoImeTrenera: string | null = '';
  brojIgraca: number = 0;
  brojPobeda: number = 0;
  poslednjeUtakmice: any[] = [];
  trener: Trener = new Trener();

  naredniProtivnik: string = '';
  gostujemo: boolean = false;

  cnt: number = 0;
  brojOdigranih: number = 0;

  zapocniUtakmicu(utakmica: Utakmica) {
    sessionStorage.setItem('utakmica', JSON.stringify(utakmica));
    this.router.navigate(['utakmica-live']);
  }

  urediUtakmicu(utakmica: Utakmica) {
    sessionStorage.setItem('utakmica', JSON.stringify(utakmica));
    if (this.trener.klub == utakmica.domacin) {
      let domaciNasiStats: StatistikaIgraca[] = [];
      let domaciNasi: Igrac[] = [];
      let gostiProtivnikStats: StatistikaIgraca[] = [];
      let gostiProtivnik: ProtivnickiIgrac[] = [];
      this.statistikaIgracaService
        .getIgraciKlubUtakmica(utakmica.id, utakmica.domacin)
        .subscribe((domaciStats) => {
          this.statistikaIgracaService
            .getIgraciKlubUtakmica(utakmica.id, utakmica.gost)
            .subscribe((gostiStats) => {
              domaciNasiStats = domaciStats;
              gostiProtivnikStats = gostiStats;
              let ukupno = domaciNasiStats.length + gostiProtivnikStats.length;
              let zavrseno = 0;
              const proveriZavrseno = () => {
                zavrseno++;
                if (zavrseno === ukupno) {
                  sessionStorage.setItem('nasiIgraci', JSON.stringify(domaciNasi));
                  sessionStorage.setItem('protivnickiIgraci', JSON.stringify(gostiProtivnik));
                  this.router.navigate(['utakmica-live-krenula']);
                }
              };

              if (ukupno === 0) {
                sessionStorage.setItem('nasiIgraci', JSON.stringify(domaciNasi));
                sessionStorage.setItem('protivnickiIgraci', JSON.stringify(gostiProtivnik));
                this.router.navigate(['utakmica-live-krenula']);
                return;
              }

              for (let i = 0; i < domaciNasiStats.length; i++) {
                this.igraciService
                  .getIgracKorisnickoIme(domaciNasiStats[i].id)
                  .subscribe((data) => {
                    domaciNasi.push(data);
                    proveriZavrseno();
                  });
              }
              for (let j = 0; j < gostiProtivnikStats.length; j++) {
                this.protivnickiIgraciService
                  .getProtivnickiIgracKorisnickoIme(parseInt(gostiProtivnikStats[j].id))
                  .subscribe((data) => {
                    gostiProtivnik.push(data);
                    proveriZavrseno();
                  });
              }
            });
        });
    } else if (this.trener.klub == utakmica.gost) {
      let domaciProtivnikStats: StatistikaIgraca[] = [];
      let domaciProtivnik: ProtivnickiIgrac[] = [];
      let gostiNasiStats: StatistikaIgraca[] = [];
      let gostiNasi: Igrac[] = [];
      this.statistikaIgracaService
        .getIgraciKlubUtakmica(utakmica.id, utakmica.domacin)
        .subscribe((domaciStats) => {
          this.statistikaIgracaService
            .getIgraciKlubUtakmica(utakmica.id, utakmica.gost)
            .subscribe((gostiStats) => {
              domaciProtivnikStats = domaciStats;
              gostiNasiStats = gostiStats;

              let ukupno = domaciProtivnikStats.length + gostiNasiStats.length;
              let zavrseno = 0;
              const proveriZavrseno = () => {
                zavrseno++;
                if (zavrseno === ukupno) {
                  sessionStorage.setItem('nasiIgraci', JSON.stringify(gostiNasi));
                  sessionStorage.setItem('protivnickiIgraci', JSON.stringify(domaciProtivnik));
                  this.router.navigate(['utakmica-live-krenula']);
                }
              };

              if (ukupno === 0) {
                sessionStorage.setItem('nasiIgraci', JSON.stringify(gostiNasi));
                sessionStorage.setItem('protivnickiIgraci', JSON.stringify(domaciProtivnik));
                this.router.navigate(['utakmica-live-krenula']);
                return;
              }

              for (let i = 0; i < domaciProtivnikStats.length; i++) {
                this.protivnickiIgraciService
                  .getProtivnickiIgracKorisnickoIme(parseInt(domaciProtivnikStats[i].id))
                  .subscribe((data) => {
                    domaciProtivnik.push(data);
                    proveriZavrseno();
                  });
              }
              for (let j = 0; j < gostiNasiStats.length; j++) {
                this.igraciService.getIgracKorisnickoIme(gostiNasiStats[j].id).subscribe((data) => {
                  gostiNasi.push(data);
                  proveriZavrseno();
                });
              }
            });
        });
    }
  }

  otkaziUtakmicu(id: number) {
    this.utakmiceService.deleteUtakmica(id).subscribe((msg) => {
      alert('Otkazali ste utakmicu');
      location.reload();
    });
  }

  goToKreirajUtakmicu() {
    this.router.navigate(['kreiraj-utakmicu']);
  }
  goToPregledUtakmica() {
    this.router.navigate(['pregled-utakmica']);
  }
  goToTrenerIgraci() {
    this.router.navigate(['trener-igraci']);
  }
  goToTrenerStatistika() {
    this.router.navigate(['trener-statistika']);
  }
  goToProfil() {
    this.router.navigate(['trener-profil']);
  }
  goToShootingChart() {
    this.router.navigate(['trener-shooting-chart']);
  }
  logOut() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
