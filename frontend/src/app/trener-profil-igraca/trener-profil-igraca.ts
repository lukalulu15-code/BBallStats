import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { IgraciService } from '../services/igraci-service';
import { StatistikaIgracaService } from '../services/statistika-igraca-service';
import { UtakmiceService } from '../services/utakmice-service';
import { StatistikaIgraca } from '../models/statistkaIgraca';
import { Utakmica } from '../models/utakmica';
import { Igrac } from '../models/igrac';
import { TreneriService } from '../services/treneri-service';
import { Trener } from '../models/trener';
import { CommonModule } from '@angular/common';
import { StatistikaIgracaUtakmica } from '../models/statistikaIgracaUtakmica';
import { Router } from '@angular/router';
import { Trening } from '../models/trening';
import { Sut } from '../models/sut';
import { SutService } from '../services/sut-service';
import { TreningService } from '../services/trening-service';
Chart.register(...registerables);

interface Zona {
  id: string;
  naziv: string;
  ploX: number; // gde ide pločica sa procentom
  ploY: number;
}

@Component({
  selector: 'app-trener-profil-igraca',
  imports: [FormsModule, CommonModule],
  templateUrl: './trener-profil-igraca.html',
  styleUrls: ['./trener-profil-igraca.css', '../../styles.css'],
})
export class TrenerProfilIgraca {
  @ViewChild('formaChart') formaChartRef!: ElementRef<HTMLCanvasElement>;

  constructor(
    private router: Router,
    private igracService: IgraciService,
    private statistikaIgracaService: StatistikaIgracaService,
    private utakmiceService: UtakmiceService,
    private treneriService: TreneriService,
    private sutService: SutService,
    private treningService: TreningService,
  ) {}

  ngOnInit() {
    this.igracString = sessionStorage.getItem('igrac'); // korisnickoIme
    this.korisnickoImeTrenera = sessionStorage.getItem('korisnickoImeT');
    if (this.igracString != null && this.korisnickoImeTrenera != null) {
      this.izabraniIgrac = this.igracString;
      const trenerString=this.korisnickoImeTrenera;
      this.ucitajSuteve();
      this.izracunajZone();
      this.igracService.getIgracKorisnickoIme(this.igracString).subscribe((data) => {
        this.igrac = data;
        this.treningService.getTreninziIgraca(this.igrac.korisnickoIme).subscribe((tr) => {
          this.treninzi = tr;
          this.treneriService.getTrenerKorisnickoIme(trenerString).subscribe((tr) => {
            this.trener = tr;
            this.utakmiceService.getSezoneTrenera(tr.korisnickoIme).subscribe((sez) => {
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

              this.izracunajProsekeUkupno();
              this.izracunajProsekeSezona();
            });
          });
        });
      });
    }
  }

  chart: Chart | null = null;

  igracString: string | null = ''; // lični podaci
  igrac: Igrac = new Igrac();
  igracStatistike: StatistikaIgraca[] = []; // statistika po utakmicama
  utakmice: Utakmica[] = []; // podaci o utakmicama (za datum/protivnik)

  prosekPoena: number = 0;
  prosekAsistencija: number = 0;
  prosekSkokova: number = 0;
  prosekIndeksa: number = 0;
  prosekMinutaSek: number = 0;
  prosekDvaPoena: number = 0;
  prosekTriPoena: number = 0;
  prosekSlobodno: number = 0;
  prosekSkokoviNapad: number = 0;
  prosekSkokoviOdbrana: number = 0;
  prosekUkradene: number = 0;
  prosekIzgubljene: number = 0;
  prosekBlokade: number = 0;
  prosekBlokadePrimljene: number = 0;
  prosekLicneGreske: number = 0;
  prosekIznudjeniFaulovi: number = 0;

  prosekPoenaSezona: number = 0;
  prosekAsistencijaSezona: number = 0;
  prosekSkokovaSezona: number = 0;
  prosekIndeksaSezona: number = 0;
  prosekMinutaSekSezona: number = 0;
  prosekDvaPoenaSezona: number = 0;
  prosekTriPoenaSezona: number = 0;
  prosekSlobodnoSezona: number = 0;
  prosekSkokoviNapadSezona: number = 0;
  prosekSkokoviOdbranaSezona: number = 0;
  prosekUkradeneSezona: number = 0;
  prosekIzgubljeneSezona: number = 0;
  prosekBlokadeSezona: number = 0;
  prosekBlokadePrimljeneSezona: number = 0;
  prosekLicneGreskeSezona: number = 0;
  prosekIznudjeniFauloviSezona: number = 0;
  brojOdigranihUtakmicaSezona: number = 0;
  startovaoUtakmicaSezona: number = 0;
  statistikeIgracaUtakmicaSezona: StatistikaIgracaUtakmica[] = [];
  utakmiceSezona: Utakmica[] = [];

  sezone: number[] = [];
  izabranaSezona: number = 0;
  izabraniTip: string = 'liga';

  // sortiranje
  sortKolona: string = 'datum';
  sortSmer: 'asc' | 'desc' = 'desc';

  korisnickoImeTrenera: string | null = '';
  trener: Trener = new Trener();
  brojOdigranihUtakmica: number = 0;
  startovaoUtakmica: number = 0;
  statistikeIgracaUtakmica: StatistikaIgracaUtakmica[] = [];
  statsUtakmica: StatistikaIgracaUtakmica = new StatistikaIgracaUtakmica();

  // proseci

  mod: 'trening' | 'utakmica' = 'trening';
  treninzi: Trening[] = [];
  sutevi: Sut[] = [];
  treningId: number = 0;
  izabranaUtakmica: number = 0;
  izabraniIgrac: string = '';

  aktivanTab: string = 'statistika';

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

  izracunajProsekeUkupno() {
    this.utakmice = [];
    this.statistikeIgracaUtakmica = [];
    this.startovaoUtakmica = 0;
    this.statistikaIgracaService.getIgracStatistika(this.igrac.korisnickoIme).subscribe((stats) => {
      this.igracStatistike = stats;
      if (stats.length === 0) {
        this.prosekPoena = 0;
        this.prosekSkokova = 0;
        this.prosekAsistencija = 0;
        this.prosekIndeksa = 0;
        this.prosekMinutaSek = 0;
        this.prosekDvaPoena = 0;
        this.prosekTriPoena = 0;
        this.prosekSlobodno = 0;
        this.prosekSkokoviNapad = 0;
        this.prosekSkokoviOdbrana = 0;
        this.prosekUkradene = 0;
        this.prosekIzgubljene = 0;
        this.prosekBlokade = 0;
        this.prosekBlokadePrimljene = 0;
        this.prosekLicneGreske = 0;
        this.prosekIznudjeniFaulovi = 0;
        this.brojOdigranihUtakmica = 0;
      } else {
        let poeni = 0,
          skokovi = 0,
          asistencije = 0,
          indeks = 0,
          minutiSek = 0,
          dvaPoenaPogodak = 0,
          dvaPoenaPromasaj = 0,
          triPoenaPogodak = 0,
          triPoenaPromasaj = 0,
          slobodnoPogodak = 0,
          slobodnoPromasaj = 0,
          skokoviNapad = 0,
          skokoviOdbrana = 0,
          ukradene = 0,
          izgubljene = 0,
          blokade = 0,
          blokadePrimljene = 0,
          licneGreske = 0,
          iznudjeniFaulovi = 0;
        let zavrsene = 0;
        let obradjeno = 0; // koliko getUtakmica se vratilo (bez obzira na status)

        for (let i = 0; i < stats.length; i++) {
          const stat = stats[i]; // uhvati u lokalnu varijablu

          this.utakmiceService.getUtakmica(stat.utakmicaId).subscribe((utakmica) => {
            obradjeno++; // ova utakmica je obrađena (vratila se)

            if (
              (utakmica.status == 'pobeda' || utakmica.status == 'poraz' || utakmica.status == 'nereseno') &&
              this.vremeUSekunde(stat.minuti) > 0 &&
              (this.izabraniTip == 'sve' || utakmica.takmicenje == this.izabraniTip)
            ) {
              zavrsene++;
              if (stat.starter) this.startovaoUtakmica++;

              this.utakmice.push(utakmica);
              const statsUtakmica = new StatistikaIgracaUtakmica();
              statsUtakmica.statistikaIgraca = stat;
              statsUtakmica.utakmica = utakmica;
              statsUtakmica.protivnik =
                stat.klub == utakmica.domacin ? utakmica.gost : utakmica.domacin;
              this.statistikeIgracaUtakmica.push(statsUtakmica);

              poeni += stat.poeni;
              skokovi += stat.skokoviUkupno;
              asistencije += stat.asistencije;
              indeks += stat.indeks;
              minutiSek += this.vremeUSekunde(stat.minuti);
              dvaPoenaPogodak += stat.dvaPoenaPogodak;
              dvaPoenaPromasaj += stat.dvaPoenaPromasaj;
              triPoenaPogodak += stat.triPoenaPogodak;
              triPoenaPromasaj += stat.triPoenaPromasaj;
              slobodnoPogodak += stat.slobodnoPogodak;
              slobodnoPromasaj += stat.slobodnoPromasaj;
              skokoviNapad += stat.skokoviNapad;
              skokoviOdbrana += stat.skokoviOdbrana;
              ukradene += stat.ukradene;
              izgubljene += stat.izgubljene;
              blokade += stat.blokade;
              blokadePrimljene += stat.blokadePrimljene;
              licneGreske += stat.licneGreske;
              iznudjeniFaulovi += stat.iznudjeniFaulovi;
            }

            // kad su SVE utakmice obrađene (ne po indeksu i, nego po broju vraćenih)
            if (obradjeno === stats.length) {
              // sortiraj tabelu
              this.statistikeIgracaUtakmica.sort(
                (a, b) =>
                  new Date(b.utakmica.datum).getTime() - new Date(a.utakmica.datum).getTime(),
              );

              // računaj proseke tek sad, deljenje sa zavrsene
              if (zavrsene > 0) {
                this.prosekPoena = poeni / zavrsene;
                this.prosekSkokova = skokovi / zavrsene;
                this.prosekAsistencija = asistencije / zavrsene;
                this.prosekIndeksa = indeks / zavrsene;
                this.prosekMinutaSek = minutiSek / zavrsene;
                this.prosekDvaPoena =
                  dvaPoenaPogodak + dvaPoenaPromasaj == 0
                    ? 0
                    : (dvaPoenaPogodak / (dvaPoenaPogodak + dvaPoenaPromasaj)) * 100;
                this.prosekTriPoena =
                  triPoenaPogodak + triPoenaPromasaj == 0
                    ? 0
                    : (triPoenaPogodak / (triPoenaPogodak + triPoenaPromasaj)) * 100;
                this.prosekSlobodno =
                  slobodnoPogodak + slobodnoPromasaj == 0
                    ? 0
                    : (slobodnoPogodak / (slobodnoPogodak + slobodnoPromasaj)) * 100;
                this.prosekSkokoviNapad = skokoviNapad / zavrsene;
                this.prosekSkokoviOdbrana = skokoviOdbrana / zavrsene;
                this.prosekUkradene = ukradene / zavrsene;
                this.prosekIzgubljene = izgubljene / zavrsene;
                this.prosekBlokade = blokade / zavrsene;
                this.prosekBlokadePrimljene = blokadePrimljene / zavrsene;
                this.prosekLicneGreske = licneGreske / zavrsene;
                this.prosekIznudjeniFaulovi = iznudjeniFaulovi / zavrsene;
                this.brojOdigranihUtakmica = zavrsene;
              } else if (zavrsene == 0) {
                this.prosekPoena = 0;
                this.prosekSkokova = 0;
                this.prosekAsistencija = 0;
                this.prosekIndeksa = 0;
                this.prosekMinutaSek = 0;
                this.prosekDvaPoena = 0;
                this.prosekTriPoena = 0;
                this.prosekSlobodno = 0;
                this.prosekSkokoviNapad = 0;
                this.prosekSkokoviOdbrana = 0;
                this.prosekUkradene = 0;
                this.prosekIzgubljene = 0;
                this.prosekBlokade = 0;
                this.prosekBlokadePrimljene = 0;
                this.prosekLicneGreske = 0;
                this.prosekIznudjeniFaulovi = 0;
                this.brojOdigranihUtakmica = zavrsene;
              }
            }
          });
        }
      }
    });
  }
  izracunajProsekeSezona() {
    this.statistikeIgracaUtakmicaSezona = [];
    this.utakmiceSezona = [];
    this.startovaoUtakmicaSezona = 0;
    this.statistikaIgracaService.getIgracStatistika(this.igrac.korisnickoIme).subscribe((stats) => {
      if (stats.length === 0) {
        this.prosekPoenaSezona = 0;
        this.prosekSkokovaSezona = 0;
        this.prosekAsistencijaSezona = 0;
        this.prosekIndeksaSezona = 0;
        this.prosekMinutaSekSezona = 0;
        this.prosekDvaPoenaSezona = 0;
        this.prosekTriPoenaSezona = 0;
        this.prosekSlobodnoSezona = 0;
        this.prosekSkokoviNapadSezona = 0;
        this.prosekSkokoviOdbranaSezona = 0;
        this.prosekUkradeneSezona = 0;
        this.prosekIzgubljeneSezona = 0;
        this.prosekBlokadeSezona = 0;
        this.prosekBlokadePrimljeneSezona = 0;
        this.prosekLicneGreskeSezona = 0;
        this.prosekIznudjeniFauloviSezona = 0;
        this.brojOdigranihUtakmicaSezona = 0;
      } else {
        let poeni = 0,
          skokovi = 0,
          asistencije = 0,
          indeks = 0,
          minutiSek = 0,
          dvaPoenaPogodak = 0,
          dvaPoenaPromasaj = 0,
          triPoenaPogodak = 0,
          triPoenaPromasaj = 0,
          slobodnoPogodak = 0,
          slobodnoPromasaj = 0,
          skokoviNapad = 0,
          skokoviOdbrana = 0,
          ukradene = 0,
          izgubljene = 0,
          blokade = 0,
          blokadePrimljene = 0,
          licneGreske = 0,
          iznudjeniFaulovi = 0;
        let zavrsene = 0;
        let obradjeno = 0; // koliko getUtakmica se vratilo (bez obzira na status)

        for (let i = 0; i < stats.length; i++) {
          const stat = stats[i]; // uhvati u lokalnu varijablu

          this.utakmiceService.getUtakmica(stat.utakmicaId).subscribe((utakmica) => {
            obradjeno++; // ova utakmica je obrađena (vratila se)

            if (
              (utakmica.status == 'pobeda' || utakmica.status == 'poraz' || utakmica.status == 'nereseno') &&
              this.vremeUSekunde(stat.minuti) > 0 &&
              utakmica.sezonaPocetak == this.izabranaSezona &&
              (this.izabraniTip == 'sve' || utakmica.takmicenje == this.izabraniTip)
            ) {
              zavrsene++;
              if (stat.starter) this.startovaoUtakmicaSezona++;

              this.utakmiceSezona.push(utakmica);
              const statsUtakmica = new StatistikaIgracaUtakmica();
              statsUtakmica.statistikaIgraca = stat;
              statsUtakmica.utakmica = utakmica;
              statsUtakmica.protivnik =
                stat.klub == utakmica.domacin ? utakmica.gost : utakmica.domacin;
              this.statistikeIgracaUtakmicaSezona.push(statsUtakmica);

              poeni += stat.poeni;
              skokovi += stat.skokoviUkupno;
              asistencije += stat.asistencije;
              indeks += stat.indeks;
              minutiSek += this.vremeUSekunde(stat.minuti);
              dvaPoenaPogodak += stat.dvaPoenaPogodak;
              dvaPoenaPromasaj += stat.dvaPoenaPromasaj;
              triPoenaPogodak += stat.triPoenaPogodak;
              triPoenaPromasaj += stat.triPoenaPromasaj;
              slobodnoPogodak += stat.slobodnoPogodak;
              slobodnoPromasaj += stat.slobodnoPromasaj;
              skokoviNapad += stat.skokoviNapad;
              skokoviOdbrana += stat.skokoviOdbrana;
              ukradene += stat.ukradene;
              izgubljene += stat.izgubljene;
              blokade += stat.blokade;
              blokadePrimljene += stat.blokadePrimljene;
              licneGreske += stat.licneGreske;
              iznudjeniFaulovi += stat.iznudjeniFaulovi;
            }

            // kad su SVE utakmice obrađene (ne po indeksu i, nego po broju vraćenih)
            if (obradjeno === stats.length) {
              // sortiraj tabelu
              this.statistikeIgracaUtakmicaSezona.sort(
                (a, b) =>
                  new Date(b.utakmica.datum).getTime() - new Date(a.utakmica.datum).getTime(),
              );

              // računaj proseke tek sad, deljenje sa zavrsene
              if (zavrsene > 0) {
                this.prosekPoenaSezona = poeni / zavrsene;
                this.prosekSkokovaSezona = skokovi / zavrsene;
                this.prosekAsistencijaSezona = asistencije / zavrsene;
                this.prosekIndeksaSezona = indeks / zavrsene;
                this.prosekMinutaSekSezona = minutiSek / zavrsene;
                this.prosekDvaPoenaSezona =
                  dvaPoenaPogodak + dvaPoenaPromasaj == 0
                    ? 0
                    : (dvaPoenaPogodak / (dvaPoenaPogodak + dvaPoenaPromasaj)) * 100;
                this.prosekTriPoenaSezona =
                  triPoenaPogodak + triPoenaPromasaj == 0
                    ? 0
                    : (triPoenaPogodak / (triPoenaPogodak + triPoenaPromasaj)) * 100;
                this.prosekSlobodnoSezona =
                  slobodnoPogodak + slobodnoPromasaj == 0
                    ? 0
                    : (slobodnoPogodak / (slobodnoPogodak + slobodnoPromasaj)) * 100;
                this.prosekSkokoviNapadSezona = skokoviNapad / zavrsene;
                this.prosekSkokoviOdbranaSezona = skokoviOdbrana / zavrsene;
                this.prosekUkradeneSezona = ukradene / zavrsene;
                this.prosekIzgubljeneSezona = izgubljene / zavrsene;
                this.prosekBlokadeSezona = blokade / zavrsene;
                this.prosekBlokadePrimljeneSezona = blokadePrimljene / zavrsene;
                this.prosekLicneGreskeSezona = licneGreske / zavrsene;
                this.prosekIznudjeniFauloviSezona = iznudjeniFaulovi / zavrsene;
                this.brojOdigranihUtakmicaSezona = zavrsene;
              } else if (zavrsene == 0) {
                this.prosekPoenaSezona = 0;
                this.prosekSkokovaSezona = 0;
                this.prosekAsistencijaSezona = 0;
                this.prosekIndeksaSezona = 0;
                this.prosekMinutaSekSezona = 0;
                this.prosekDvaPoenaSezona = 0;
                this.prosekTriPoenaSezona = 0;
                this.prosekSlobodnoSezona = 0;
                this.prosekSkokoviNapadSezona = 0;
                this.prosekSkokoviOdbranaSezona = 0;
                this.prosekUkradeneSezona = 0;
                this.prosekIzgubljeneSezona = 0;
                this.prosekBlokadeSezona = 0;
                this.prosekBlokadePrimljeneSezona = 0;
                this.prosekLicneGreskeSezona = 0;
                this.prosekIznudjeniFauloviSezona = 0;
                this.brojOdigranihUtakmicaSezona = zavrsene;
              }
            }
          });
        }
      }
    });
  }

  promeniMod() {
    //alert("usao u promeni mod")
    //alert(this.mod)
    this.treningId = 0;
    this.sutevi = [];
    this.izracunajZone();
    if (this.mod === 'utakmica' && this.izabranaUtakmica > 0 && this.izabraniIgrac !== '') {
      //alert(this.mod)
      this.ucitajSuteve();
    }
    if (this.mod === 'trening' && this.treningId > 0 && this.izabraniIgrac !== '') {
      this.ucitajSuteve();
    }
  }
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

  vremeUSekunde(vreme: string): number {
    const [min, sec] = vreme.split(':').map(Number);
    return min * 60 + sec;
  }

  formatMinute(sekundi: number): string {
    const min = Math.floor(sekundi / 60);
    const sec = Math.round(sekundi % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }
  logOut() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }
  trenerPocetna() {
    this.router.navigate(['trener-pocetna']);
  }
  trenerIgraci() {
    this.router.navigate(['trener-igraci']);
  }
  postaviTab(tab: string) {
    this.aktivanTab = tab;
  }
  promeniIzbor() {
    if (this.izabranaSezona != -1) {
      this.izracunajProsekeSezona();
    } else {
      this.izracunajProsekeUkupno();
    }
    if (this.mod === 'utakmica') {
      this.izabranaUtakmica = 0;
      this.sutevi = [];
      this.izracunajZone();
    }
  }

  sortiraj(kolona: string, prviPut: boolean = false) {
    if (this.sortKolona === kolona && !prviPut) {
      // ista kolona - obrni smer
      this.sortSmer = this.sortSmer === 'desc' ? 'asc' : 'desc';
    } else {
      // nova kolona - kreni silazno
      this.sortKolona = kolona;
      this.sortSmer = 'desc';
    }
    const niz =
      this.izabranaSezona == -1 ? this.statistikeIgracaUtakmica : this.statistikeIgracaUtakmicaSezona;
    switch (kolona) {
      case 'datum': {
        niz.sort((a, b) => {
          const vrednostA = new Date(a.utakmica.datum).getTime();
          const vrednostB = new Date(b.utakmica.datum).getTime();
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'protivnik': {
        niz.sort((a, b) => {
          const vrednostA = a.protivnik;
          const vrednostB = b.protivnik;
          return this.sortSmer === 'desc'
            ? vrednostB.localeCompare(vrednostA)
            : vrednostA.localeCompare(vrednostB);
        });
        break;
      }
      case 'minuti': {
        niz.sort((a, b) => {
          const vrednostA = this.vremeUSekunde(a.statistikaIgraca.minuti);
          const vrednostB = this.vremeUSekunde(b.statistikaIgraca.minuti);
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'poeni': {
        niz.sort((a, b) => {
          const vrednostA = a.statistikaIgraca.poeni;
          const vrednostB = b.statistikaIgraca.poeni;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'dvaPoena': {
        niz.sort((a, b) => {
          const vrednostA = a.statistikaIgraca.dvaPoenaPogodak;
          const vrednostB = b.statistikaIgraca.dvaPoenaPogodak;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'triPoena': {
        niz.sort((a, b) => {
          const vrednostA = a.statistikaIgraca.triPoenaPogodak;
          const vrednostB = b.statistikaIgraca.triPoenaPogodak;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'slobodno': {
        niz.sort((a, b) => {
          const vrednostA = a.statistikaIgraca.slobodnoPogodak;
          const vrednostB = b.statistikaIgraca.slobodnoPogodak;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'skokoviNapad': {
        niz.sort((a, b) => {
          const vrednostA = a.statistikaIgraca.skokoviNapad;
          const vrednostB = b.statistikaIgraca.skokoviNapad;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'skokoviOdbrana': {
        niz.sort((a, b) => {
          const vrednostA = a.statistikaIgraca.skokoviOdbrana;
          const vrednostB = b.statistikaIgraca.skokoviOdbrana;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'skokovi': {
        niz.sort((a, b) => {
          const vrednostA = a.statistikaIgraca.skokoviUkupno;
          const vrednostB = b.statistikaIgraca.skokoviUkupno;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'asistencije': {
        niz.sort((a, b) => {
          const vrednostA = a.statistikaIgraca.asistencije;
          const vrednostB = b.statistikaIgraca.asistencije;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'ukradene': {
        niz.sort((a, b) => {
          const vrednostA = a.statistikaIgraca.ukradene;
          const vrednostB = b.statistikaIgraca.ukradene;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'izgubljene': {
        niz.sort((a, b) => {
          const vrednostA = a.statistikaIgraca.izgubljene;
          const vrednostB = b.statistikaIgraca.izgubljene;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'blokade': {
        niz.sort((a, b) => {
          const vrednostA = a.statistikaIgraca.blokade;
          const vrednostB = b.statistikaIgraca.blokade;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'licneGreske': {
        niz.sort((a, b) => {
          const vrednostA = a.statistikaIgraca.licneGreske;
          const vrednostB = b.statistikaIgraca.licneGreske;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'indeks': {
        niz.sort((a, b) => {
          const vrednostA = a.statistikaIgraca.indeks;
          const vrednostB = b.statistikaIgraca.indeks;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }

      default:
        break;
    }
  }
}
