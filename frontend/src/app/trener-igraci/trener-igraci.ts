import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Igrac } from '../models/igrac';
import { Trener } from '../models/trener';
import { IgraciService } from '../services/igraci-service';
import { TreneriService } from '../services/treneri-service';
import { DefaultSlikaService } from '../services/default-slika';
import { ignoreElements } from 'rxjs';

@Component({
  selector: 'app-trener-igraci',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './trener-igraci.html',
  styleUrls: ['./trener-igraci.css', './../../styles.css'],
})
export class TrenerIgraci {
  constructor(
    private router: Router,
    private igraciService: IgraciService,
    private treneriService: TreneriService,
    private defaultSlikaService: DefaultSlikaService,
  ) {}
  ngOnInit(): void {
    this.igraciService.getAllIgraci().subscribe((data) => {
      this.sviIgraci = data;
    });
    this.korisnickoImeTrenera = sessionStorage.getItem('korisnickoImeT');
    if (this.korisnickoImeTrenera == null) {
      alert('Nije Vam dozvoljen pristup ovoj stranici');
      return;
    } else {
      this.treneriService.getTrenerKorisnickoIme(this.korisnickoImeTrenera).subscribe((data) => {
        console.log('Ime u sesiji:', this.korisnickoImeTrenera);
        console.log('Vraćen trener:', data);
        this.trener = data;
        this.igraciService.getAllIgraciTrenera(this.trener.korisnickoIme).subscribe((data2) => {
          this.sviIgraciTrenera = data2;
        });
      });
      this.treneriService.getAllTreneri().subscribe((data) => {
        this.sviTreneri = data;
      });
      this.defaultSlikaService.getDefaultSlika().subscribe((data) => {
        this.defaultSlika = data.slika;
      });
    }
  }

  tipKorisnika: string = '';

  korisnickoImeI: string = '';
  lozinkaI: string = '';
  potvrdaLozinkeI: string = '';
  imeI: string = '';
  prezimeI: string = '';
  telefonI: string = '';
  mejlI: string = '';
  klubI: string = '';
  slikaI: any = '';
  datumRodjenjaI: string = '';
  brojI: number|null=null;
  pozicijaI: string = '';
  visinaI: number | null = null;

  korisnickoImeTrenera: string | null = '';
  lozinkaT: string = '';
  potvrdaLozinkeT: string = '';
  imeT: string = '';
  prezimeT: string = '';
  telefonT: string = '';
  mejlT: string = '';
  klubT: string = '';
  slikaT: any = '';

  korisnikoImeUredi: string = '';
  slikaUredi: any = '';
  imeUredi: string = '';
  prezimeUredi: string = '';
  brojUredi: number = 0;
  pozicijaUredi: string = '';
  visinaUredi: number = 0;
  datumRodjenjaUredi: string = '';

  trener: Trener = new Trener();

  message: string = '';

  sviIgraci: Igrac[] = [];
  sviTreneri: Trener[] = [];
  sviIgraciTrenera: Igrac[] = [];

  defaultSlika: any = '';

  selectFokus = false;
  editovanje: boolean = false;

  register() {
    if (
      this.korisnickoImeI == '' ||
      this.lozinkaI == '' ||
      this.imeI == '' ||
      this.prezimeI == '' ||
      this.klubI == '' ||
      this.pozicijaI == '' ||
      this.mejlI == '' ||
      this.visinaI === null||
      this.brojI===null 
    ) {
      this.message = 'Niste popunili sva nephodna polja';
      return;
    }
    
    const broj = this.brojI;
    const visina = this.visinaI;
    let regexMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexMail.test(this.mejlI)) {
      alert('Uneti mejl nije u ispravnom formatu');
      return;
    }
    let usernameRegex = /^[A-Za-z][a-zA-Z0-9.@$]{2,19}$/;
    if (!usernameRegex.test(this.korisnickoImeI)) {
      alert(
        'Korisnicko ime mora pocetis slovom mora poveti slovom (malim ili velikim), ne sme imati manje od 3 karaktera i ne sme imati vise od 20 karaktera,i sme da zadrzi slova,cifre i specijalne karaktere iz skupa .@$',
      );
      return;
    }
    /* let regexPass=/^(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*\d)(?=.*[~!@#$%^&*+-/])[A-Za-z][a-zA-z0-9~!@#$%^&*+-/]{5,9}$/ */
    let regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regexPass.test(this.lozinkaI)) {
      /*  alert("Lozinka mora imati minimalno 6 karaktera, maksimalno 10 karaktera, od toga bar jedno veliko slovo, tri mala slova, jedan broj i jedan specijalni karakter iz skupa ~!@#$%^&*+-/ i mora pocinjati slovom ") */
      alert(
        'Lozinka mora imati minimum 8 karaktera, i to barem po jedno veliko slovo, malo slovo, broj i najmanje jedan specijalni karakter',
      );
      return;
    }

    let regexIme = /^[A-Z][a-zA-Z]+(?:['\s-][a-zA-Z]+)*$/;
    if (!regexIme.test(this.imeI)) {
      alert('Ime nije u ispravnom formatu');
      return;
    }
    let regexPrezime = /^[A-Z][a-zA-Z]+(?:['\s-][a-zA-Z]+)*$/;
    if (!regexPrezime.test(this.prezimeI)) {
      alert('Prezime nije u ispravnom formatu');
      return;
    }

    if (broj < 0 || broj > 99) {
      alert('Broj na dresu moze biti od 0 do 99');
      return;
    }

    for (let i = 0; i < this.sviTreneri.length; i++) {
      if (this.sviTreneri[i].mejl == this.mejlI) {
        this.message = 'Vec postoji registrovani korisnik sa unetim mejlom';
        return;
      }
    }
    for (let i = 0; i < this.sviTreneri.length; i++) {
      if (this.sviTreneri[i].korisnickoIme == this.korisnickoImeI) {
        this.message = 'Vec postoji registrovani korisnik sa unetim korisnickim imenom';
        return;
      }
    }
    for (let i = 0; i < this.sviIgraci.length; i++) {
      if (this.sviIgraci[i].mail == this.mejlI) {
        this.message = 'Vec postoji registrovani korisnik sa unetim mejlom';
        return;
      }
    }
    for (let i = 0; i < this.sviIgraci.length; i++) {
      if (this.sviIgraci[i].korisnickoIme == this.korisnickoImeI) {
        this.message = 'Vec postoji registrovani korisnik sa unetim korisnickim imenom';
        return;
      }
    }

    if (this.lozinkaI != this.potvrdaLozinkeI) {
      this.message = 'Niste ispravno potvrdili lozinku';
      return;
    }
    if (this.slikaI == '') {
      this.slikaI = this.defaultSlika;
    }
    this.igraciService.getAllIgraciTrenera(this.trener.korisnickoIme).subscribe((data1) => {
      for (let i = 0; i < data1.length; i++) {
        if (data1[i].broj == this.brojI) {
          alert('Broj ' + this.brojI + ' je zauzet');
          return;
        }
      }
      this.igraciService
        .addIgrac(
          this.korisnickoImeI,
          this.lozinkaI,
          this.imeI,
          this.prezimeI,
          this.slikaI,
          this.klubI,
          this.datumRodjenjaI,
          broj,
          this.trener.korisnickoIme,
          this.pozicijaI,
          visina,
          this.mejlI
        )
        .subscribe((data) => {
          if (data.message == 'ok') {
            alert('Uspešno ste registrovali novog igrača');
            location.reload();
          }
        });
    });
  }
  obrisiIgraca(korisnickoImeIgraca: string) {
    this.igraciService.deleteIgrac(korisnickoImeIgraca).subscribe((resp) => {
      alert('Uspesno ste obrisali igraca');
      this.igraciService.getAllIgraciTrenera(this.trener.korisnickoIme).subscribe((data) => {
        this.sviIgraciTrenera = data;
      });
    });
  }

  odustani() {
    this.korisnikoImeUredi = '';
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
        if (!this.editovanje) {
          this.slikaI = reader.result;
        } else {
          this.slikaUredi = reader.result;
        }
      };
    }
  }

  isDragging = false;

  uredi(igracKorisnickoIme: string) {
    this.editovanje = true;
    this.korisnikoImeUredi = igracKorisnickoIme;
    this.igraciService.getIgracKorisnickoIme(igracKorisnickoIme).subscribe((data) => {
      // alert(data.korisnickoIme);
      this.slikaUredi = data.slika;
      this.imeUredi = data.ime;
      this.prezimeUredi = data.prezime;
      this.brojUredi = data.broj;
      this.pozicijaUredi = data.pozicija;
      this.visinaUredi = data.visina;
      this.datumRodjenjaUredi = data.datumRodjenja;
    });
  }

  izmeni(igracKorisnickoIme: string) {
    this.igraciService
      .updateIgracKorisnickoIme(
        igracKorisnickoIme,
        this.imeUredi,
        this.prezimeUredi,
        this.slikaUredi,
        this.datumRodjenjaUredi,
        this.brojUredi,
        this.pozicijaUredi,
        this.visinaUredi,
      )
      .subscribe((data) => {
        if (data.message == 'ok') {
          alert('Uspesno ste azurirali');
          location.reload();
        }
      });
  }

  predjiNaProfil(igracKorisnickoIme: string) {
    sessionStorage.setItem('igrac', igracKorisnickoIme);
    this.router.navigate(['trener-profil-igraca']);
  }
  izvestaj(igracKorisnickoIme: string) {
    sessionStorage.setItem('igrac', igracKorisnickoIme);
    this.router.navigate(['trener-izvestaj']);
  }

  // Funkcija koja se aktivira dok korisnik vuče fajl PREKO polja
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
  logOut() {
   sessionStorage.clear();
    this.router.navigate(['']);
  }
  trenerPocetna() {
    this.router.navigate(['trener-pocetna']);
  }
}
