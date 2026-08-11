import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { TreneriService } from '../services/treneri-service';
import { Message } from '../models/message';
import { IgraciService } from '../services/igraci-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-stranica',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './login-stranica.html',
  styleUrls: ['./login-stranica.css', '../../styles.css'],
})
export class LoginStranica {
  constructor(
    private treneriService: TreneriService,
    private router: Router,
    private igracService: IgraciService,
  ) {}
  ngOnInit(): void {}

  korisnickoIme: string = '';
  lozinkaT: string = '';
  message: string = '';

  korisnickoImeI:string='';
  korisnickoImeT:string='';

  tipKorisnika: string = 'igrac';
  tipKorisnikaLoz: string = 'igrac';

  email: string = '';
  poruka: string = '';
  otvoriB: boolean = false;

  vratiLogin(){
    this.otvoriB=false;
  }
  login() {
    if (this.korisnickoIme == '' || this.lozinkaT == '' || this.tipKorisnika == '') {
      this.message = 'Morate popuniti sva polja';
      return;
    }

    if (this.tipKorisnika == 'igrac') {
      this.korisnickoImeI=this.korisnickoIme;
      this.igracService.login(this.korisnickoImeI, this.lozinkaT).subscribe((odgovor) => {
        if (odgovor != null) {
          sessionStorage.setItem('korisnickoImeI', this.korisnickoImeI);
          sessionStorage.setItem('tokenI', odgovor.token);
          this.router.navigate(['igrac-stranica']);
        } else {
          this.message = 'Pogresno uneti podaci';
        }
      });
    } else if (this.tipKorisnika == 'trener') {
      this.korisnickoImeT=this.korisnickoIme;
      this.treneriService.login(this.korisnickoImeT, this.lozinkaT).subscribe((odgovor) => {
        if (odgovor != null) {
          sessionStorage.setItem('korisnickoImeT', this.korisnickoImeT);
          sessionStorage.setItem('tokenT', odgovor.token);
          this.router.navigate(['trener-pocetna']);
        } else {
          this.message = 'Pogresno uneti podaci';
        }
      });
    }
  }

  posaljiZahtev() {
    if (!this.email.trim()) {
      this.poruka = 'Unesite email ili korisničko ime';
      return;
    }
    if (this.tipKorisnikaLoz == 'trener') {
      this.treneriService.zaboravioLozinku(this.email, '').subscribe({
        next: () => {
          this.poruka = 'Ako nalog postoji, poslaćemo link na email';
        },
        error: () => {
          this.poruka = 'Greška, pokušajte ponovo';
        },
      });
    } else if (this.tipKorisnikaLoz == 'igrac') {
      this.igracService.zaboravioLozinku(this.email, '').subscribe({
        next: () => {
          this.poruka = 'Ako nalog postoji, poslaćemo link na email';
        },
        error: () => {
          this.poruka = 'Greška, pokušajte ponovo';
        },
      });
    }
  }
  otvori() {
    this.otvoriB = true;
  }
  registrationForm(){
    this.router.navigate(['registration-stranica']);
  }
  pocetna(){
    this.router.navigate(['']);
  }
}
