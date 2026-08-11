import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IgraciService } from '../services/igraci-service';
import { StatistikaIgracaService } from '../services/statistika-igraca-service';
import { UtakmiceService } from '../services/utakmice-service';
import { TreneriService } from '../services/treneri-service';
import { StatistikaIgracaUtakmica } from '../models/statistikaIgracaUtakmica';
import { Chart } from 'chart.js';
import { Igrac } from '../models/igrac';
import { StatistikaIgraca } from '../models/statistkaIgraca';
import { Utakmica } from '../models/utakmica';
import { Trener } from '../models/trener';
import { DefaultSlikaService } from '../services/default-slika';
import { UtakmicaDogadjaji } from '../models/utakmicaDogadjaji';
import { UtakmicaDogadjajiService } from '../services/utakmica-dogadjaji-service';
import { Izvestaj } from '../models/izvestaj';
import { IzvestajService } from '../services/izvestaj-service';
import { Trening } from '../models/trening';
import { Sut } from '../models/sut';
import { TreningService } from '../services/trening-service';
import { SutService } from '../services/sut-service';
import { Router } from '@angular/router';

interface Zona {
  id: string;
  naziv: string;
  ploX: number; // gde ide pločica sa procentom
  ploY: number;
}

@Component({
  selector: 'app-igrac-stranica',
  imports: [FormsModule, CommonModule],
  templateUrl: './igrac-stranica.html',
  styleUrls: ['../../styles.css', './igrac-stranica.css'],
})
export class IgracStranica {
  @ViewChild('formaChart') formaChartRef!: ElementRef<HTMLCanvasElement>;

  constructor(
    private router: Router,
    private igracService: IgraciService,
    private statistikaIgracaService: StatistikaIgracaService,
    private utakmiceService: UtakmiceService,
    private treneriService: TreneriService,
    private defaultSlikaService: DefaultSlikaService,
    private utakmicaDogadjajiService: UtakmicaDogadjajiService,
    private izvestajService: IzvestajService,
    private treningService: TreningService,
    private sutService: SutService,
  ) {}

  ngOnInit() {
    this.igracString = sessionStorage.getItem('korisnickoImeI'); // korisnickoIme
    if (this.igracString != null) {
      this.izabraniIgrac = this.igracString;
      this.izracunajZone();
      this.treneriService.getAllTreneri().subscribe((data) => {
        this.sviTreneri = data;
      });
      this.igracService.getAllIgraci().subscribe((data) => {
        this.sviIgraci = data;
      });
      this.igracService.getIgracKorisnickoIme(this.igracString).subscribe((data) => {
        if (data == null) {
          return;
        }
        this.igrac = data;
        this.treningService.getTreninziIgraca(this.igrac.korisnickoIme).subscribe((tr) => {
          this.treninzi = tr;
          this.treneriService.getTrenerKorisnickoIme(this.igrac.trener).subscribe((tr) => {
            this.trener = tr;
            this.korisnickoImeTrenera = tr.korisnickoIme;
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
        this.izvestajService.getIzvestajiIgraca(this.igrac.korisnickoIme).subscribe((iz) => {
          //  alert(this.igrac.korisnickoIme);
          this.izvestaji = iz;
          //     alert(this.izvestaji[0]);
          this.izvestajiNovi = this.izvestaji.filter((i) => {
            return !i.procitan;
          });
          //      alert(this.izvestajiNovi[0]);
          this.izvestajiStari = this.izvestaji.filter((i) => {
            return i.procitan;
          });
          //       alert(this.izvestajiStari[0]);
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
  izabraniTip: string = 'sve';

  // sortiranje
  sortKolona: string = 'datum';
  sortSmer: 'asc' | 'desc' = 'desc';

  korisnickoImeTrenera: string | null = '';
  trener: Trener = new Trener();
  brojOdigranihUtakmica: number = 0;
  startovaoUtakmica: number = 0;
  statistikeIgracaUtakmica: StatistikaIgracaUtakmica[] = [];
  statsUtakmica: StatistikaIgracaUtakmica = new StatistikaIgracaUtakmica();

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

  tipKorisnika: string = '';

  korisnickoImeI: string = '';
  staraLozinkaI: string = '';
  lozinkaI: string = '';
  potvrdaLozinkeI: string = '';
  imeI: string = '';
  prezimeI: string = '';
  telefonI: string = '';
  mejlI: string = '';
  klubI: string = '';
  slikaI: any = '';
  datumRodjenjaI: string = '';
  brojI: number = 0;
  pozicijaI: string = '';
  visinaI: number = 0;
  novaLozinkaI: string = '';

  message: string = '';
  messageL: string = '';

  sviIgraci: Igrac[] = [];
  sviTreneri: Trener[] = [];
  sviIgraciTrenera: Igrac[] = [];

  defaultSlika: any = '';

  selectFokus = false;
  editovanje: boolean = false;

  isDragging = false;

  aktivanTab: string = 'statistika';

  izvestaji: Izvestaj[] = [];
  izvestajiNovi: Izvestaj[] = [];
  izvestajiStari: Izvestaj[] = [];

  // proseci

  mod: 'trening' | 'utakmica' = 'trening';
  treninzi: Trening[] = [];
  sutevi: Sut[] = [];
  treningId: number = 0;
  izabranaUtakmica: number = 0;
  izabraniIgrac: string = '';

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
              (utakmica.status == 'pobeda' ||
                utakmica.status == 'poraz' ||
                utakmica.status == 'nereseno') &&
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
              (utakmica.status == 'pobeda' ||
                utakmica.status == 'poraz' ||
                utakmica.status == 'nereseno') &&
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
      this.izabranaSezona == -1
        ? this.statistikeIgracaUtakmica
        : this.statistikeIgracaUtakmicaSezona;
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

  otvoriIzvestaj(izvestaj: Izvestaj) {
    izvestaj.otvoren = !izvestaj.otvoren;
  }
  procitaoIzvestaj(izvestaj: Izvestaj) {
    if (!izvestaj.procitan) {
      this.izvestajService.procitaoIzvestaj(izvestaj.id).subscribe((data) => {
        izvestaj.procitan = true;
        this.izvestajiNovi = this.izvestaji.filter((i) => {
          return !i.procitan;
        });
        this.izvestajiStari = this.izvestaji.filter((i) => {
          return i.procitan;
        });
      });
    }
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

  promeniLozinku() {
    if (this.staraLozinkaI === '' || this.novaLozinkaI === '' || this.potvrdaLozinkeI === '') {
      this.messageL = 'Popunite sva polja za promenu lozinke';
      return;
    }
    if (this.novaLozinkaI !== this.potvrdaLozinkeI) {
      this.messageL = 'Nova lozinka i potvrda se ne poklapaju';
      return;
    }
    const lozinkaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!lozinkaRegex.test(this.novaLozinkaI)) {
      this.messageL =
        'Lozinka mora imati minimum 8 karaktera, i to barem po jedno veliko slovo, malo slovo, broj i najmanje jedan specijalni karakter';
      return;
    }
    if (this.novaLozinkaI === this.staraLozinkaI) {
      this.messageL = 'Nova lozinka mora biti različita od stare';
      return;
    }
    this.igracService
      .updateIgracLozinka(this.igrac.korisnickoIme, this.staraLozinkaI, this.novaLozinkaI)
      .subscribe((data) => {
        if (data.message === 'ok') {
          alert('Lozinka je uspešno promenjena');
          this.staraLozinkaI = '';
          this.novaLozinkaI = '';
          this.potvrdaLozinkeI = '';
        } else if (data.message === 'pogresnaStara') {
          this.messageL = 'Stara lozinka nije tačna';
        } else {
          this.messageL = 'Greška pri promeni lozinke';
        }
      });
  }
  azurirajPodatke() {
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

    if (this.korisnickoImeI !== '') {
      const usernameRegex = /^[A-Za-z][a-zA-Z0-9.@$]{2,19}$/;
      if (!usernameRegex.test(this.korisnickoImeI)) {
        this.message = 'Korisničko ime nije u ispravnom formatu';
        return;
      }
    }
    if (this.mejlI !== '') {
      const regexMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!regexMail.test(this.mejlI)) {
        this.message = 'Mejl nije u ispravnom formatu';
        return;
      }
    }
    if (this.imeI !== '') {
      const regexIme = /^[A-Z][a-zA-Z]+(?:['\s-][a-zA-Z]+)*$/;
      if (!regexIme.test(this.imeI)) {
        this.message = 'Ime nije u ispravnom formatu';
        return;
      }
    }
    if (this.prezimeI !== '') {
      const regexPrezime = /^[A-Z][a-zA-Z]+(?:['\s-][a-zA-Z]+)*$/;
      if (!regexPrezime.test(this.prezimeI)) {
        this.message = 'Prezime nije u ispravnom formatu';
        return;
      }
    }
    if (this.korisnickoImeI !== '' && this.korisnickoImeI !== this.igrac.korisnickoIme) {
      this.igracService
        .updateKorisnickoIme(this.igrac.korisnickoIme, this.korisnickoImeI)
        .subscribe((data) => {
          const noviToken = data.token;
          this.statistikaIgracaService
            .updateKorisnickoIme(this.igrac.korisnickoIme, this.korisnickoImeI)
            .subscribe(() => {
              this.utakmicaDogadjajiService
                .updateKorisnickoIme(this.igrac.korisnickoIme, this.korisnickoImeI)
                .subscribe(() => {
                  this.treningService
                    .updateKorisnickoIme(this.igrac.korisnickoIme, this.korisnickoImeI)
                    .subscribe(() => {
                      this.sutService
                        .updateKorisnickoIme(this.igrac.korisnickoIme, this.korisnickoImeI)
                        .subscribe(() => {
                          this.igrac.korisnickoIme = this.korisnickoImeI;
                          sessionStorage.setItem('korisnickoImeI', this.korisnickoImeI);
                          if (noviToken) sessionStorage.setItem('tokenI', noviToken); // token je do sada nosio staro ime

                          let ukupno = 0;
                          let zavrseno = 0;
                          const proveriZavrseno = () => {
                            zavrseno++;
                            if (zavrseno === ukupno) {
                              alert('Podaci su ažurirani');
                            }
                          };

                          if (this.mejlI !== '' && this.mejlI !== this.igrac.mail) ukupno++;
                          if (this.imeI !== '' && this.imeI !== this.igrac.ime) ukupno++;
                          if (this.prezimeI !== '' && this.prezimeI !== this.igrac.prezime) ukupno++;
                          if (this.slikaI !== '') ukupno++;

                          if (ukupno === 0) {
                            alert('Podaci su ažurirani');
                          }

                          if (this.mejlI !== '' && this.mejlI !== this.igrac.mail) {
                            this.igracService
                              .updateIgracMejl(this.igrac.korisnickoIme, this.mejlI)
                              .subscribe(() => {
                                this.igrac.mail = this.mejlI;
                                proveriZavrseno();
                              });
                          }
                          if (this.imeI !== '' && this.imeI !== this.igrac.ime) {
                            this.igracService
                              .updateIgracIme(this.igrac.korisnickoIme, this.imeI)
                              .subscribe(() => {
                                this.statistikaIgracaService
                                  .updateIgracIme(this.igrac.korisnickoIme, this.imeI)
                                  .subscribe(() => {
                                    this.utakmicaDogadjajiService
                                      .updateIgracIme(this.igrac.korisnickoIme, this.imeI)
                                      .subscribe(() => {
                                        this.igrac.ime = this.imeI;
                                        proveriZavrseno();
                                      });
                                  });
                              });
                          }
                          if (this.prezimeI !== '' && this.prezimeI !== this.igrac.prezime) {
                            this.igracService
                              .updateIgracPrezime(this.igrac.korisnickoIme, this.prezimeI)
                              .subscribe(() => {
                                this.statistikaIgracaService
                                  .updateIgracPrezime(this.igrac.korisnickoIme, this.prezimeI)
                                  .subscribe(() => {
                                    this.utakmicaDogadjajiService
                                      .updateIgracPrezime(this.igrac.korisnickoIme, this.prezimeI)
                                      .subscribe(() => {
                                        this.igrac.prezime = this.prezimeI;
                                        proveriZavrseno();
                                      });
                                  });
                              });
                          }
                          if (this.slikaI !== '') {
                            this.igracService
                              .updateIgracSlika(this.igrac.korisnickoIme, this.slikaI)
                              .subscribe((msgSlika) => {
                                this.igrac.slika = this.slikaI;
                                proveriZavrseno();
                              });
                          }
                        });
                    });
                });
            });
        });
    } else {
      let ukupno = 0;
      let zavrseno = 0;
      const proveriZavrseno = () => {
        zavrseno++;
        if (zavrseno === ukupno) {
          alert('Podaci su ažurirani');
        }
      };

      if (this.mejlI !== '' && this.mejlI !== this.igrac.mail) ukupno++;
      if (this.imeI !== '' && this.imeI !== this.igrac.ime) ukupno++;
      if (this.prezimeI !== '' && this.prezimeI !== this.igrac.prezime) ukupno++;
      if (this.slikaI !== '') ukupno++;

      if (this.mejlI !== '' && this.mejlI !== this.igrac.mail) {
        this.igracService.updateIgracMejl(this.igrac.korisnickoIme, this.mejlI).subscribe(() => {
          this.igrac.mail = this.mejlI;
          proveriZavrseno();
        });
      }
      if (this.imeI !== '' && this.imeI !== this.igrac.ime) {
        this.igracService.updateIgracIme(this.igrac.korisnickoIme, this.imeI).subscribe(() => {
          this.statistikaIgracaService
            .updateIgracIme(this.igrac.korisnickoIme, this.imeI)
            .subscribe(() => {
              this.utakmicaDogadjajiService
                .updateIgracIme(this.igrac.korisnickoIme, this.imeI)
                .subscribe(() => {
                  this.igrac.ime = this.imeI;
                  proveriZavrseno();
                });
            });
        });
      }
      if (this.prezimeI !== '' && this.prezimeI !== this.igrac.prezime) {
        this.igracService
          .updateIgracPrezime(this.igrac.korisnickoIme, this.prezimeI)
          .subscribe(() => {
            this.statistikaIgracaService
              .updateIgracPrezime(this.igrac.korisnickoIme, this.prezimeI)
              .subscribe(() => {
                this.utakmicaDogadjajiService
                  .updateIgracPrezime(this.igrac.korisnickoIme, this.prezimeI)
                  .subscribe(() => {
                    this.igrac.prezime = this.prezimeI;
                    proveriZavrseno();
                  });
              });
          });
      }
      if (this.slikaI !== '') {
        this.igracService
          .updateIgracSlika(this.igrac.korisnickoIme, this.slikaI)
          .subscribe((msgSlika) => {
            this.igrac.slika = this.slikaI;
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
        this.slikaI = reader.result;
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

  postaviTab(tab: string) {
    this.aktivanTab = tab;
  }
  logOut() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
