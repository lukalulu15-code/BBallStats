import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreneriService } from '../services/treneri-service';
import { ActivatedRoute, Router } from '@angular/router';
import { IgraciService } from '../services/igraci-service';

@Component({
  selector: 'app-reset-lozinka',
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-lozinka.html',
  styleUrls: ['../../styles.css', './reset-lozinka.css'],
})
export class ResetLozinka {
  novaLozinka: string = '';
  potvrdaLozinke: string = '';
  poruka: string = '';
  token: string = '';
  tipKorisnika: string = 'igrac';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trenerService: TreneriService,
    private igracService:IgraciService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  resetujLozinku() {
    if (this.novaLozinka == '') {
      this.poruka = 'Unesite novu lozinku';
      return;
    }
    if (this.novaLozinka !== this.potvrdaLozinke) {
      this.poruka = 'Lozinke se ne poklapaju';
      return;
    }
    let regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regexPass.test(this.novaLozinka)) {
      /*  alert("Lozinka mora imati minimalno 6 karaktera, maksimalno 10 karaktera, od toga bar jedno veliko slovo, tri mala slova, jedan broj i jedan specijalni karakter iz skupa ~!@#$%^&*+-/ i mora pocinjati slovom ") */
      alert(
        'Lozinka mora imati minimum 8 karaktera, i to barem po jedno veliko slovo, malo slovo, broj i najmanje jedan specijalni karakter',
      );
      return;
    }
    if (this.tipKorisnika == 'trener') {
      this.trenerService.resetLozinka(this.token, this.novaLozinka).subscribe({
        next: (data) => {
          if (data.message === 'ok') {
            alert('Lozinka uspešno promenjena!');
            setTimeout(() => this.router.navigate(['/login-stranica']), 2000);
          } else {
            this.poruka = data.message;
          }
        },
        error: () => {
          this.poruka = 'Token nije validan ili je istekao';
        },
      });
    } else if (this.tipKorisnika == 'igrac') {
      this.igracService.resetLozinka(this.token, this.novaLozinka).subscribe({
        next: (data) => {
          if (data.message === 'ok') {
            alert('Lozinka uspešno promenjena!');
            setTimeout(() => this.router.navigate(['/login-stranica']), 2000);
          } else {
            this.poruka = data.message;
          }
        },
        error: () => {
          this.poruka = 'Token nije validan ili je istekao';
        },
      });
    }
  }
}
