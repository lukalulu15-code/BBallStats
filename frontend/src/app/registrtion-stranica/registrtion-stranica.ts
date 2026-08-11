import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { IgraciService } from '../services/igraci-service';
import { TreneriService } from '../services/treneri-service';
import { Igrac } from '../models/igrac';
import { Trener } from '../models/trener';
import { DefaultSlikaService } from '../services/default-slika';

@Component({
  selector: 'app-registrtion-stranica',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './registrtion-stranica.html',
  styleUrls: ['./registrtion-stranica.css', '../../styles.css'],
})
export class RegistrtionStranica {
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
    this.treneriService.getAllTreneri().subscribe((data) => {
      this.sviTreneri = data;
    });
    this.defaultSlikaService.getDefaultSlika().subscribe((data) => {
      this.defaultSlika = data.slika;
    });
  }

  tipKorisnika: string = '';

  korisnickoImeT: string = '';
  lozinkaT: string = '';
  potvrdaLozinkeT: string = '';
  imeT: string = '';
  prezimeT: string = '';
  telefonT: string = '';
  mejlT: string = '';
  klubT: string = '';
  slikaT: any = '';

  korisnickoImeI: string = '';
  lozinkaI: string = '';
  potvrdaLozinkeI: string = '';
  imeI: string = '';
  prezimeI: string = '';
  telefonI: string = '';
  mejlI: string = '';
  klubI: string = '';
  slikaI: any = '';

  message: string = '';

  sviIgraci: Igrac[] = [];
  sviTreneri: Trener[] = [];

  defaultSlika: any = '';

  register() {
    if (
      this.korisnickoImeT == '' ||
      this.lozinkaT == '' ||
      this.imeT == '' ||
      this.prezimeT == '' ||
      this.telefonT == '' ||
      this.mejlT == '' ||
      this.klubT == ''
    ) {
      this.message = 'Morate popuniti sva polja';
      return;
    }
    let usernameRegex = /^[A-Za-z][a-zA-Z0-9.@$]{2,19}$/;
    if (!usernameRegex.test(this.korisnickoImeT)) {
      alert(
        'Korisnicko ime mora pocetis slovom mora poveti slovom (malim ili velikim), ne sme imati manje od 3 karaktera i ne sme imati vise od 20 karaktera,i sme da zadrzi slova,cifre i specijalne karaktere iz skupa .@$',
      );
      return;
    }
     let regexPass=/^(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*\d)(?=.*[~!@#$%^&*+-/])[A-Za-z][a-zA-z0-9~!@#$%^&*+-/]{5,9}$/
   // let regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regexPass.test(this.lozinkaT)) {
       alert("Lozinka mora imati minimalno 6 karaktera, maksimalno 10 karaktera, od toga bar jedno veliko slovo, tri mala slova, jedan broj i jedan specijalni karakter iz skupa ~!@#$%^&*+-/ i mora pocinjati slovom ") 
     /* alert(
        'Lozinka mora imati minimum 8 karaktera, i to barem po jedno veliko slovo, malo slovo, broj i najmanje jedan specijalni karakter',
      );*/
      return;
    }
    let regexMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexMail.test(this.mejlT)) {
      alert('Uneti mejl nije u ispravnom formatu');
      return;
    }
    let regexIme = /^[A-Z][a-zA-Z]+(?:['\s-][a-zA-Z]+)*$/;
    if (!regexIme.test(this.imeT)) {
      alert('Ime nije u ispravnom formatu');
      return;
    }
    let regexPrezime = /^[A-Z][a-zA-Z]+(?:['\s-][a-zA-Z]+)*$/;
    if (!regexPrezime.test(this.prezimeT)) {
      alert('Prezime nije u ispravnom formatu');
      return;
    }
    let regexPhone = /^[+][0-9]{6,14}$/;
    if (!regexPhone.test(this.telefonT)) {
      alert('Broj telefona unesite u formatu sa + na pocetku');
      return;
    }
    for (let i = 0; i < this.sviTreneri.length; i++) {
      if (this.sviTreneri[i].mejl == this.mejlT) {
        this.message = 'Vec postoji registrovani korisnik sa unetim mejlom';
        return;
      }
    }
    for (let i = 0; i < this.sviTreneri.length; i++) {
      if (this.sviTreneri[i].korisnickoIme == this.korisnickoImeT) {
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
    if (this.lozinkaT != this.potvrdaLozinkeT) {
      this.message = 'Niste ispravno potvrdili lozinku';
      return;
    }

    if (this.slikaT == '') {
      this.slikaT = this.defaultSlika;
    }
    this.treneriService
      .register(
        this.korisnickoImeT,
        this.lozinkaT,
        this.imeT,
        this.prezimeT,
        this.telefonT,
        this.mejlT,
        this.slikaT,
        this.klubT,
      )
      .subscribe((data) => {
        if (data.message == 'ok') {
          alert('Uspesni ste se registrovali');
          location.reload();
        }
      });
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

  isDragging = false;

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
  loginForm() {
    this.router.navigate(['login-stranica']);
  }
  pocetna() {
    this.router.navigate(['']);
  }
}
