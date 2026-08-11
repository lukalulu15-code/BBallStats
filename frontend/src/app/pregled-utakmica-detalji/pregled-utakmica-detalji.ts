import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { UtakmiceService } from '../services/utakmice-service';
import { TreneriService } from '../services/treneri-service';
import { StatistikaIgracaService } from '../services/statistika-igraca-service';
import { UtakmicaDogadjajiService } from '../services/utakmica-dogadjaji-service';
import { Utakmica } from '../models/utakmica';
import { StatistikaIgraca } from '../models/statistkaIgraca';
import { UtakmicaDogadjaji } from '../models/utakmicaDogadjaji';
import { Chart, registerables } from 'chart.js';
import { IgraciService } from '../services/igraci-service';
import { Igrac } from '../models/igrac';
import { Sut } from '../models/sut';
import { SutService } from '../services/sut-service';

interface Zona {
  id: string;
  naziv: string;
  ploX: number; // gde ide pločica sa procentom
  ploY: number;
}

Chart.register(...registerables);

@Component({
  selector: 'app-pregled-utakmica-detalji',
  imports: [FormsModule, CommonModule],
  templateUrl: './pregled-utakmica-detalji.html',
  styleUrls: ['../../styles.css', './pregled-utakmica-detalji.css'],
})
export class PregledUtakmicaDetalji {
  @ViewChild('terenSvg') terenSvgRef!: ElementRef<SVGElement>;
  @ViewChild('scoreChart') scoreChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieDomaciPoeni') pieDomaciRefPoeni!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieGostiPoeni') pieGostiRefPoeni!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieDomaciSkokovi') pieDomaciRefSkokovi!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieGostiSkokovi') pieGostiRefSkokovi!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieDomaciAsistencije') pieDomaciRefAsistencije!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieGostiAsistencije') pieGostiRefAsistencije!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieDomaciUkradene') pieDomaciRefUkradene!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieGostiUkradene') pieGostiRefUkradene!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieDomaciIzgubljene') pieDomaciRefIzgubljene!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieGostiIzgubljene') pieGostiRefIzgubljene!: ElementRef<HTMLCanvasElement>;
  constructor(
    private router: Router,
    private utakmiceService: UtakmiceService,
    private statistikaIgracaService: StatistikaIgracaService,
    private utakmicaDogadjajiService: UtakmicaDogadjajiService,
    private treneriService: TreneriService,
    private igracService: IgraciService,
    private sutService: SutService,
  ) {}

  ngOnInit() {
    this.aktivanTab = 'boxscore';
    this.utakmicaString = sessionStorage.getItem('utakmica');
    this.trenerId = sessionStorage.getItem('korisnickoImeT') || '';
    if (this.trenerId === '') return;
    if (this.utakmicaString != null) {
      this.utakmicaId = JSON.parse(this.utakmicaString);
      if (this.utakmicaId != null) {
        this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((data) => {
          if (data == null) {
            this.nemaUtakmice = true;
            return;
          }
          this.utakmica = data;
          this.treneriService.getTrenerKorisnickoIme(this.trenerId).subscribe((trener) => {
            this.klub = trener.klub;
            this.igracService
              .getAllIgraciTrenera(this.trenerId)
              .subscribe((data) => (this.igraci = data));
            this.utakmiceService
              .getDateSortedAllUtakmice(this.trenerId)
              .subscribe((data) => (this.utakmice = data));
              this.statistikaIgracaService.getIgraciKlubUtakmica(this.utakmica.id,trener.klub).subscribe((nasiSt)=>{
                this.nasiStats=nasiSt;
              })
          });
          this.izabraniIgrac = '';
          this.izracunajZone();
          this.ucitajSuteve();
          this.prikaziEkipu = this.utakmica.domacin;
          this.statistikaIgracaService
            .getIgraciKlubUtakmica(this.utakmica.id, this.utakmica.domacin)
            .subscribe((statsIgraci) => {
              this.domaciIgraciStats = statsIgraci;
              for (let i = 0; i < statsIgraci.length; i++) {
                if (statsIgraci[i].starter) {
                  this.domaciStarteriPoeni += statsIgraci[i].poeni;
                  this.domaciStarteriSkokovi += statsIgraci[i].skokoviUkupno;
                  this.domaciStarteriAsistencije += statsIgraci[i].asistencije;
                  this.domaciStarteriIzgubljene += statsIgraci[i].izgubljene;
                  this.domaciStarteriUkradene += statsIgraci[i].ukradene;
                } else {
                  this.domaciKlupaPoeni += statsIgraci[i].poeni;
                  this.domaciKlupaSkokovi += statsIgraci[i].skokoviUkupno;
                  this.domaciKlupaAsistencije += statsIgraci[i].asistencije;
                  this.domaciKlupaIzgubljene += statsIgraci[i].izgubljene;
                  this.domaciKlupaUkradene += statsIgraci[i].ukradene;
                }
                this.minutiUkupnoDomaci += this.vremeUSekunde(statsIgraci[i].minuti);
                this.poeniUkupnoDomaci += statsIgraci[i].poeni;
                this.dvaPoenaPogodakUkupnoDomaci += statsIgraci[i].dvaPoenaPogodak;
                this.dvaPoenaPromasajUkupnoDomaci += statsIgraci[i].dvaPoenaPromasaj;
                this.triPoenaPogodakUkupnoDomaci += statsIgraci[i].triPoenaPogodak;
                this.triPoenaPromasajUkupnoDomaci += statsIgraci[i].triPoenaPromasaj;
                this.triPoenaProcenatUkupnoDomaci += statsIgraci[i].triPoenaProcenat;
                this.slobodnoPogodakUkupnoDomaci += statsIgraci[i].slobodnoPogodak;
                this.slobodnoPromasajUkupnoDomaci += statsIgraci[i].slobodnoPromasaj;
                this.slobodnoProcenatUkupnoDomaci += statsIgraci[i].slobodnoProcenat;
                this.skokoviNapadUkupnoDomaci += statsIgraci[i].skokoviNapad;
                this.skokoviOdbranaUkupnoDomaci += statsIgraci[i].skokoviOdbrana;
                this.skokoviUkupnoUkupnoDomaci += statsIgraci[i].skokoviUkupno;
                this.asistencijeUkupnoDomaci += statsIgraci[i].asistencije;
                this.ukradeneUkupnoDomaci += statsIgraci[i].ukradene;
                this.izgubljeneUkupnoDomaci += statsIgraci[i].izgubljene;
                this.blokadeUkupnoDomaci += statsIgraci[i].blokade;
                this.blokadePrimljeneUkupnoDomaci += statsIgraci[i].blokadePrimljene;
                this.licneGreskeUkupnoDomaci += statsIgraci[i].licneGreske;
                this.iznudjeniFauloviUkupnoDomaci += statsIgraci[i].iznudjeniFaulovi;
                this.indeksUkupnoDomaci += statsIgraci[i].indeks;
                this.plusMinusUkupnoDomaci += statsIgraci[i].plusMinus;
                if (i == statsIgraci.length - 1) {
                  if (this.dvaPoenaPogodakUkupnoDomaci + this.dvaPoenaPromasajUkupnoDomaci != 0) {
                    this.dvaPoenaProcenatUkupnoDomaci =
                      (this.dvaPoenaPogodakUkupnoDomaci /
                        (this.dvaPoenaPogodakUkupnoDomaci + this.dvaPoenaPromasajUkupnoDomaci)) *
                      100;
                  } else {
                    this.dvaPoenaProcenatUkupnoDomaci = 0;
                  }
                  if (this.triPoenaPogodakUkupnoDomaci + this.triPoenaPromasajUkupnoDomaci != 0) {
                    this.triPoenaProcenatUkupnoDomaci =
                      (this.triPoenaPogodakUkupnoDomaci /
                        (this.triPoenaPogodakUkupnoDomaci + this.triPoenaPromasajUkupnoDomaci)) *
                      100;
                  } else {
                    this.triPoenaProcenatUkupnoDomaci = 0;
                  }
                  if (this.slobodnoPogodakUkupnoDomaci + this.slobodnoPromasajUkupnoDomaci != 0) {
                    this.slobodnoProcenatUkupnoDomaci =
                      (this.slobodnoPogodakUkupnoDomaci /
                        (this.slobodnoPogodakUkupnoDomaci + this.slobodnoPromasajUkupnoDomaci)) *
                      100;
                  } else {
                    this.slobodnoProcenatUkupnoDomaci = 0;
                  }
                }
              }
              this.statistikaIgracaService
                .getIgraciKlubUtakmica(this.utakmica.id, this.utakmica.gost)
                .subscribe((statsIgraci) => {
                  this.gostujuciIgraciStats = statsIgraci;
                  for (let i = 0; i < statsIgraci.length; i++) {
                    if (statsIgraci[i].starter) {
                      this.gostiStarteriPoeni += statsIgraci[i].poeni;
                      this.gostiStarteriSkokovi += statsIgraci[i].skokoviUkupno;
                      this.gostiStarteriAsistencije += statsIgraci[i].asistencije;
                      this.gostiStarteriIzgubljene += statsIgraci[i].izgubljene;
                      this.gostiStarteriUkradene += statsIgraci[i].ukradene;
                    } else {
                      this.gostiKlupaPoeni += statsIgraci[i].poeni;
                      this.gostiKlupaSkokovi += statsIgraci[i].skokoviUkupno;
                      this.gostiKlupaAsistencije += statsIgraci[i].asistencije;
                      this.gostiKlupaIzgubljene += statsIgraci[i].izgubljene;
                      this.gostiKlupaUkradene += statsIgraci[i].ukradene;
                    }
                    this.minutiUkupnoGosti += this.vremeUSekunde(statsIgraci[i].minuti);
                    this.poeniUkupnoGosti += statsIgraci[i].poeni;
                    this.dvaPoenaPogodakUkupnoGosti += statsIgraci[i].dvaPoenaPogodak;
                    this.dvaPoenaPromasajUkupnoGosti += statsIgraci[i].dvaPoenaPromasaj;
                    this.dvaPoenaProcenatUkupnoGosti += statsIgraci[i].dvaPoenaProcenat;
                    this.triPoenaPogodakUkupnoGosti += statsIgraci[i].triPoenaPogodak;
                    this.triPoenaPromasajUkupnoGosti += statsIgraci[i].triPoenaPromasaj;
                    this.triPoenaProcenatUkupnoGosti += statsIgraci[i].triPoenaProcenat;
                    this.slobodnoPogodakUkupnoGosti += statsIgraci[i].slobodnoPogodak;
                    this.slobodnoPromasajUkupnoGosti += statsIgraci[i].slobodnoPromasaj;
                    this.slobodnoProcenatUkupnoGosti += statsIgraci[i].slobodnoProcenat;
                    this.skokoviNapadUkupnoGosti += statsIgraci[i].skokoviNapad;
                    this.skokoviOdbranaUkupnoGosti += statsIgraci[i].skokoviOdbrana;
                    this.skokoviUkupnoUkupnoGosti += statsIgraci[i].skokoviUkupno;
                    this.asistencijeUkupnoGosti += statsIgraci[i].asistencije;
                    this.ukradeneUkupnoGosti += statsIgraci[i].ukradene;
                    this.izgubljeneUkupnoGosti += statsIgraci[i].izgubljene;
                    this.blokadeUkupnoGosti += statsIgraci[i].blokade;
                    this.blokadePrimljeneUkupnoGosti += statsIgraci[i].blokadePrimljene;
                    this.licneGreskeUkupnoGosti += statsIgraci[i].licneGreske;
                    this.iznudjeniFauloviUkupnoGosti += statsIgraci[i].iznudjeniFaulovi;
                    this.indeksUkupnoGosti += statsIgraci[i].indeks;
                    this.plusMinusUkupnoGosti += statsIgraci[i].plusMinus;
                    if (i == statsIgraci.length - 1) {
                      if (this.dvaPoenaPogodakUkupnoGosti + this.dvaPoenaPromasajUkupnoGosti != 0) {
                        this.dvaPoenaProcenatUkupnoGosti =
                          (this.dvaPoenaPogodakUkupnoGosti /
                            (this.dvaPoenaPogodakUkupnoGosti + this.dvaPoenaPromasajUkupnoGosti)) *
                          100;
                      } else {
                        this.dvaPoenaProcenatUkupnoGosti = 0;
                      }
                      if (this.triPoenaPogodakUkupnoGosti + this.triPoenaPromasajUkupnoGosti != 0) {
                        this.triPoenaProcenatUkupnoGosti =
                          (this.triPoenaPogodakUkupnoGosti /
                            (this.triPoenaPogodakUkupnoGosti + this.triPoenaPromasajUkupnoGosti)) *
                          100;
                      } else {
                        this.triPoenaProcenatUkupnoGosti = 0;
                      }
                      if (this.slobodnoPogodakUkupnoGosti + this.slobodnoPromasajUkupnoGosti != 0) {
                        this.slobodnoProcenatUkupnoGosti =
                          (this.slobodnoPogodakUkupnoGosti /
                            (this.slobodnoPogodakUkupnoGosti + this.slobodnoPromasajUkupnoGosti)) *
                          100;
                      } else {
                        this.slobodnoProcenatUkupnoGosti = 0;
                      }
                    }
                  }
                });
            });
          this.utakmicaDogadjajiService
            .getAllDogadjajiCetvrtina(this.utakmica.id, 1)
            .subscribe((dogadjajiPrva) => {
              this.dogadjajiPrvaCetvrtina = dogadjajiPrva;
              this.utakmicaDogadjajiService
                .getAllDogadjajiCetvrtina(this.utakmica.id, 2)
                .subscribe((dogadjajiDruga) => {
                  this.dogadjajiDrugaCetvrtina = dogadjajiDruga;
                  this.utakmicaDogadjajiService
                    .getAllDogadjajiCetvrtina(this.utakmica.id, 3)
                    .subscribe((dogadjajiTreca) => {
                      this.dogadjajiTrecaCetvrtina = dogadjajiTreca;
                      this.utakmicaDogadjajiService
                        .getAllDogadjajiCetvrtina(this.utakmica.id, 4)
                        .subscribe((dogadjajiCetvrta) => {
                          this.dogadjajiCetvrtaCetvrtina = dogadjajiCetvrta;
                          this.utakmicaDogadjajiService
                            .getAllDogadjajiProduzeci(this.utakmica.id)
                            .subscribe((dogadjajiOt) => {
                              this.dogadjajiProduzetak = dogadjajiOt;
                              this.utakmicaDogadjajiService
                                .getAllDogadjaji(this.utakmica.id)
                                .subscribe((dogadjajiSvi) => {
                                  this.sviDogadjaji = dogadjajiSvi;
                                });
                            });
                        });
                    });
                });
            });
        });
      } else {
        this.nemaUtakmice = true;
      }
    } else {
      this.nemaUtakmice = true;
    }
  }
  utakmicaString: string | null = '';
  utakmicaId: number | null = 0;
  utakmica: Utakmica = new Utakmica();
  nemaUtakmice: boolean = false;

  aktivanTab: string = 'box score';

  domaciIgraciStats: StatistikaIgraca[] = [];
  gostujuciIgraciStats: StatistikaIgraca[] = [];
  prikaziEkipu: string = '';

  dogadjajiPrvaCetvrtina: UtakmicaDogadjaji[] = [];
  dogadjajiDrugaCetvrtina: UtakmicaDogadjaji[] = [];
  dogadjajiTrecaCetvrtina: UtakmicaDogadjaji[] = [];
  dogadjajiCetvrtaCetvrtina: UtakmicaDogadjaji[] = [];
  dogadjajiProduzetak: UtakmicaDogadjaji[] = [];
  dogadjajId: number = 0;
  sviDogadjaji: UtakmicaDogadjaji[] = [];

  minutiUkupnoDomaci: number = 0;
  poeniUkupnoDomaci: number = 0;
  dvaPoenaPogodakUkupnoDomaci: number = 0;
  dvaPoenaPromasajUkupnoDomaci: number = 0;
  dvaPoenaProcenatUkupnoDomaci: number = 0;
  triPoenaPogodakUkupnoDomaci: number = 0;
  triPoenaPromasajUkupnoDomaci: number = 0;
  triPoenaProcenatUkupnoDomaci: number = 0;
  slobodnoPogodakUkupnoDomaci: number = 0;
  slobodnoPromasajUkupnoDomaci: number = 0;
  slobodnoProcenatUkupnoDomaci: number = 0;
  skokoviNapadUkupnoDomaci: number = 0;
  skokoviOdbranaUkupnoDomaci: number = 0;
  skokoviUkupnoUkupnoDomaci: number = 0;
  asistencijeUkupnoDomaci: number = 0;
  ukradeneUkupnoDomaci: number = 0;
  izgubljeneUkupnoDomaci: number = 0;
  blokadeUkupnoDomaci: number = 0;
  blokadePrimljeneUkupnoDomaci: number = 0;
  licneGreskeUkupnoDomaci: number = 0;
  iznudjeniFauloviUkupnoDomaci: number = 0;
  indeksUkupnoDomaci: number = 0;
  plusMinusUkupnoDomaci: number = 0;

  minutiUkupnoGosti: number = 0;
  poeniUkupnoGosti: number = 0;
  dvaPoenaPogodakUkupnoGosti: number = 0;
  dvaPoenaPromasajUkupnoGosti: number = 0;
  dvaPoenaProcenatUkupnoGosti: number = 0;
  triPoenaPogodakUkupnoGosti: number = 0;
  triPoenaPromasajUkupnoGosti: number = 0;
  triPoenaProcenatUkupnoGosti: number = 0;
  slobodnoPogodakUkupnoGosti: number = 0;
  slobodnoPromasajUkupnoGosti: number = 0;
  slobodnoProcenatUkupnoGosti: number = 0;
  skokoviNapadUkupnoGosti: number = 0;
  skokoviOdbranaUkupnoGosti: number = 0;
  skokoviUkupnoUkupnoGosti: number = 0;
  asistencijeUkupnoGosti: number = 0;
  ukradeneUkupnoGosti: number = 0;
  izgubljeneUkupnoGosti: number = 0;
  blokadeUkupnoGosti: number = 0;
  blokadePrimljeneUkupnoGosti: number = 0;
  licneGreskeUkupnoGosti: number = 0;
  iznudjeniFauloviUkupnoGosti: number = 0;
  indeksUkupnoGosti: number = 0;
  plusMinusUkupnoGosti: number = 0;
  pbpCetvrtina: number = 1;

  chart: Chart | null = null;
  pieDomaciChartPoeni: Chart | null = null;
  pieGostiChartPoeni: Chart | null = null;
  pieDomaciChartSkokovi: Chart | null = null;
  pieGostiChartSkokovi: Chart | null = null;
  pieDomaciChartAsistencije: Chart | null = null;
  pieGostiChartAsistencije: Chart | null = null;
  pieDomaciChartUkradene: Chart | null = null;
  pieGostiChartUkradene: Chart | null = null;
  pieDomaciChartIzgubljene: Chart | null = null;
  pieGostiChartIzgubljene: Chart | null = null;

  domaciStarteriPoeni: number = 0;
  domaciKlupaPoeni: number = 0;
  domaciStarteriSkokovi: number = 0;
  domaciKlupaSkokovi: number = 0;
  domaciStarteriAsistencije: number = 0;
  domaciKlupaAsistencije: number = 0;
  domaciStarteriUkradene: number = 0;
  domaciKlupaUkradene: number = 0;
  domaciStarteriIzgubljene: number = 0;
  domaciKlupaIzgubljene: number = 0;

  gostiStarteriPoeni: number = 0;
  gostiKlupaPoeni: number = 0;
  gostiStarteriSkokovi: number = 0;
  gostiKlupaSkokovi: number = 0;
  gostiStarteriAsistencije: number = 0;
  gostiKlupaAsistencije: number = 0;
  gostiStarteriUkradene: number = 0;
  gostiKlupaUkradene: number = 0;
  gostiStarteriIzgubljene: number = 0;
  gostiKlupaIzgubljene: number = 0;

  trenerId: string = '';
  klub: string = '';
  igraci: Igrac[] = [];
  nasiStats:StatistikaIgraca[]=[];
  utakmice: Utakmica[] = [];
  izabraniIgrac: string = '';
  sutevi: Sut[] = [];

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
    this.sutevi = [];
    this.izracunajZone();
    // za utakmicu odmah učitaj šuteve, za trening čekaj dugme
    this.ucitajSuteve();
  }

  ucitajSuteve() {
    if (this.izabraniIgrac === '') {
      this.sutService.getSuteviUtakmicaSvih(this.utakmica.id).subscribe((data) => {
        this.sutevi = data;
        this.izracunajZone();
      });
    } else {
      this.sutService.getSuteviUtakmica(this.izabraniIgrac, this.utakmica.id).subscribe((data) => {
        this.sutevi = data;
        this.izracunajZone();
      });
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

  postaviTab(tab: string) {
    this.aktivanTab = tab;
    if (tab === 'poredjenje') {
      // sačekaj da se canvas renderuje, pa crtaj
      setTimeout(() => {
        this.nacrtajGrafikon();
        this.nacrtajPieCharts();
      }, 0);
    }
  }

  izaberiBox(tim: string) {
    this.prikaziEkipu = tim;
  }

  vremeUSekunde(vreme: string): number {
    const [min, sec] = vreme.split(':').map(Number);
    return min * 60 + sec;
  }

  formatMinute(sekundi: number): string {
    const min = Math.floor(sekundi / 60);
    const sec = sekundi % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  izaberiCetvrtinuPbp(cetvrtina: number) {
    this.pbpCetvrtina = cetvrtina;
  }

  izracunajProcenat(skorDomacin: number, skorGost: number): number {
    const ukupno = skorDomacin + skorGost;
    if (ukupno === 0) return 50; // Ako je 0:0, stoji na sredini
    return (skorDomacin / ukupno) * 100;
  }

  pripremiPodatkeZaGrafikon() {
    const sortirani = [...this.sviDogadjaji].sort((a, b) => {
      const minA = this.apsolutniMinut(a.cetvrtina, a.vreme);
      const minB = this.apsolutniMinut(b.cetvrtina, b.vreme);
      if (minA !== minB) return minA - minB;
      return a.id - b.id;
    });

    let maxMinut = 40;
    if (sortirani.length > 0) {
      const poslednji = sortirani[sortirani.length - 1];
      maxMinut = Math.max(40, Math.ceil(this.apsolutniMinut(poslednji.cetvrtina, poslednji.vreme)));
    }

    const tackeDomacin: { x: number; y: number }[] = [];
    const tackeGost: { x: number; y: number }[] = [];

    let idx = 0;
    let poeniD = 0;
    let poeniG = 0;

    for (let minut = 0; minut <= maxMinut; minut++) {
      // primeni sve događaje koji su se desili do ovog minuta
      while (
        idx < sortirani.length &&
        this.apsolutniMinut(sortirani[idx].cetvrtina, sortirani[idx].vreme) <= minut
      ) {
        poeniD = sortirani[idx].poeniDomacin;
        poeniG = sortirani[idx].poeniGost;
        idx++;
      }
      tackeDomacin.push({ x: minut, y: poeniD });
      tackeGost.push({ x: minut, y: poeniG });
    }

    return { tackeDomacin, tackeGost };
  }

  // minut od početka utakmice (za grafikon, raste 0 → 40)
  apsolutniMinut(cetvrtina: number, vreme: string): number {
    const [min, sec] = vreme.split(':').map(Number);
    const preostalo = min + sec / 60; // koliko ostalo u četvrtini (u minutima)
    const protekloUCetvrtini = 10 - preostalo; // koliko prošlo u ovoj četvrtini
    return (cetvrtina - 1) * 10 + protekloUCetvrtini;
  }

  nacrtajGrafikon() {
    const { tackeDomacin, tackeGost } = this.pripremiPodatkeZaGrafikon();

    if (this.chart) this.chart.destroy(); // uništi stari ako postoji

    this.chart = new Chart(this.scoreChartRef.nativeElement, {
      type: 'line',
      data: {
        datasets: [
          {
            label: this.utakmica.domacin,
            data: tackeDomacin,
            borderColor: '#d4af37', // zlatna za domaće
            backgroundColor: '#d4af37',
            stepped: false,
            pointRadius: 3,
            tension: 0,
          },
          {
            label: this.utakmica.gost,
            data: tackeGost,
            borderColor: '#3aa0e0', // plava za goste
            backgroundColor: '#3aa0e0',
            stepped: false,
            pointRadius: 3,
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'linear',
            title: { display: true, text: 'Minut', color: '#95a5a6' },
            min: 0,
            max: 40,
            ticks: { color: '#95a5a6', stepSize: 2 },
            grid: { color: 'rgba(255,255,255,0.05)' },
          },
          y: {
            title: { display: true, text: 'Poeni', color: '#95a5a6' },
            min: 0,
            ticks: { color: '#95a5a6' },
            grid: { color: 'rgba(255,255,255,0.05)' },
          },
        },
        plugins: {
          legend: {
            labels: { color: '#e8e8e8' },
          },
        },
      },
    });
  }
  nacrtajPieCharts() {
    if (this.pieDomaciChartPoeni) this.pieDomaciChartPoeni.destroy();
    if (this.pieGostiChartPoeni) this.pieGostiChartPoeni.destroy();
    if (this.pieDomaciChartAsistencije) this.pieDomaciChartAsistencije.destroy();
    if (this.pieGostiChartAsistencije) this.pieGostiChartAsistencije.destroy();
    if (this.pieDomaciChartSkokovi) this.pieDomaciChartSkokovi.destroy();
    if (this.pieGostiChartSkokovi) this.pieGostiChartSkokovi.destroy();
    if (this.pieDomaciChartUkradene) this.pieDomaciChartUkradene.destroy();
    if (this.pieGostiChartUkradene) this.pieGostiChartUkradene.destroy();
    if (this.pieDomaciChartIzgubljene) this.pieDomaciChartIzgubljene.destroy();
    if (this.pieGostiChartIzgubljene) this.pieGostiChartIzgubljene.destroy();

    this.pieDomaciChartPoeni = this.napraviPiePoeni(
      this.pieDomaciRefPoeni.nativeElement,
      this.domaciStarteriPoeni,
      this.domaciKlupaPoeni,
    );
    this.pieGostiChartPoeni = this.napraviPiePoeni(
      this.pieGostiRefPoeni.nativeElement,
      this.gostiStarteriPoeni,
      this.gostiKlupaPoeni,
    );
    this.pieDomaciChartSkokovi = this.napraviPieSkokovi(
      this.pieDomaciRefSkokovi.nativeElement,
      this.domaciStarteriSkokovi,
      this.domaciKlupaSkokovi,
    );
    this.pieGostiChartSkokovi = this.napraviPieSkokovi(
      this.pieGostiRefSkokovi.nativeElement,
      this.gostiStarteriSkokovi,
      this.gostiKlupaSkokovi,
    );
    this.pieDomaciChartAsistencije = this.napraviPieAsistencije(
      this.pieDomaciRefAsistencije.nativeElement,
      this.domaciStarteriAsistencije,
      this.domaciKlupaAsistencije,
    );
    this.pieGostiChartAsistencije = this.napraviPieAsistencije(
      this.pieGostiRefAsistencije.nativeElement,
      this.gostiStarteriAsistencije,
      this.gostiKlupaAsistencije,
    );
    this.pieDomaciChartUkradene = this.napraviPieUkradene(
      this.pieDomaciRefUkradene.nativeElement,
      this.domaciStarteriUkradene,
      this.domaciKlupaUkradene,
    );
    this.pieGostiChartUkradene = this.napraviPieUkradene(
      this.pieGostiRefUkradene.nativeElement,
      this.gostiStarteriUkradene,
      this.gostiKlupaUkradene,
    );
    this.pieDomaciChartIzgubljene = this.napraviPieIzgubljene(
      this.pieDomaciRefIzgubljene.nativeElement,
      this.domaciStarteriIzgubljene,
      this.domaciKlupaIzgubljene,
    );
    this.pieGostiChartIzgubljene = this.napraviPieIzgubljene(
      this.pieGostiRefIzgubljene.nativeElement,
      this.gostiStarteriIzgubljene,
      this.gostiKlupaIzgubljene,
    );
  }

  napraviPiePoeni(canvas: HTMLCanvasElement, starteri: number, klupa: number): Chart {
    return new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Starteri', 'Klupa'],
        datasets: [
          {
            data: [starteri, klupa],
            backgroundColor: ['#d4af37', '#3aa0e0'], // zlatna za startere, ljubičasta za klupu
            borderColor: 'rgba(0,0,0,0.2)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#e8e8e8', padding: 12 },
          },
          tooltip: {
            callbacks: {
              // prikaži i broj poena i procenat
              label: (ctx) => {
                const vrednost = ctx.parsed;
                const ukupno = starteri + klupa;
                const procenat = ukupno > 0 ? ((vrednost / ukupno) * 100).toFixed(1) : '0';
                return `${ctx.label}: ${vrednost} poena (${procenat}%)`;
              },
            },
          },
        },
      },
    });
  }

  napraviPieSkokovi(canvas: HTMLCanvasElement, starteri: number, klupa: number): Chart {
    return new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Starteri', 'Klupa'],
        datasets: [
          {
            data: [starteri, klupa],
            backgroundColor: ['#d4af37', '#3aa0e0'], // zlatna za startere, ljubičasta za klupu
            borderColor: 'rgba(0,0,0,0.2)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#e8e8e8', padding: 12 },
          },
          tooltip: {
            callbacks: {
              // prikaži i broj poena i procenat
              label: (ctx) => {
                const vrednost = ctx.parsed;
                const ukupno = starteri + klupa;
                const procenat = ukupno > 0 ? ((vrednost / ukupno) * 100).toFixed(1) : '0';
                return `${ctx.label}: ${vrednost} skokova (${procenat}%)`;
              },
            },
          },
        },
      },
    });
  }
  napraviPieAsistencije(canvas: HTMLCanvasElement, starteri: number, klupa: number): Chart {
    return new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Starteri', 'Klupa'],
        datasets: [
          {
            data: [starteri, klupa],
            backgroundColor: ['#d4af37', '#3aa0e0'], // zlatna za startere, ljubičasta za klupu
            borderColor: 'rgba(0,0,0,0.2)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#e8e8e8', padding: 12 },
          },
          tooltip: {
            callbacks: {
              // prikaži i broj poena i procenat
              label: (ctx) => {
                const vrednost = ctx.parsed;
                const ukupno = starteri + klupa;
                const procenat = ukupno > 0 ? ((vrednost / ukupno) * 100).toFixed(1) : '0';
                return `${ctx.label}: ${vrednost} asistencija (${procenat}%)`;
              },
            },
          },
        },
      },
    });
  }

  napraviPieUkradene(canvas: HTMLCanvasElement, starteri: number, klupa: number): Chart {
    return new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Starteri', 'Klupa'],
        datasets: [
          {
            data: [starteri, klupa],
            backgroundColor: ['#d4af37', '#3aa0e0'], // zlatna za startere, ljubičasta za klupu
            borderColor: 'rgba(0,0,0,0.2)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#e8e8e8', padding: 12 },
          },
          tooltip: {
            callbacks: {
              // prikaži i broj poena i procenat
              label: (ctx) => {
                const vrednost = ctx.parsed;
                const ukupno = starteri + klupa;
                const procenat = ukupno > 0 ? ((vrednost / ukupno) * 100).toFixed(1) : '0';
                return `${ctx.label}: ${vrednost} ukradenih (${procenat}%)`;
              },
            },
          },
        },
      },
    });
  }
  napraviPieIzgubljene(canvas: HTMLCanvasElement, starteri: number, klupa: number): Chart {
    return new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Starteri', 'Klupa'],
        datasets: [
          {
            data: [starteri, klupa],
            backgroundColor: ['#d4af37', '#3aa0e0'], // zlatna za startere, ljubičasta za klupu
            borderColor: 'rgba(0,0,0,0.2)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#e8e8e8', padding: 12 },
          },
          tooltip: {
            callbacks: {
              // prikaži i broj poena i procenat
              label: (ctx) => {
                const vrednost = ctx.parsed;
                const ukupno = starteri + klupa;
                const procenat = ukupno > 0 ? ((vrednost / ukupno) * 100).toFixed(1) : '0';
                return `${ctx.label}: ${vrednost} izgubljenih (${procenat}%)`;
              },
            },
          },
        },
      },
    });
  }
  otvoriProfil(korisnickoIme: string) {
    this.igracService.getIgracKorisnickoIme(korisnickoIme).subscribe((ig) => {
      if (ig.klub == this.klub) {
        sessionStorage.setItem('igrac', korisnickoIme);
        this.router.navigate(['/trener-profil-igraca']);
      }
    });
  }
  logOut() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }
  trenerPocetna() {
    this.router.navigate(['trener-pocetna']);
  }
  pregledUtakmica() {
    this.router.navigate(['pregled-utakmica']);
  }
}
