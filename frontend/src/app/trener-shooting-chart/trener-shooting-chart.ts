import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IgraciService } from '../services/igraci-service';
import { UtakmiceService } from '../services/utakmice-service';
import { TreneriService } from '../services/treneri-service';
import { Igrac } from '../models/igrac';
import { Utakmica } from '../models/utakmica';
import { SutService } from '../services/sut-service';
import { TreningService } from '../services/trening-service';
import { Sut } from '../models/sut';
import { Router } from '@angular/router';

interface Zona {
  id: string;
  naziv: string;
  ploX: number; // gde ide pločica sa procentom
  ploY: number;
}

@Component({
  selector: 'app-trener-shooting-chart',
  imports: [CommonModule, FormsModule],
  templateUrl: './trener-shooting-chart.html',
  styleUrls: ['../../styles.css', './trener-shooting-chart.css'],
})
export class TrenerShootingChart {
  @ViewChild('terenSvg') terenSvgRef!: ElementRef<SVGElement>;

  constructor(
    private router:Router,
    private igracService: IgraciService,
    private utakmiceService: UtakmiceService,
    private treneriService: TreneriService,
    private sutService: SutService,
    private treningService: TreningService,
  ) {}

  ngOnInit() {
    this.trenerId = sessionStorage.getItem('korisnickoImeT') || '';
    if (this.trenerId === '') return;

    this.treneriService.getTrenerKorisnickoIme(this.trenerId).subscribe((trener) => {
      this.klub = trener.klub;
      this.igracService
        .getAllIgraciTrenera(this.trenerId)
        .subscribe((data) => (this.igraci = data));
      this.utakmiceService
        .getDateSortedAllUtakmice(this.trenerId)
        .subscribe((data) => (this.utakmice = data));
    });

    this.izracunajZone();
  }

  trenerId: string = '';
  klub: string = '';

  // izbori
  mod: 'trening' | 'utakmica' = 'trening';
  igraci: Igrac[] = [];
  utakmice: Utakmica[] = [];
  izabraniIgrac: string = '';
  izabranaUtakmica: number = 0;
  treningId: number = 0;

  // unos - da li klik unosi pogodak ili promašaj
  unosPogodak: boolean = true;

  // šutevi trenutnog igrača/sesije
  sutevi: Sut[] = [];

  message: string = '';
  treningZapocet: boolean = false;

  zone: Zona[] = [
    { id: 'reket', naziv: 'Reket', ploX: 280, ploY: 130 },
    { id: 'dva_leva_cosak', naziv: '2 L.ćošak', ploX: 110, ploY: 90 },
    { id: 'dva_leva_45', naziv: '2 L.45', ploX: 165, ploY: 215 },
    { id: 'dva_centar', naziv: '2 Centar', ploX: 280, ploY: 270 },
    { id: 'dva_desna_45', naziv: '2 D.45', ploX: 395, ploY: 215 },
    { id: 'dva_desna_cosak', naziv: '2 D.ćošak', ploX: 450, ploY: 90 },
    { id: 'tri_leva_cosak', naziv: '3 L.ćošak', ploX: 35, ploY: 160 },
    { id: 'tri_leva_45', naziv: '3 L.45', ploX: 65, ploY: 300 },
    { id: 'tri_centar', naziv: '3 Centar', ploX: 280, ploY: 400 },
    { id: 'tri_desna_45', naziv: '3 D.45', ploX: 495, ploY: 300 },
    { id: 'tri_desna_cosak', naziv: '3 D.ćošak', ploX: 525, ploY: 160 },
  ];

  zoneStat: { [key: string]: { pogodjeni: number; ukupno: number; procenat: number } } = {};
  // izbor igrača iz liste
  izaberiIgraca(korisnickoIme: string) {
    this.izabraniIgrac = korisnickoIme;
    this.treningZapocet = false; // reset kad se promeni igrač
    this.treningId = 0;
    this.sutevi = [];
    this.izracunajZone();
    // za utakmicu odmah učitaj šuteve, za trening čekaj dugme
    if (this.mod === 'utakmica' && this.izabranaUtakmica > 0) {
      this.ucitajSuteve();
    }
    if (this.mod === 'trening') {
      this.treningService.getTreninziIgraca(this.izabraniIgrac).subscribe((tr) => {
        if (tr.length > 0) {
          /*
          let today = new Date();
          let year = today.getFullYear();
          let month = String(today.getMonth() + 1).padStart(2, '0');
          let day = String(today.getDate()).padStart(2, '0');
          let todayString = `${year}-${month}-${day}`; */
          if (tr[0].uToku) {
            this.treningZapocet = true;
            this.treningId = tr[0].id;
            this.ucitajSuteve();
          }
        }
      });
    }
  }
  zapocniTrening() {
    if (this.izabraniIgrac === '') {
      this.message = 'Prvo izaberite igrača';
      return;
    }
    const d = new Date();
    const godina = d.getFullYear();
    const mesec = (d.getMonth() + 1).toString().padStart(2, '0');
    const dan = d.getDate().toString().padStart(2, '0');
    const danas = `${godina}-${mesec}-${dan}`;
  //  alert(danas);
    this.treningService
      .addTrening(this.trenerId, this.izabraniIgrac, this.klub, danas, 'Trening šuta')
      .subscribe((data) => {
        if (data.id) {
          this.treningId = data.id;
          this.treningZapocet = true;
          this.sutevi = [];
          this.izracunajZone();
          this.message = 'Trening započet - možete unositi šuteve';
        }
      });
  }
  zavrsiTrening() {
    this.treningService.zavrsiTrening(this.treningId).subscribe((data) => {
      this.treningZapocet = false;
    });
  }
  promeniMod() {
    //alert("usao u promeni mod")
    //alert(this.mod)
    this.treningZapocet = false;
    this.treningId = 0;
    this.sutevi = [];
    this.izracunajZone();
    if (this.mod === 'utakmica' && this.izabranaUtakmica > 0 && this.izabraniIgrac !== '') {
      //alert(this.mod)
      this.ucitajSuteve();
    }
    if (this.mod === 'trening' && this.izabraniIgrac !== '') {
      this.izabranaUtakmica=0;
      //alert(this.mod)
      this.treningService.getTreninziIgraca(this.izabraniIgrac).subscribe((tr) => {
        if (tr.length > 0) {
          //alert("usao u if")
          /*    let today = new Date();
          let year = today.getFullYear();
          let month = String(today.getMonth() + 1).padStart(2, '0');
          let day = String(today.getDate()).padStart(2, '0');
          let todayString = `${year}-${month}-${day}`; */
          if (tr[0].uToku) {
       //     alert('usao u for');
            this.treningZapocet = true;
            this.treningId = tr[0].id;
    //        alert(this.treningId);
            this.ucitajSuteve();
          }
        }
      });
    }
  }

  // kad se promeni mod ili utakmica
  /*
  pripremiSesiju() {
    if (this.izabraniIgrac === '') return;
    if(this.mod==='utakmica') {
      // utakmica - učitaj postojeće šuteve
      this.treningId = 0;
      this.ucitajSuteve();
    }
  }*/

  ucitajSuteve() {
    if (this.izabraniIgrac === '') return;

    if (this.mod === 'utakmica' && this.izabranaUtakmica > 0) {
      this.sutService
        .getSuteviUtakmica(this.izabraniIgrac, this.izabranaUtakmica)
        .subscribe((data) => {
          this.sutevi = data;
          this.izracunajZone();
        });
    } else if (this.mod === 'trening' && this.treningId > 0) {
      this.sutService.getSuteviTrening(this.izabraniIgrac, this.treningId).subscribe((data) => {
        this.sutevi = data;
        this.izracunajZone();
      });
    }
  }

  // klik na teren - odmah unese šut (pogodak ili promašaj prema toggle-u)
  klikNaTeren(event: MouseEvent) {
    if (this.izabraniIgrac === '') {
      alert('Prvo izaberite igrača');
      return;
    }
    if (this.mod === 'trening' && !this.treningZapocet) {
      alert('Prvo započnite trening');
      return;
    }
    if (this.mod === 'utakmica' && this.izabranaUtakmica === 0) {
      alert('Izaberite utakmicu');
      return;
    }

    const svg = this.terenSvgRef.nativeElement;
    const rect = svg.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * 560;
    const py = ((event.clientY - rect.top) / rect.height) * 560; // 560, ne 520
    const x = (px / 560) * 100;
    const y = (py / 560) * 100;
    const dx = px - 280,
      dy = py - 55;
    const rastojanje = Math.sqrt(dx * dx + dy * dy);
    const ugao = Math.atan2(dx, dy) * (180 / Math.PI);
    console.log(`KLIK rastojanje: ${rastojanje.toFixed(0)} | ugao: ${ugao.toFixed(0)}`);

    const tip = this.odrediTip(x, y);
    const danas = new Date().toISOString().substring(0, 10);

    this.sutService
      .addSut(
        this.mod,
        this.izabranaUtakmica,
        this.treningId,
        this.izabraniIgrac,
        this.klub,
        tip,
        this.unosPogodak,
        x,
        y,
        danas,
      )
      .subscribe(() => {
        this.ucitajSuteve(); // osveži (dobije id iz baze za brisanje)
      });
  }

  // klik na tačku šuta - obriši ga
  obrisiSut(sut: any, event: MouseEvent) {
    event.stopPropagation(); // ne okini klikNaTeren
    this.sutService.deleteSut(sut.id).subscribe(() => {
      this.ucitajSuteve();
    });
  }

  odrediTip(x: number, y: number): string {
    const px = (x / 100) * 560,
      py = (y / 100) * 560;
    const dx = px - 280,
      dy = py - 55;
    const rastojanje = Math.sqrt(dx * dx + dy * dy);
    const apsUgao = Math.abs(Math.atan2(dx, dy) * (180 / Math.PI));

    let trojkaGranica: number;
    if (apsUgao <= 21) trojkaGranica = 291;
    else if (apsUgao <= 51) trojkaGranica = 275;
    else if (apsUgao <= 61) trojkaGranica = 265;
    else if (apsUgao <= 71) trojkaGranica = 255;
     else if (apsUgao <= 81) trojkaGranica = 245;
    else trojkaGranica = 235;

    return rastojanje > trojkaGranica ? '3FG' : '2FG';
  }

  odrediZonu(x: number, y: number): string {
    const px = (x / 100) * 560;
    const py = (y / 100) * 560;
    const kosX = 280,
      kosY = 55;
    const dx = px - kosX;
    const dy = py - kosY;
    const rastojanje = Math.sqrt(dx * dx + dy * dy);
    const ugao = Math.atan2(dx, dy) * (180 / Math.PI);
    const apsUgao = Math.abs(ugao); // ← ovo mora postojati

    // REKET provera
    if (px >= 220 && px <= 340 && py <= 220) {
      return 'reket';
    }

    // ═══ OVDE UBACUJEŠ ═══
    let trojkaGranica: number;
   if (apsUgao <= 21) trojkaGranica = 291;
    else if (apsUgao <= 51) trojkaGranica = 275;
    else if (apsUgao <= 61) trojkaGranica = 265;
    else if (apsUgao <= 71) trojkaGranica = 255;
    else if (apsUgao <= 81) trojkaGranica = 245;
    else trojkaGranica = 235;

    const jeTrojka = rastojanje > trojkaGranica; // ← koristi trojkaGranica
    // ═══════════════════════

    // sektor po uglu
    let sektor: string;
    if (ugao < -63) sektor = 'leva_cosak';
    else if (ugao < -21) sektor = 'leva_45';
    else if (ugao <= 21) sektor = 'centar';
    else if (ugao <= 63) sektor = 'desna_45';
    else sektor = 'desna_cosak';

    if (jeTrojka) {
      if (sektor === 'leva_cosak') return 'tri_leva_cosak';
      if (sektor === 'leva_45') return 'tri_leva_45';
      if (sektor === 'centar') return 'tri_centar';
      if (sektor === 'desna_45') return 'tri_desna_45';
      return 'tri_desna_cosak';
    } else {
      if (sektor === 'leva_cosak') return 'dva_leva_cosak';
      if (sektor === 'leva_45') return 'dva_leva_45';
      if (sektor === 'centar') return 'dva_centar';
      if (sektor === 'desna_45') return 'dva_desna_45';
      return 'dva_desna_cosak';
    }
  }

  izracunajZone() {
    for (const z of this.zone) this.zoneStat[z.id] = { pogodjeni: 0, ukupno: 0, procenat: 0 };
    for (const sut of this.sutevi) {
      const zonaId = this.odrediZonu(sut.x, sut.y);
      this.zoneStat[zonaId].ukupno++;
      if (sut.pogodak) this.zoneStat[zonaId].pogodjeni++;
    }
    for (const z of this.zone) {
      const zs = this.zoneStat[z.id];
      zs.procenat = zs.ukupno > 0 ? (zs.pogodjeni / zs.ukupno) * 100 : 0;
    }
  }

  bojaPlocice(zonaId: string): string {
    const zs = this.zoneStat[zonaId];
    if (!zs || zs.ukupno === 0) return '#f0f0f0';
    if (zs.procenat >= 50) return '#c8e6c9';
    if (zs.procenat >= 38) return '#fff3cd';
    return '#f8d7da';
  }
  logOut(){
   sessionStorage.clear();
    this.router.navigate(['']);
  }
   trenerPocetna(){
    this.router.navigate(['trener-pocetna']);
  }
}
