import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IgraciService } from '../services/igraci-service';
import { StatistikaIgracaService } from '../services/statistika-igraca-service';
import { UtakmiceService } from '../services/utakmice-service';
import { TreneriService } from '../services/treneri-service';
import { DefaultSlikaService } from '../services/default-slika';
import { UtakmicaDogadjajiService } from '../services/utakmica-dogadjaji-service';
import { TreningService } from '../services/trening-service';
import { Trener } from '../models/trener';
import { Igrac } from '../models/igrac';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trener-profil',
  imports: [CommonModule, FormsModule],
  templateUrl: './trener-profil.html',
  styleUrl: './trener-profil.css',
})
export class TrenerProfil {
  constructor(
    private router: Router,
    private igracService: IgraciService,
    private utakmiceService: UtakmiceService,
    private trenerService: TreneriService,
    private defaultSlikaService: DefaultSlikaService,
    private treningService: TreningService,
  ) {}
  ngOnInit() {
    this.korisnickoImeTrenera = sessionStorage.getItem('korisnickoImeT');
    if (this.korisnickoImeTrenera != null) {
      this.trenerService.getAllTreneri().subscribe((data) => {
        this.sviTreneri = data;
      });
      this.trenerService.getTrenerKorisnickoIme(this.korisnickoImeTrenera).subscribe((tr) => {
        if (tr == null) {
          return;
        }
        this.trener = tr;
      });
      this.igracService.getAllIgraci().subscribe((data) => {
        this.sviIgraci = data;
      });
    }
  }

  korisnickoImeTrenera: string | null = '';
  korisnickoImeT: string = '';
  trener: Trener = new Trener();
  lozinkaT: string = '';
  potvrdaLozinkeT: string = '';
  novaLozinkaT: string = '';
  staraLozinkaT: string = '';
  imeT: string = '';
  prezimeT: string = '';
  telefonT: string = '';
  mejlT: string = '';
  klubT: string = '';
  slikaT: any = '';
  sviIgraci: Igrac[] = [];
  sviTreneri: Trener[] = [];
  defaultSlika: any = '';

  selectFokus = false;
  editovanje: boolean = false;

  isDragging = false;

  message: string = '';
  messageL: string = '';

  promeniLozinku() {
    this.messageL = '';

    // sva polja popunjena
    if (this.staraLozinkaT === '' || this.novaLozinkaT === '' || this.potvrdaLozinkeT === '') {
      this.messageL = 'Popunite sva polja za promenu lozinke';
      return;
    }

    // nova i potvrda se poklapaju
    if (this.novaLozinkaT !== this.potvrdaLozinkeT) {
      this.messageL = 'Nova lozinka i potvrda se ne poklapaju';
      return;
    }

    // jačina lozinke
    const lozinkaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!lozinkaRegex.test(this.novaLozinkaT)) {
      this.messageL =
        'Lozinka mora imati bar 8 karaktera, veliko slovo, malo slovo, cifru i specijalni znak';
      return;
    }

    // nova različita od stare
    if (this.novaLozinkaT === this.staraLozinkaT) {
      this.messageL = 'Nova lozinka mora biti različita od stare';
      return;
    }

    // backend proverava staru lozinku
    this.trenerService
      .updateTrenerLozinka(this.trener.korisnickoIme, this.staraLozinkaT, this.novaLozinkaT)
      .subscribe((data) => {
        if (data.message === 'ok') {
          alert('Lozinka je uspešno promenjena');
          this.staraLozinkaT = '';
          this.novaLozinkaT = '';
          this.potvrdaLozinkeT = '';
        } else if (data.message === 'pogresnaStara') {
          this.messageL = 'Stara lozinka nije tačna';
        } else if (data.message === 'nemaTrenera') {
          this.messageL = 'Trener nije pronađen';
        } else {
          this.messageL = 'Greška pri promeni lozinke';
        }
      });
  }

  azurirajPodatke() {
    this.message = '';

    // 1. VALIDACIJA SVEGA PRVO

    // provera duplikata (izuzmi samog trenera)
    for (let i = 0; i < this.sviTreneri.length; i++) {
      if (this.sviTreneri[i].korisnickoIme === this.trener.korisnickoIme) continue; // preskoči sebe
      if (this.mejlT !== '' && this.sviTreneri[i].mejl === this.mejlT) {
        this.message = 'Vec postoji registrovani korisnik sa unetim mejlom';
        return;
      }
      if (this.korisnickoImeT !== '' && this.sviTreneri[i].korisnickoIme === this.korisnickoImeT) {
        this.message = 'Vec postoji registrovani korisnik sa unetim korisnickim imenom';
        return;
      }
    }
    for (let i = 0; i < this.sviIgraci.length; i++) {
      if (this.mejlT !== '' && this.sviIgraci[i].mail === this.mejlT) {
        this.message = 'Vec postoji registrovani korisnik sa unetim mejlom';
        return;
      }
      if (this.korisnickoImeT !== '' && this.sviIgraci[i].korisnickoIme === this.korisnickoImeT) {
        this.message = 'Vec postoji registrovani korisnik sa unetim korisnickim imenom';
        return;
      }
    }

    // validacija formata (samo za popunjena polja)
    if (this.korisnickoImeT !== '') {
      const usernameRegex = /^[A-Za-z][a-zA-Z0-9.@$]{2,19}$/;
      if (!usernameRegex.test(this.korisnickoImeT)) {
        this.message = 'Korisnicko ime nije u ispravnom formatu';
        return;
      }
    }
    if (this.mejlT !== '') {
      const regexMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!regexMail.test(this.mejlT)) {
        this.message = 'Mejl nije u ispravnom formatu';
        return;
      }
    }
    if (this.imeT !== '') {
      const regexIme = /^[A-Z][a-zA-Z]+(?:['\s-][a-zA-Z]+)*$/;
      if (!regexIme.test(this.imeT)) {
        this.message = 'Ime nije u ispravnom formatu';
        return;
      }
    }
    if (this.prezimeT !== '') {
      const regexPrezime = /^[A-Z][a-zA-Z]+(?:['\s-][a-zA-Z]+)*$/;
      if (!regexPrezime.test(this.prezimeT)) {
        this.message = 'Prezime nije u ispravnom formatu';
        return;
      }
    }
    if (this.telefonT !== '') {
      let regexPhone = /^[+][0-9]{6,14}$/;
      if (!regexPhone.test(this.telefonT)) {
        alert('Broj telefona unesite u formatu sa + na pocetku');
        return;
      }
    }

    // 2. AKO JE SVE VALIDNO - kreni sa promenom korisničkog imena (pa ostalo)
    if (this.korisnickoImeT !== '' && this.korisnickoImeT !== this.trener.korisnickoIme) {
      const staro = this.trener.korisnickoIme;
      const novo = this.korisnickoImeT;
      sessionStorage.setItem('korisnickoImeT', novo);
      // 1. sam trener
      this.trenerService.updateKorisnickoIme(staro, novo).subscribe((data) => {
        const noviToken = data.token;
        // 2. igrači (trener polje)
        this.igracService.updateTrener(staro, novo).subscribe(() => {
          // 3. utakmice (trener polje)
          this.utakmiceService.updateTrener(staro, novo).subscribe(() => {
            // 4. treninzi (trener polje)
            this.treningService.updateTrener(staro, novo).subscribe(() => {
              this.trener.korisnickoIme = novo; // ažuriraj lokalno da ostale izmene koriste novo
              if (noviToken) sessionStorage.setItem('tokenT', noviToken); // token je do sada nosio staro ime

              let ukupno = 0;
              let zavrseno = 0;
              const proveriZavrseno = () => {
                zavrseno++;
                if (zavrseno === ukupno) {
                  alert('Podaci su uspešno ažurirani');
                  location.reload();
                }
              };

              if (this.imeT !== '' && this.imeT !== this.trener.ime) ukupno++;
              if (this.prezimeT !== '' && this.prezimeT !== this.trener.prezime) ukupno++;
              if (this.mejlT !== '' && this.mejlT !== this.trener.mejl) ukupno++;
              if (this.telefonT !== '' && this.telefonT !== this.trener.telefon) ukupno++;
              if (this.slikaT !== '' && this.slikaT !== this.trener.slika) ukupno++;

              if (ukupno === 0) {
                alert('Podaci su uspešno ažurirani');
                location.reload();
                return;
              }

              if (this.imeT !== '' && this.imeT !== this.trener.ime) {
                this.trenerService
                  .updateTrenerIme(this.trener.korisnickoIme, this.imeT)
                  .subscribe(() => {
                    this.trener.ime = this.imeT;
                    proveriZavrseno();
                  });
              }

              if (this.prezimeT !== '' && this.prezimeT !== this.trener.prezime) {
                this.trenerService
                  .updateTrenerPrezime(this.trener.korisnickoIme, this.prezimeT)
                  .subscribe(() => {
                    this.trener.prezime = this.prezimeT;
                    proveriZavrseno();
                  });
              }

              if (this.mejlT !== '' && this.mejlT !== this.trener.mejl) {
                this.trenerService
                  .updateTrenerMejl(this.trener.korisnickoIme, this.mejlT)
                  .subscribe(() => {
                    this.trener.mejl = this.mejlT;
                    proveriZavrseno();
                  });
              }

              if (this.telefonT !== '' && this.telefonT !== this.trener.telefon) {
                this.trenerService
                  .updateTrenerTelefon(this.trener.korisnickoIme, this.telefonT)
                  .subscribe(() => {
                    this.trener.telefon = this.telefonT;
                    proveriZavrseno();
                  });
              }

              if (this.slikaT !== '' && this.slikaT !== this.trener.slika) {
                this.trenerService
                  .updateTrenerSlika(this.trener.korisnickoIme, this.slikaT)
                  .subscribe(() => {
                    this.trener.slika = this.slikaT;
                    proveriZavrseno();
                  });
              }
            });
          });
        });
      });
    } else {
      // korisničko ime se ne menja - odmah ostale izmene
      let ukupno = 0;
      let zavrseno = 0;
      const proveriZavrseno = () => {
        zavrseno++;
        if (zavrseno === ukupno) {
          alert('Podaci su uspešno ažurirani');
          location.reload();
        }
      };

      if (this.imeT !== '' && this.imeT !== this.trener.ime) ukupno++;
      if (this.prezimeT !== '' && this.prezimeT !== this.trener.prezime) ukupno++;
      if (this.mejlT !== '' && this.mejlT !== this.trener.mejl) ukupno++;
      if (this.telefonT !== '' && this.telefonT !== this.trener.telefon) ukupno++;
      if (this.slikaT !== '' && this.slikaT !== this.trener.slika) ukupno++;

      if (ukupno === 0) {
        return;
      }

      if (this.imeT !== '' && this.imeT !== this.trener.ime) {
        this.trenerService.updateTrenerIme(this.trener.korisnickoIme, this.imeT).subscribe(() => {
          this.trener.ime = this.imeT;
          proveriZavrseno();
        });
      }

      if (this.prezimeT !== '' && this.prezimeT !== this.trener.prezime) {
        this.trenerService
          .updateTrenerPrezime(this.trener.korisnickoIme, this.prezimeT)
          .subscribe(() => {
            this.trener.prezime = this.prezimeT;
            proveriZavrseno();
          });
      }

      if (this.mejlT !== '' && this.mejlT !== this.trener.mejl) {
        this.trenerService.updateTrenerMejl(this.trener.korisnickoIme, this.mejlT).subscribe(() => {
          this.trener.mejl = this.mejlT;
          proveriZavrseno();
        });
      }

      if (this.telefonT !== '' && this.telefonT !== this.trener.telefon) {
        this.trenerService
          .updateTrenerTelefon(this.trener.korisnickoIme, this.telefonT)
          .subscribe(() => {
            this.trener.telefon = this.telefonT;
            proveriZavrseno();
          });
      }

      if (this.slikaT !== '' && this.slikaT !== this.trener.slika) {
        this.trenerService
          .updateTrenerSlika(this.trener.korisnickoIme, this.slikaT)
          .subscribe(() => {
            this.trener.slika = this.slikaT;
            proveriZavrseno();
          });
      }
    }
  }

  slikaTrener(event: Event) {
    let input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      let file = input.files[0];
      let reader = new FileReader();
      reader.onload = function (e: ProgressEvent<FileReader>) {
        let slika = new Image();
        slika.src = e.target?.result?.toString() || '';
        slika.onload = function () {
          let minW = 100;
          let minH = 100;
          let maxW = 300;
          let maxH = 300;
          if (slika.width < minW || slika.height < minH) {
            alert('Minimalne dimenzije slike su 100*100px');
            input.value = '';
            return;
          } else if (slika.width > maxW || slika.height > maxH) {
            alert('Maksimalne dimenzije slike su 300*300px');
            input.value = '';
          } else {
            alert('Uspesno ste dodali sliku');
          }
        };
      };
      reader.readAsDataURL(input.files[0]);
      reader.onloadend = (e) => {
        this.slikaT = reader.result;
      };
    }
  }

  naDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  // Funkcija koja se aktivira ako korisnik odustane i odvuče fajl VAN polja
  naDragLeave() {
    this.isDragging = false;
  }

  // Funkcija koja hvata ispušteni fajl
  naDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    // Izvačimo fajlove iz drag događaja
    const files = event.dataTransfer?.files;

    if (files && files.length > 0) {
      // Kreiramo lažni event objekat koji tvoja funkcija slikaTrener već očekuje
      const lazniEvent = {
        target: {
          files: files,
          value: '', // Simulacija inputa
        },
      } as unknown as Event;

      // Prosleđujemo tvojoj logici koja već proverava dimenzije (100x100 - 300x300)
      this.slikaTrener(lazniEvent);
    }
  }

  trenerPocetna() {
    this.router.navigate(['trener-pocetna']);
  }

  logOut() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
