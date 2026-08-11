import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreneriService } from '../services/treneri-service';
import { StatistikaIgracaService } from '../services/statistika-igraca-service';
import { IgraciService } from '../services/igraci-service';
import { Trener } from '../models/trener';
import { Igrac } from '../models/igrac';
import { IgracProseci } from '../models/igracProseci';
import { UtakmiceService } from '../services/utakmice-service';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trener-statistika',
  imports: [FormsModule, CommonModule],
  templateUrl: './trener-statistika.html',
  styleUrls: ['../../styles.css', './trener-statistika.css'],
})
export class TrenerStatistika implements OnInit {
  @ViewChild('poredjenjeChart') poredjenjeChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('poredjenjeChartSezona') poredjenjeChartSezonaRef!: ElementRef<HTMLCanvasElement>;
  constructor(
    private router: Router,
    private trenerService: TreneriService,
    private statistikaIgracaService: StatistikaIgracaService,
    private igracService: IgraciService,
    private utakmiceService: UtakmiceService,
  ) {}

  ngOnInit() {
    // uzmi klub trenera
    this.trenerString = sessionStorage.getItem('korisnickoImeT');
    if (this.trenerString != null) {
      this.trenerService.getTrenerKorisnickoIme(this.trenerString).subscribe((trener) => {
        this.trener = trener;
        this.klub = trener.klub;
        this.utakmiceService.getSezoneTrenera(trener.korisnickoIme).subscribe((sez)=>{
          this.sezone = sez;
          if(this.sezone.length>0){
            const now = new Date();
            const nowMonth=now.getMonth();
            const nowYear=now.getFullYear();
            if(nowMonth>=0 && nowMonth <=5){
              for(let i=0;i<this.sezone.length;i++){
                if(this.sezone[i]==nowYear-1){
                  this.izabranaSezona=this.sezone[i];
                  break;
                }else{
                  this.izabranaSezona=this.sezone[0];
                }
              }
            }else{
              for(let i=0;i<this.sezone.length;i++){
                if(this.sezone[i]==nowYear){
                  this.izabranaSezona=this.sezone[i];
                  break;
                }else{
                  this.izabranaSezona=this.sezone[0];
                }
              }
            }
          }else{
            this.izabranaSezona=-1;
          }

          this.igracService.getAllIgraciTrenera(trener.korisnickoIme).subscribe((ig) => {
            this.igraci = ig;
            this.izracunajProseke();
            this.izracunajProsekeSezona();
          });
        });
      });
    }
  }

  klub: string = '';
  igraciProseci: IgracProseci[] = []; // svaki igrač sa svojim prosecima
  igraciProseciSezona: IgracProseci[] = []; // svaki igrač sa svojim prosecima za izabranu sezonu

  igraci: Igrac[] = [];

  // timski proseci
  timskiProseci: any = {};

  // sortiranje
  sortKolona: string = 'poeni';
  sortSmer: 'asc' | 'desc' = 'desc';

  trenerString: string | null = '';
  trener: Trener = new Trener();

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
  startovaoUtakmica: number = 0;
  brojUtakmica: number = 0;

  prosekPoenaTim: number = 0;
  prosekAsistencijaTim: number = 0;
  prosekSkokovaTim: number = 0;
  prosekIndeksaTim: number = 0;
  prosekMinutaSekTim: number = 0;
  prosekDvaPoenaTim: number = 0;
  prosekTriPoenaTim: number = 0;
  prosekSlobodnoTim: number = 0;
  prosekSkokoviNapadTim: number = 0;
  prosekSkokoviOdbranaTim: number = 0;
  prosekUkradeneTim: number = 0;
  prosekIzgubljeneTim: number = 0;
  prosekBlokadeTim: number = 0;
  prosekBlokadePrimljeneTim: number = 0;
  prosekLicneGreskeTim: number = 0;
  prosekIznudjeniFauloviTim: number = 0;
  startovaoUtakmicaTim: number = 0;
  brojUtakmicaTim: number = 0;

  prosekPoenaTimProtivnik: number = 0;
  prosekAsistencijaTimProtivnik: number = 0;
  prosekSkokovaTimProtivnik: number = 0;
  prosekIndeksaTimProtivnik: number = 0;
  prosekMinutaSekTimProtivnik: number = 0;
  prosekDvaPoenaTimProtivnik: number = 0;
  prosekTriPoenaTimProtivnik: number = 0;
  prosekSlobodnoTimProtivnik: number = 0;
  prosekSkokoviNapadTimProtivnik: number = 0;
  prosekSkokoviOdbranaTimProtivnik: number = 0;
  prosekUkradeneTimProtivnik: number = 0;
  prosekIzgubljeneTimProtivnik: number = 0;
  prosekBlokadeTimProtivnik: number = 0;
  prosekBlokadePrimljeneTimProtivnik: number = 0;
  prosekLicneGreskeTimProtivnik: number = 0;
  prosekIznudjeniFauloviTimProtivnik: number = 0;
  startovaoUtakmicaTimProtivnik: number = 0;
  brojUtakmicaTimProtivnik: number = 0;

  prosekPoenaTimSezona: number = 0;
  prosekAsistencijaTimSezona: number = 0;
  prosekSkokovaTimSezona: number = 0;
  prosekIndeksaTimSezona: number = 0;
  prosekMinutaSekTimSezona: number = 0;
  prosekDvaPoenaTimSezona: number = 0;
  prosekTriPoenaTimSezona: number = 0;
  prosekSlobodnoTimSezona: number = 0;
  prosekSkokoviNapadTimSezona: number = 0;
  prosekSkokoviOdbranaTimSezona: number = 0;
  prosekUkradeneTimSezona: number = 0;
  prosekIzgubljeneTimSezona: number = 0;
  prosekBlokadeTimSezona: number = 0;
  prosekBlokadePrimljeneTimSezona: number = 0;
  prosekLicneGreskeTimSezona: number = 0;
  prosekIznudjeniFauloviTimSezona: number = 0;
  startovaoUtakmicaTimSezona: number = 0;
  brojUtakmicaTimSezona: number = 0;

  prosekPoenaTimProtivnikSezona: number = 0;
  prosekAsistencijaTimProtivnikSezona: number = 0;
  prosekSkokovaTimProtivnikSezona: number = 0;
  prosekIndeksaTimProtivnikSezona: number = 0;
  prosekMinutaSekTimProtivnikSezona: number = 0;
  prosekDvaPoenaTimProtivnikSezona: number = 0;
  prosekTriPoenaTimProtivnikSezona: number = 0;
  prosekSlobodnoTimProtivnikSezona: number = 0;
  prosekSkokoviNapadTimProtivnikSezona: number = 0;
  prosekSkokoviOdbranaTimProtivnikSezona: number = 0;
  prosekUkradeneTimProtivnikSezona: number = 0;
  prosekIzgubljeneTimProtivnikSezona: number = 0;
  prosekBlokadeTimProtivnikSezona: number = 0;
  prosekBlokadePrimljeneTimProtivnikSezona: number = 0;
  prosekLicneGreskeTimProtivnikSezona: number = 0;
  prosekIznudjeniFauloviTimProtivnikSezona: number = 0;
  startovaoUtakmicaTimProtivnikSezona: number = 0;
  brojUtakmicaTimProtivnikSezona: number = 0;

  poredjenjeChart: Chart | null = null;
  poredjenjeChartSezona: Chart | null = null;

  sezone: number[] = [];
  izabranaSezona: number = 0;
  izabraniTip: string = 'liga';

  izracunajProseke() {
    this.igraciProseci = [];
    for (let i = 0; i < this.igraci.length; i++) {
      this.statistikaIgracaService
        .getIgracStatistika(this.igraci[i].korisnickoIme)
        .subscribe((stats) => {
          let igracProsek = new IgracProseci();
          igracProsek.igrac = this.igraci[i];
          if (stats.length == 0) {
            igracProsek.brojUtakmica = 0;
            igracProsek.startovaoUtakmica = 0;
            igracProsek.prosekPoena = 0;
            igracProsek.prosekSkokova = 0;
            igracProsek.prosekAsistencija = 0;
            igracProsek.prosekIndeksa = 0;
            igracProsek.prosekMinutaSek = 0;
            igracProsek.prosekDvaPoena = 0;
            igracProsek.prosekTriPoena = 0;
            igracProsek.prosekSlobodno = 0;
            igracProsek.prosekSkokoviNapad = 0;
            igracProsek.prosekSkokoviOdbrana = 0;
            igracProsek.prosekUkradene = 0;
            igracProsek.prosekIzgubljene = 0;
            igracProsek.prosekBlokade = 0;
            igracProsek.prosekBlokadePrimljene = 0;
            igracProsek.prosekLicneGreske = 0;
            igracProsek.prosekIznudjeniFaulovi = 0;
            this.igraciProseci.push(igracProsek);
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
            let starter = 0;
            let obradjeno = 0;

            for (let j = 0; j < stats.length; j++) {
              this.utakmiceService.getUtakmica(stats[j].utakmicaId).subscribe((utakmica) => {
                obradjeno++;
                if (
                  (utakmica.status == 'pobeda' || utakmica.status == 'poraz' || utakmica.status == 'nereseno') &&
                  this.vremeUSekunde(stats[j].minuti) > 0 &&
                  (this.izabraniTip == 'sve' || utakmica.takmicenje == this.izabraniTip)
                ) {
                  zavrsene++;
                  poeni += stats[j].poeni;
                  skokovi += stats[j].skokoviUkupno;
                  asistencije += stats[j].asistencije;
                  indeks += stats[j].indeks;
                  minutiSek += this.vremeUSekunde(stats[j].minuti);
                  dvaPoenaPogodak += stats[j].dvaPoenaPogodak;
                  dvaPoenaPromasaj += stats[j].dvaPoenaPromasaj;
                  triPoenaPogodak += stats[j].triPoenaPogodak;
                  triPoenaPromasaj += stats[j].triPoenaPromasaj;
                  slobodnoPogodak += stats[j].slobodnoPogodak;
                  slobodnoPromasaj += stats[j].slobodnoPromasaj;
                  skokoviNapad += stats[j].skokoviNapad;
                  skokoviOdbrana += stats[j].skokoviOdbrana;
                  ukradene += stats[j].ukradene;
                  izgubljene += stats[j].izgubljene;
                  blokade += stats[j].blokade;
                  blokadePrimljene += stats[j].blokadePrimljene;
                  licneGreske += stats[j].licneGreske;
                  iznudjeniFaulovi += stats[j].iznudjeniFaulovi;
                }
                if (zavrsene > 0) {
                  igracProsek.prosekPoena = poeni / zavrsene;
                  igracProsek.prosekSkokova = skokovi / zavrsene;
                  igracProsek.prosekAsistencija = asistencije / zavrsene;
                  igracProsek.prosekIndeksa = indeks / zavrsene;
                  igracProsek.prosekMinutaSek = minutiSek / zavrsene;
                  if (dvaPoenaPogodak + dvaPoenaPromasaj == 0) {
                    igracProsek.prosekDvaPoena = 0;
                  } else {
                    igracProsek.prosekDvaPoena =
                      (dvaPoenaPogodak / (dvaPoenaPogodak + dvaPoenaPromasaj)) * 100;
                  }
                  if (triPoenaPogodak + triPoenaPromasaj == 0) {
                    igracProsek.prosekTriPoena = 0;
                  } else {
                    igracProsek.prosekTriPoena =
                      (triPoenaPogodak / (triPoenaPogodak + triPoenaPromasaj)) * 100;
                  }
                  if (slobodnoPogodak + slobodnoPromasaj == 0) {
                    igracProsek.prosekSlobodno = 0;
                  } else {
                    igracProsek.prosekSlobodno =
                      (slobodnoPogodak / (slobodnoPogodak + slobodnoPromasaj)) * 100;
                  }
                  igracProsek.prosekSkokoviNapad = skokoviNapad / zavrsene;
                  igracProsek.prosekSkokoviOdbrana = skokoviOdbrana / zavrsene;
                  igracProsek.prosekUkradene = ukradene / zavrsene;
                  igracProsek.prosekIzgubljene = izgubljene / zavrsene;
                  igracProsek.prosekBlokade = blokade / zavrsene;
                  igracProsek.prosekBlokadePrimljene = blokadePrimljene / zavrsene;
                  igracProsek.prosekLicneGreske = licneGreske / zavrsene;
                  igracProsek.prosekIznudjeniFaulovi = iznudjeniFaulovi / zavrsene;
                  igracProsek.startovaoUtakmica = starter;
                  igracProsek.brojUtakmica = zavrsene;
                } else {
                  igracProsek.brojUtakmica = 0;
                  igracProsek.startovaoUtakmica = 0;
                  igracProsek.prosekPoena = 0;
                  igracProsek.prosekSkokova = 0;
                  igracProsek.prosekAsistencija = 0;
                  igracProsek.prosekIndeksa = 0;
                  igracProsek.prosekMinutaSek = 0;
                  igracProsek.prosekDvaPoena = 0;
                  igracProsek.prosekTriPoena = 0;
                  igracProsek.prosekSlobodno = 0;
                  igracProsek.prosekSkokoviNapad = 0;
                  igracProsek.prosekSkokoviOdbrana = 0;
                  igracProsek.prosekUkradene = 0;
                  igracProsek.prosekIzgubljene = 0;
                  igracProsek.prosekBlokade = 0;
                  igracProsek.prosekBlokadePrimljene = 0;
                  igracProsek.prosekLicneGreske = 0;
                  igracProsek.prosekIznudjeniFaulovi = 0;
                }

                if (obradjeno === stats.length) {
                  this.igraciProseci.push(igracProsek);
                }
              });
            }
          }
        });
    }

    this.utakmiceService
      .getAllUtakmiceZavrsene(this.trener.korisnickoIme)
      .subscribe((utakmiceTimSve) => {
        const utakmiceTim = utakmiceTimSve.filter(
          (u) => this.izabraniTip == 'sve' || u.takmicenje == this.izabraniTip,
        );
        this.brojUtakmicaTim = utakmiceTim.length;
        let poeniProtivnik = 0,
          skokoviProtivnik = 0,
          asistencijeProtivnik = 0,
          indeksProtivnik = 0,
          dvaPoenaPogodakProtivnik = 0,
          dvaPoenaPromasajProtivnik = 0,
          triPoenaPogodakProtivnik = 0,
          triPoenaPromasajProtivnik = 0,
          slobodnoPogodakProtivnik = 0,
          slobodnoPromasajProtivnik = 0,
          skokoviNapadProtivnik = 0,
          skokoviOdbranaProtivnik = 0,
          ukradeneProtivnik = 0,
          izgubljeneProtivnik = 0,
          blokadeProtivnik = 0,
          blokadePrimljeneProtivnik = 0,
          licneGreskeProtivnik = 0,
          iznudjeniFauloviProtivnik = 0;
        let poeni = 0,
          skokovi = 0,
          asistencije = 0,
          indeks = 0,
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

        if (utakmiceTim.length == 0) {
          this.prosekPoenaTim = 0;
          this.prosekAsistencijaTim = 0;
          this.prosekSkokovaTim = 0;
          this.prosekIndeksaTim = 0;
          this.prosekMinutaSekTim = 0;
          this.prosekDvaPoenaTim = 0;
          this.prosekTriPoenaTim = 0;
          this.prosekSlobodnoTim = 0;
          this.prosekSkokoviNapadTim = 0;
          this.prosekSkokoviOdbranaTim = 0;
          this.prosekUkradeneTim = 0;
          this.prosekIzgubljeneTim = 0;
          this.prosekBlokadeTim = 0;
          this.prosekBlokadePrimljeneTim = 0;
          this.prosekLicneGreskeTim = 0;
          this.prosekIznudjeniFauloviTim = 0;
          this.startovaoUtakmicaTim = 0;
          this.brojUtakmicaTim = 0;

          this.prosekPoenaTimProtivnik = 0;
          this.prosekAsistencijaTimProtivnik = 0;
          this.prosekSkokovaTimProtivnik = 0;
          this.prosekIndeksaTimProtivnik = 0;
          this.prosekMinutaSekTimProtivnik = 0;
          this.prosekDvaPoenaTimProtivnik = 0;
          this.prosekTriPoenaTimProtivnik = 0;
          this.prosekSlobodnoTimProtivnik = 0;
          this.prosekSkokoviNapadTimProtivnik = 0;
          this.prosekSkokoviOdbranaTimProtivnik = 0;
          this.prosekUkradeneTimProtivnik = 0;
          this.prosekIzgubljeneTimProtivnik = 0;
          this.prosekBlokadeTimProtivnik = 0;
          this.prosekBlokadePrimljeneTimProtivnik = 0;
          this.prosekLicneGreskeTimProtivnik = 0;
          this.prosekIznudjeniFauloviTimProtivnik = 0;
          this.startovaoUtakmicaTimProtivnik = 0;
          this.brojUtakmicaTimProtivnik = 0;
        } else {
          let obradjenoTim = 0;
          let obradjenoTimProtivnik = 0;
          for (let i = 0; i < utakmiceTim.length; i++) {
            this.statistikaIgracaService
              .getIgraciKlubUtakmica(utakmiceTim[i].id, this.trener.klub)
              .subscribe((statsIgraci) => {
                obradjenoTim++;
                for (let i = 0; i < statsIgraci.length; i++) {
                  poeni += statsIgraci[i].poeni;
                  dvaPoenaPogodak += statsIgraci[i].dvaPoenaPogodak;
                  dvaPoenaPromasaj += statsIgraci[i].dvaPoenaPromasaj;
                  triPoenaPogodak += statsIgraci[i].triPoenaPogodak;
                  triPoenaPromasaj += statsIgraci[i].triPoenaPromasaj;
                  slobodnoPogodak += statsIgraci[i].slobodnoPogodak;
                  slobodnoPromasaj += statsIgraci[i].slobodnoPromasaj;
                  skokoviNapad += statsIgraci[i].skokoviNapad;
                  skokoviOdbrana += statsIgraci[i].skokoviOdbrana;
                  skokovi += statsIgraci[i].skokoviUkupno;
                  asistencije += statsIgraci[i].asistencije;
                  ukradene += statsIgraci[i].ukradene;
                  izgubljene += statsIgraci[i].izgubljene;
                  blokade += statsIgraci[i].blokade;
                  blokadePrimljene += statsIgraci[i].blokadePrimljene;
                  licneGreske += statsIgraci[i].licneGreske;
                  iznudjeniFaulovi += statsIgraci[i].iznudjeniFaulovi;
                  indeks += statsIgraci[i].indeks;
                }
                if (obradjenoTim === utakmiceTim.length) {
                  this.prosekPoenaTim = poeni / this.brojUtakmicaTim;
                  this.prosekAsistencijaTim = asistencije / this.brojUtakmicaTim;
                  this.prosekSkokovaTim = skokovi / this.brojUtakmicaTim;
                  this.prosekIndeksaTim = indeks / this.brojUtakmicaTim;
                  if (dvaPoenaPogodak + dvaPoenaPromasaj > 0) {
                    this.prosekDvaPoenaTim =
                      (dvaPoenaPogodak / (dvaPoenaPogodak + dvaPoenaPromasaj)) * 100;
                  } else {
                    this.prosekDvaPoenaTim = 0;
                  }
                  if (triPoenaPogodak + triPoenaPromasaj > 0) {
                    this.prosekTriPoenaTim =
                      (triPoenaPogodak / (triPoenaPogodak + triPoenaPromasaj)) * 100;
                  } else {
                    this.prosekTriPoenaTim = 0;
                  }
                  if (slobodnoPogodak + slobodnoPromasaj > 0) {
                    this.prosekSlobodnoTim =
                      (slobodnoPogodak / (slobodnoPogodak + slobodnoPromasaj)) * 100;
                  } else {
                    this.prosekSlobodnoTim = 0;
                  }
                  this.prosekSkokoviNapadTim = skokoviNapad / this.brojUtakmicaTim;
                  this.prosekSkokoviOdbranaTim = skokovi / this.brojUtakmicaTim;
                  this.prosekUkradeneTim = ukradene / this.brojUtakmicaTim;
                  this.prosekIzgubljeneTim = izgubljene / this.brojUtakmicaTim;
                  this.prosekBlokadeTim = blokade / this.brojUtakmicaTim;
                  this.prosekBlokadePrimljeneTim = blokadePrimljene / this.brojUtakmicaTim;
                  this.prosekLicneGreskeTim = licneGreske / this.brojUtakmicaTim;
                  this.prosekIznudjeniFauloviTim = iznudjeniFaulovi / this.brojUtakmicaTim;

                  setTimeout(() => this.nacrtajPoredjenje(), 0);
                }
              });
            this.statistikaIgracaService
              .getIgraciKlubUtakmica(
                utakmiceTim[i].id,
                this.trener.klub == utakmiceTim[i].domacin
                  ? utakmiceTim[i].gost
                  : utakmiceTim[i].domacin,
              )
              .subscribe((statsIgraci) => {
                obradjenoTimProtivnik++;
                for (let i = 0; i < statsIgraci.length; i++) {
                  poeniProtivnik += statsIgraci[i].poeni;
                  dvaPoenaPogodakProtivnik += statsIgraci[i].dvaPoenaPogodak;
                  dvaPoenaPromasajProtivnik += statsIgraci[i].dvaPoenaPromasaj;
                  triPoenaPogodakProtivnik += statsIgraci[i].triPoenaPogodak;
                  triPoenaPromasajProtivnik += statsIgraci[i].triPoenaPromasaj;
                  slobodnoPogodakProtivnik += statsIgraci[i].slobodnoPogodak;
                  slobodnoPromasajProtivnik += statsIgraci[i].slobodnoPromasaj;
                  skokoviNapadProtivnik += statsIgraci[i].skokoviNapad;
                  skokoviOdbranaProtivnik += statsIgraci[i].skokoviOdbrana;
                  skokoviProtivnik += statsIgraci[i].skokoviUkupno;
                  asistencijeProtivnik += statsIgraci[i].asistencije;
                  ukradeneProtivnik += statsIgraci[i].ukradene;
                  izgubljeneProtivnik += statsIgraci[i].izgubljene;
                  blokadeProtivnik += statsIgraci[i].blokade;
                  blokadePrimljeneProtivnik += statsIgraci[i].blokadePrimljene;
                  licneGreskeProtivnik += statsIgraci[i].licneGreske;
                  iznudjeniFauloviProtivnik += statsIgraci[i].iznudjeniFaulovi;
                  indeksProtivnik += statsIgraci[i].indeks;
                }
                if (obradjenoTimProtivnik === utakmiceTim.length) {
                  this.prosekPoenaTimProtivnik = poeniProtivnik / this.brojUtakmicaTim;
                  this.prosekAsistencijaTimProtivnik =
                    asistencijeProtivnik / this.brojUtakmicaTim;
                  this.prosekSkokovaTimProtivnik = skokoviProtivnik / this.brojUtakmicaTim;
                  this.prosekIndeksaTimProtivnik = indeksProtivnik / this.brojUtakmicaTim;
                  if (dvaPoenaPogodakProtivnik + dvaPoenaPromasajProtivnik > 0) {
                    this.prosekDvaPoenaTimProtivnik =
                      (dvaPoenaPogodakProtivnik /
                        (dvaPoenaPogodakProtivnik + dvaPoenaPromasajProtivnik)) *
                      100;
                  } else {
                    this.prosekDvaPoenaTimProtivnik = 0;
                  }
                  if (triPoenaPogodakProtivnik + triPoenaPromasajProtivnik > 0) {
                    this.prosekTriPoenaTimProtivnik =
                      (triPoenaPogodakProtivnik /
                        (triPoenaPogodakProtivnik + triPoenaPromasajProtivnik)) *
                      100;
                  } else {
                    this.prosekTriPoenaTimProtivnik = 0;
                  }
                  if (slobodnoPogodakProtivnik + slobodnoPromasajProtivnik > 0) {
                    this.prosekSlobodnoTimProtivnik =
                      (slobodnoPogodakProtivnik /
                        (slobodnoPogodakProtivnik + slobodnoPromasajProtivnik)) *
                      100;
                  } else {
                    this.prosekSlobodnoTimProtivnik = 0;
                  }
                  this.prosekSkokoviNapadTimProtivnik =
                    skokoviNapadProtivnik / this.brojUtakmicaTim;
                  this.prosekSkokoviOdbranaTimProtivnik =
                    skokoviProtivnik / this.brojUtakmicaTim;
                  this.prosekUkradeneTimProtivnik = ukradeneProtivnik / this.brojUtakmicaTim;
                  this.prosekIzgubljeneTimProtivnik =
                    izgubljeneProtivnik / this.brojUtakmicaTim;
                  this.prosekBlokadeTimProtivnik = blokadeProtivnik / this.brojUtakmicaTim;
                  this.prosekBlokadePrimljeneTimProtivnik =
                    blokadePrimljeneProtivnik / this.brojUtakmicaTim;
                  this.prosekLicneGreskeTimProtivnik =
                    licneGreskeProtivnik / this.brojUtakmicaTim;
                  this.prosekIznudjeniFauloviTimProtivnik =
                    iznudjeniFauloviProtivnik / this.brojUtakmicaTim;

                  setTimeout(() => this.nacrtajPoredjenje(), 0);
                }
              });
          }
        }
      });
  }

  izracunajProsekeSezona() {
    this.igraciProseciSezona = [];
    for (let i = 0; i < this.igraci.length; i++) {
      this.statistikaIgracaService
        .getIgracStatistika(this.igraci[i].korisnickoIme)
        .subscribe((stats) => {
          let igracProsekSezona = new IgracProseci();
          igracProsekSezona.igrac = this.igraci[i];
          if (stats.length == 0) {
            igracProsekSezona.brojUtakmica = 0;
            igracProsekSezona.startovaoUtakmica = 0;
            igracProsekSezona.prosekPoena = 0;
            igracProsekSezona.prosekSkokova = 0;
            igracProsekSezona.prosekAsistencija = 0;
            igracProsekSezona.prosekIndeksa = 0;
            igracProsekSezona.prosekMinutaSek = 0;
            igracProsekSezona.prosekDvaPoena = 0;
            igracProsekSezona.prosekTriPoena = 0;
            igracProsekSezona.prosekSlobodno = 0;
            igracProsekSezona.prosekSkokoviNapad = 0;
            igracProsekSezona.prosekSkokoviOdbrana = 0;
            igracProsekSezona.prosekUkradene = 0;
            igracProsekSezona.prosekIzgubljene = 0;
            igracProsekSezona.prosekBlokade = 0;
            igracProsekSezona.prosekBlokadePrimljene = 0;
            igracProsekSezona.prosekLicneGreske = 0;
            igracProsekSezona.prosekIznudjeniFaulovi = 0;
            this.igraciProseciSezona.push(igracProsekSezona);
          } else {
            let poeniSezona = 0,
              skokoviSezona = 0,
              asistencijeSezona = 0,
              indeksSezona = 0,
              minutiSekSezona = 0,
              dvaPoenaPogodakSezona = 0,
              dvaPoenaPromasajSezona = 0,
              triPoenaPogodakSezona = 0,
              triPoenaPromasajSezona = 0,
              slobodnoPogodakSezona = 0,
              slobodnoPromasajSezona = 0,
              skokoviNapadSezona = 0,
              skokoviOdbranaSezona = 0,
              ukradeneSezona = 0,
              izgubljeneSezona = 0,
              blokadeSezona = 0,
              blokadePrimljeneSezona = 0,
              licneGreskeSezona = 0,
              iznudjeniFauloviSezona = 0;
            let zavrseneSezona = 0;
            let starterSezona = 0;
            let obradjenoSezona = 0;

            for (let j = 0; j < stats.length; j++) {
              this.utakmiceService.getUtakmica(stats[j].utakmicaId).subscribe((utakmica) => {
                obradjenoSezona++;
                if (
                  (utakmica.status == 'pobeda' || utakmica.status == 'poraz' || utakmica.status == 'nereseno') &&
                  this.vremeUSekunde(stats[j].minuti) > 0 &&
                  utakmica.sezonaPocetak == this.izabranaSezona &&
                  (this.izabraniTip == 'sve' || utakmica.takmicenje == this.izabraniTip)
                ) {
                  zavrseneSezona++;
                  poeniSezona += stats[j].poeni;
                  skokoviSezona += stats[j].skokoviUkupno;
                  asistencijeSezona += stats[j].asistencije;
                  indeksSezona += stats[j].indeks;
                  minutiSekSezona += this.vremeUSekunde(stats[j].minuti);
                  dvaPoenaPogodakSezona += stats[j].dvaPoenaPogodak;
                  dvaPoenaPromasajSezona += stats[j].dvaPoenaPromasaj;
                  triPoenaPogodakSezona += stats[j].triPoenaPogodak;
                  triPoenaPromasajSezona += stats[j].triPoenaPromasaj;
                  slobodnoPogodakSezona += stats[j].slobodnoPogodak;
                  slobodnoPromasajSezona += stats[j].slobodnoPromasaj;
                  skokoviNapadSezona += stats[j].skokoviNapad;
                  skokoviOdbranaSezona += stats[j].skokoviOdbrana;
                  ukradeneSezona += stats[j].ukradene;
                  izgubljeneSezona += stats[j].izgubljene;
                  blokadeSezona += stats[j].blokade;
                  blokadePrimljeneSezona += stats[j].blokadePrimljene;
                  licneGreskeSezona += stats[j].licneGreske;
                  iznudjeniFauloviSezona += stats[j].iznudjeniFaulovi;
                }
                if (zavrseneSezona > 0) {
                  igracProsekSezona.prosekPoena = poeniSezona / zavrseneSezona;
                  igracProsekSezona.prosekSkokova = skokoviSezona / zavrseneSezona;
                  igracProsekSezona.prosekAsistencija = asistencijeSezona / zavrseneSezona;
                  igracProsekSezona.prosekIndeksa = indeksSezona / zavrseneSezona;
                  igracProsekSezona.prosekMinutaSek = minutiSekSezona / zavrseneSezona;
                  if (dvaPoenaPogodakSezona + dvaPoenaPromasajSezona == 0) {
                    igracProsekSezona.prosekDvaPoena = 0;
                  } else {
                    igracProsekSezona.prosekDvaPoena =
                      (dvaPoenaPogodakSezona / (dvaPoenaPogodakSezona + dvaPoenaPromasajSezona)) * 100;
                  }
                  if (triPoenaPogodakSezona + triPoenaPromasajSezona == 0) {
                    igracProsekSezona.prosekTriPoena = 0;
                  } else {
                    igracProsekSezona.prosekTriPoena =
                      (triPoenaPogodakSezona / (triPoenaPogodakSezona + triPoenaPromasajSezona)) * 100;
                  }
                  if (slobodnoPogodakSezona + slobodnoPromasajSezona == 0) {
                    igracProsekSezona.prosekSlobodno = 0;
                  } else {
                    igracProsekSezona.prosekSlobodno =
                      (slobodnoPogodakSezona / (slobodnoPogodakSezona + slobodnoPromasajSezona)) * 100;
                  }
                  igracProsekSezona.prosekSkokoviNapad = skokoviNapadSezona / zavrseneSezona;
                  igracProsekSezona.prosekSkokoviOdbrana = skokoviOdbranaSezona / zavrseneSezona;
                  igracProsekSezona.prosekUkradene = ukradeneSezona / zavrseneSezona;
                  igracProsekSezona.prosekIzgubljene = izgubljeneSezona / zavrseneSezona;
                  igracProsekSezona.prosekBlokade = blokadeSezona / zavrseneSezona;
                  igracProsekSezona.prosekBlokadePrimljene = blokadePrimljeneSezona / zavrseneSezona;
                  igracProsekSezona.prosekLicneGreske = licneGreskeSezona / zavrseneSezona;
                  igracProsekSezona.prosekIznudjeniFaulovi = iznudjeniFauloviSezona / zavrseneSezona;
                  igracProsekSezona.startovaoUtakmica = starterSezona;
                  igracProsekSezona.brojUtakmica = zavrseneSezona;
                } else {
                  igracProsekSezona.brojUtakmica = 0;
                  igracProsekSezona.startovaoUtakmica = 0;
                  igracProsekSezona.prosekPoena = 0;
                  igracProsekSezona.prosekSkokova = 0;
                  igracProsekSezona.prosekAsistencija = 0;
                  igracProsekSezona.prosekIndeksa = 0;
                  igracProsekSezona.prosekMinutaSek = 0;
                  igracProsekSezona.prosekDvaPoena = 0;
                  igracProsekSezona.prosekTriPoena = 0;
                  igracProsekSezona.prosekSlobodno = 0;
                  igracProsekSezona.prosekSkokoviNapad = 0;
                  igracProsekSezona.prosekSkokoviOdbrana = 0;
                  igracProsekSezona.prosekUkradene = 0;
                  igracProsekSezona.prosekIzgubljene = 0;
                  igracProsekSezona.prosekBlokade = 0;
                  igracProsekSezona.prosekBlokadePrimljene = 0;
                  igracProsekSezona.prosekLicneGreske = 0;
                  igracProsekSezona.prosekIznudjeniFaulovi = 0;
                }

                if (obradjenoSezona === stats.length) {
                  this.igraciProseciSezona.push(igracProsekSezona);
                }
              });
            }
          }
        });
    }

    this.utakmiceService
      .getAllUtakmiceZavrsene(this.trener.korisnickoIme)
      .subscribe((utakmiceTim) => {
        const utakmiceTimSezona = utakmiceTim.filter(
          (u) =>
            u.sezonaPocetak == this.izabranaSezona &&
            (this.izabraniTip == 'sve' || u.takmicenje == this.izabraniTip),
        );
        this.brojUtakmicaTimSezona = utakmiceTimSezona.length;
        let poeniProtivnikSezona = 0,
          skokoviProtivnikSezona = 0,
          asistencijeProtivnikSezona = 0,
          indeksProtivnikSezona = 0,
          dvaPoenaPogodakProtivnikSezona = 0,
          dvaPoenaPromasajProtivnikSezona = 0,
          triPoenaPogodakProtivnikSezona = 0,
          triPoenaPromasajProtivnikSezona = 0,
          slobodnoPogodakProtivnikSezona = 0,
          slobodnoPromasajProtivnikSezona = 0,
          skokoviNapadProtivnikSezona = 0,
          skokoviOdbranaProtivnikSezona = 0,
          ukradeneProtivnikSezona = 0,
          izgubljeneProtivnikSezona = 0,
          blokadeProtivnikSezona = 0,
          blokadePrimljeneProtivnikSezona = 0,
          licneGreskeProtivnikSezona = 0,
          iznudjeniFauloviProtivnikSezona = 0;
        let poeniSezona = 0,
          skokoviSezona = 0,
          asistencijeSezona = 0,
          indeksSezona = 0,
          dvaPoenaPogodakSezona = 0,
          dvaPoenaPromasajSezona = 0,
          triPoenaPogodakSezona = 0,
          triPoenaPromasajSezona = 0,
          slobodnoPogodakSezona = 0,
          slobodnoPromasajSezona = 0,
          skokoviNapadSezona = 0,
          skokoviOdbranaSezona = 0,
          ukradeneSezona = 0,
          izgubljeneSezona = 0,
          blokadeSezona = 0,
          blokadePrimljeneSezona = 0,
          licneGreskeSezona = 0,
          iznudjeniFauloviSezona = 0;

        if (utakmiceTimSezona.length == 0) {
          this.prosekPoenaTimSezona = 0;
          this.prosekAsistencijaTimSezona = 0;
          this.prosekSkokovaTimSezona = 0;
          this.prosekIndeksaTimSezona = 0;
          this.prosekMinutaSekTimSezona = 0;
          this.prosekDvaPoenaTimSezona = 0;
          this.prosekTriPoenaTimSezona = 0;
          this.prosekSlobodnoTimSezona = 0;
          this.prosekSkokoviNapadTimSezona = 0;
          this.prosekSkokoviOdbranaTimSezona = 0;
          this.prosekUkradeneTimSezona = 0;
          this.prosekIzgubljeneTimSezona = 0;
          this.prosekBlokadeTimSezona = 0;
          this.prosekBlokadePrimljeneTimSezona = 0;
          this.prosekLicneGreskeTimSezona = 0;
          this.prosekIznudjeniFauloviTimSezona = 0;
          this.startovaoUtakmicaTimSezona = 0;
          this.brojUtakmicaTimSezona = 0;

          this.prosekPoenaTimProtivnikSezona = 0;
          this.prosekAsistencijaTimProtivnikSezona = 0;
          this.prosekSkokovaTimProtivnikSezona = 0;
          this.prosekIndeksaTimProtivnikSezona = 0;
          this.prosekMinutaSekTimProtivnikSezona = 0;
          this.prosekDvaPoenaTimProtivnikSezona = 0;
          this.prosekTriPoenaTimProtivnikSezona = 0;
          this.prosekSlobodnoTimProtivnikSezona = 0;
          this.prosekSkokoviNapadTimProtivnikSezona = 0;
          this.prosekSkokoviOdbranaTimProtivnikSezona = 0;
          this.prosekUkradeneTimProtivnikSezona = 0;
          this.prosekIzgubljeneTimProtivnikSezona = 0;
          this.prosekBlokadeTimProtivnikSezona = 0;
          this.prosekBlokadePrimljeneTimProtivnikSezona = 0;
          this.prosekLicneGreskeTimProtivnikSezona = 0;
          this.prosekIznudjeniFauloviTimProtivnikSezona = 0;
          this.startovaoUtakmicaTimProtivnikSezona = 0;
          this.brojUtakmicaTimProtivnikSezona = 0;

          setTimeout(() => this.nacrtajPoredjenjeSezona(), 0);
        } else {
          let obradjenoTimSezona = 0;
          let obradjenoTimProtivnikSezona = 0;
          for (let i = 0; i < utakmiceTimSezona.length; i++) {
            this.statistikaIgracaService
              .getIgraciKlubUtakmica(utakmiceTimSezona[i].id, this.trener.klub)
              .subscribe((statsIgraci) => {
                obradjenoTimSezona++;
                for (let k = 0; k < statsIgraci.length; k++) {
                  poeniSezona += statsIgraci[k].poeni;
                  dvaPoenaPogodakSezona += statsIgraci[k].dvaPoenaPogodak;
                  dvaPoenaPromasajSezona += statsIgraci[k].dvaPoenaPromasaj;
                  triPoenaPogodakSezona += statsIgraci[k].triPoenaPogodak;
                  triPoenaPromasajSezona += statsIgraci[k].triPoenaPromasaj;
                  slobodnoPogodakSezona += statsIgraci[k].slobodnoPogodak;
                  slobodnoPromasajSezona += statsIgraci[k].slobodnoPromasaj;
                  skokoviNapadSezona += statsIgraci[k].skokoviNapad;
                  skokoviOdbranaSezona += statsIgraci[k].skokoviOdbrana;
                  skokoviSezona += statsIgraci[k].skokoviUkupno;
                  asistencijeSezona += statsIgraci[k].asistencije;
                  ukradeneSezona += statsIgraci[k].ukradene;
                  izgubljeneSezona += statsIgraci[k].izgubljene;
                  blokadeSezona += statsIgraci[k].blokade;
                  blokadePrimljeneSezona += statsIgraci[k].blokadePrimljene;
                  licneGreskeSezona += statsIgraci[k].licneGreske;
                  iznudjeniFauloviSezona += statsIgraci[k].iznudjeniFaulovi;
                  indeksSezona += statsIgraci[k].indeks;
                }
                if (obradjenoTimSezona === utakmiceTimSezona.length) {
                  this.prosekPoenaTimSezona = poeniSezona / this.brojUtakmicaTimSezona;
                  this.prosekAsistencijaTimSezona = asistencijeSezona / this.brojUtakmicaTimSezona;
                  this.prosekSkokovaTimSezona = skokoviSezona / this.brojUtakmicaTimSezona;
                  this.prosekIndeksaTimSezona = indeksSezona / this.brojUtakmicaTimSezona;
                  if (dvaPoenaPogodakSezona + dvaPoenaPromasajSezona > 0) {
                    this.prosekDvaPoenaTimSezona =
                      (dvaPoenaPogodakSezona / (dvaPoenaPogodakSezona + dvaPoenaPromasajSezona)) * 100;
                  } else {
                    this.prosekDvaPoenaTimSezona = 0;
                  }
                  if (triPoenaPogodakSezona + triPoenaPromasajSezona > 0) {
                    this.prosekTriPoenaTimSezona =
                      (triPoenaPogodakSezona / (triPoenaPogodakSezona + triPoenaPromasajSezona)) * 100;
                  } else {
                    this.prosekTriPoenaTimSezona = 0;
                  }
                  if (slobodnoPogodakSezona + slobodnoPromasajSezona > 0) {
                    this.prosekSlobodnoTimSezona =
                      (slobodnoPogodakSezona / (slobodnoPogodakSezona + slobodnoPromasajSezona)) * 100;
                  } else {
                    this.prosekSlobodnoTimSezona = 0;
                  }
                  this.prosekSkokoviNapadTimSezona = skokoviNapadSezona / this.brojUtakmicaTimSezona;
                  this.prosekSkokoviOdbranaTimSezona = skokoviOdbranaSezona / this.brojUtakmicaTimSezona;
                  this.prosekUkradeneTimSezona = ukradeneSezona / this.brojUtakmicaTimSezona;
                  this.prosekIzgubljeneTimSezona = izgubljeneSezona / this.brojUtakmicaTimSezona;
                  this.prosekBlokadeTimSezona = blokadeSezona / this.brojUtakmicaTimSezona;
                  this.prosekBlokadePrimljeneTimSezona = blokadePrimljeneSezona / this.brojUtakmicaTimSezona;
                  this.prosekLicneGreskeTimSezona = licneGreskeSezona / this.brojUtakmicaTimSezona;
                  this.prosekIznudjeniFauloviTimSezona = iznudjeniFauloviSezona / this.brojUtakmicaTimSezona;

                  setTimeout(() => this.nacrtajPoredjenjeSezona(), 0);
                }
              });
            this.statistikaIgracaService
              .getIgraciKlubUtakmica(
                utakmiceTimSezona[i].id,
                this.trener.klub == utakmiceTimSezona[i].domacin
                  ? utakmiceTimSezona[i].gost
                  : utakmiceTimSezona[i].domacin,
              )
              .subscribe((statsIgraci) => {
                obradjenoTimProtivnikSezona++;
                for (let k = 0; k < statsIgraci.length; k++) {
                  poeniProtivnikSezona += statsIgraci[k].poeni;
                  dvaPoenaPogodakProtivnikSezona += statsIgraci[k].dvaPoenaPogodak;
                  dvaPoenaPromasajProtivnikSezona += statsIgraci[k].dvaPoenaPromasaj;
                  triPoenaPogodakProtivnikSezona += statsIgraci[k].triPoenaPogodak;
                  triPoenaPromasajProtivnikSezona += statsIgraci[k].triPoenaPromasaj;
                  slobodnoPogodakProtivnikSezona += statsIgraci[k].slobodnoPogodak;
                  slobodnoPromasajProtivnikSezona += statsIgraci[k].slobodnoPromasaj;
                  skokoviNapadProtivnikSezona += statsIgraci[k].skokoviNapad;
                  skokoviOdbranaProtivnikSezona += statsIgraci[k].skokoviOdbrana;
                  skokoviProtivnikSezona += statsIgraci[k].skokoviUkupno;
                  asistencijeProtivnikSezona += statsIgraci[k].asistencije;
                  ukradeneProtivnikSezona += statsIgraci[k].ukradene;
                  izgubljeneProtivnikSezona += statsIgraci[k].izgubljene;
                  blokadeProtivnikSezona += statsIgraci[k].blokade;
                  blokadePrimljeneProtivnikSezona += statsIgraci[k].blokadePrimljene;
                  licneGreskeProtivnikSezona += statsIgraci[k].licneGreske;
                  iznudjeniFauloviProtivnikSezona += statsIgraci[k].iznudjeniFaulovi;
                  indeksProtivnikSezona += statsIgraci[k].indeks;
                }
                if (obradjenoTimProtivnikSezona === utakmiceTimSezona.length) {
                  this.prosekPoenaTimProtivnikSezona = poeniProtivnikSezona / this.brojUtakmicaTimSezona;
                  this.prosekAsistencijaTimProtivnikSezona =
                    asistencijeProtivnikSezona / this.brojUtakmicaTimSezona;
                  this.prosekSkokovaTimProtivnikSezona = skokoviProtivnikSezona / this.brojUtakmicaTimSezona;
                  this.prosekIndeksaTimProtivnikSezona = indeksProtivnikSezona / this.brojUtakmicaTimSezona;
                  if (dvaPoenaPogodakProtivnikSezona + dvaPoenaPromasajProtivnikSezona > 0) {
                    this.prosekDvaPoenaTimProtivnikSezona =
                      (dvaPoenaPogodakProtivnikSezona /
                        (dvaPoenaPogodakProtivnikSezona + dvaPoenaPromasajProtivnikSezona)) *
                      100;
                  } else {
                    this.prosekDvaPoenaTimProtivnikSezona = 0;
                  }
                  if (triPoenaPogodakProtivnikSezona + triPoenaPromasajProtivnikSezona > 0) {
                    this.prosekTriPoenaTimProtivnikSezona =
                      (triPoenaPogodakProtivnikSezona /
                        (triPoenaPogodakProtivnikSezona + triPoenaPromasajProtivnikSezona)) *
                      100;
                  } else {
                    this.prosekTriPoenaTimProtivnikSezona = 0;
                  }
                  if (slobodnoPogodakProtivnikSezona + slobodnoPromasajProtivnikSezona > 0) {
                    this.prosekSlobodnoTimProtivnikSezona =
                      (slobodnoPogodakProtivnikSezona /
                        (slobodnoPogodakProtivnikSezona + slobodnoPromasajProtivnikSezona)) *
                      100;
                  } else {
                    this.prosekSlobodnoTimProtivnikSezona = 0;
                  }
                  this.prosekSkokoviNapadTimProtivnikSezona =
                    skokoviNapadProtivnikSezona / this.brojUtakmicaTimSezona;
                  this.prosekSkokoviOdbranaTimProtivnikSezona =
                    skokoviOdbranaProtivnikSezona / this.brojUtakmicaTimSezona;
                  this.prosekUkradeneTimProtivnikSezona = ukradeneProtivnikSezona / this.brojUtakmicaTimSezona;
                  this.prosekIzgubljeneTimProtivnikSezona =
                    izgubljeneProtivnikSezona / this.brojUtakmicaTimSezona;
                  this.prosekBlokadeTimProtivnikSezona = blokadeProtivnikSezona / this.brojUtakmicaTimSezona;
                  this.prosekBlokadePrimljeneTimProtivnikSezona =
                    blokadePrimljeneProtivnikSezona / this.brojUtakmicaTimSezona;
                  this.prosekLicneGreskeTimProtivnikSezona =
                    licneGreskeProtivnikSezona / this.brojUtakmicaTimSezona;
                  this.prosekIznudjeniFauloviTimProtivnikSezona =
                    iznudjeniFauloviProtivnikSezona / this.brojUtakmicaTimSezona;

                  setTimeout(() => this.nacrtajPoredjenjeSezona(), 0);
                }
              });
          }
        }
      });
  }

  nacrtajPoredjenje() {
    if (!this.poredjenjeChartRef) return;
    if (this.poredjenjeChart) this.poredjenjeChart.destroy();

    this.poredjenjeChart = new Chart(this.poredjenjeChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: [
          'Poeni',
          '3FG%',
          '2FG%',
          'FT%',
          'Skokovi',
          'Skokovi napad',
          'Skokovi odbrana',
          'Asist.',
          'Ukradene',
          'Blokade',
          'Izgubljene',
        ],
        datasets: [
          {
            label: this.klub, // moja ekipa
            data: [
              this.prosekPoenaTim,
              this.prosekTriPoenaTim,
              this.prosekDvaPoenaTim,
              this.prosekSlobodnoTim,
              this.prosekSkokovaTim,
              this.prosekSkokoviNapadTim,
              this.prosekSkokoviOdbranaTim,
              this.prosekAsistencijaTim,
              this.prosekUkradeneTim,
              this.prosekBlokadeTim,
              this.prosekIzgubljeneTim,
            ],
            backgroundColor: '#d4af37', // zlatna - moja ekipa
          },
          {
            label: 'Protivnici',
            data: [
              this.prosekPoenaTimProtivnik,
              this.prosekTriPoenaTimProtivnik,
              this.prosekDvaPoenaTimProtivnik,
              this.prosekSlobodnoTimProtivnik,
              this.prosekSkokovaTimProtivnik,
              this.prosekSkokoviNapadTimProtivnik,
              this.prosekSkokoviOdbranaTimProtivnik,
              this.prosekAsistencijaTimProtivnik,
              this.prosekUkradeneTimProtivnik,
              this.prosekBlokadeTimProtivnik,
              this.prosekIzgubljeneTimProtivnik,
            ],
            backgroundColor: '#3aa0e0', // plava - protivnici
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: '#e8e8e8' },
          },
        },
        scales: {
          x: {
            ticks: { color: '#95a5a6' },
            grid: { display: false },
          },
          y: {
            ticks: { color: '#95a5a6' },
            grid: { color: 'rgba(255,255,255,0.05)' },
            beginAtZero: true,
          },
        },
      },
    });
  }

  nacrtajPoredjenjeSezona() {
    if (!this.poredjenjeChartSezonaRef) return;
    if (this.poredjenjeChartSezona) this.poredjenjeChartSezona.destroy();

    this.poredjenjeChartSezona = new Chart(this.poredjenjeChartSezonaRef.nativeElement, {
      type: 'bar',
      data: {
        labels: [
          'Poeni',
          '3FG%',
          '2FG%',
          'FT%',
          'Skokovi',
          'Skokovi napad',
          'Skokovi odbrana',
          'Asist.',
          'Ukradene',
          'Blokade',
          'Izgubljene',
        ],
        datasets: [
          {
            label: this.klub, // moja ekipa
            data: [
              this.prosekPoenaTimSezona,
              this.prosekTriPoenaTimSezona,
              this.prosekDvaPoenaTimSezona,
              this.prosekSlobodnoTimSezona,
              this.prosekSkokovaTimSezona,
              this.prosekSkokoviNapadTimSezona,
              this.prosekSkokoviOdbranaTimSezona,
              this.prosekAsistencijaTimSezona,
              this.prosekUkradeneTimSezona,
              this.prosekBlokadeTimSezona,
              this.prosekIzgubljeneTimSezona,
            ],
            backgroundColor: '#d4af37', // zlatna - moja ekipa
          },
          {
            label: 'Protivnici',
            data: [
              this.prosekPoenaTimProtivnikSezona,
              this.prosekTriPoenaTimProtivnikSezona,
              this.prosekDvaPoenaTimProtivnikSezona,
              this.prosekSlobodnoTimProtivnikSezona,
              this.prosekSkokovaTimProtivnikSezona,
              this.prosekSkokoviNapadTimProtivnikSezona,
              this.prosekSkokoviOdbranaTimProtivnikSezona,
              this.prosekAsistencijaTimProtivnikSezona,
              this.prosekUkradeneTimProtivnikSezona,
              this.prosekBlokadeTimProtivnikSezona,
              this.prosekIzgubljeneTimProtivnikSezona,
            ],
            backgroundColor: '#3aa0e0', // plava - protivnici
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: '#e8e8e8' },
          },
        },
        scales: {
          x: {
            ticks: { color: '#95a5a6' },
            grid: { display: false },
          },
          y: {
            ticks: { color: '#95a5a6' },
            grid: { color: 'rgba(255,255,255,0.05)' },
            beginAtZero: true,
          },
        },
      },
    });
  }
  otvoriProfil(korisnickoIme: string) {
    sessionStorage.setItem('igrac', korisnickoIme);
    this.router.navigate(['/trener-profil-igraca']);
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

  sortiraj(kolona: string, prviPut: boolean = false) {
    if (this.sortKolona === kolona && !prviPut) {
      // ista kolona - obrni smer
      this.sortSmer = this.sortSmer === 'desc' ? 'asc' : 'desc';
    } else {
      // nova kolona - kreni silazno
      this.sortKolona = kolona;
      this.sortSmer = 'desc';
    }
    const niz = this.izabranaSezona == -1 ? this.igraciProseci : this.igraciProseciSezona;
    switch (kolona) {
      case 'broj': {
        niz.sort((a, b) => {
          const vrednostA = a.igrac.broj;
          const vrednostB = b.igrac.broj;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'utakmica': {
        niz.sort((a, b) => {
          const vrednostA = a.brojUtakmica;
          const vrednostB = b.brojUtakmica;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'starter': {
        niz.sort((a, b) => {
          const vrednostA = a.startovaoUtakmica;
          const vrednostB = b.startovaoUtakmica;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'minuti': {
        niz.sort((a, b) => {
          const vrednostA = a.prosekMinutaSek;
          const vrednostB = b.prosekMinutaSek;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'poeni': {
        niz.sort((a, b) => {
          const vrednostA = a.prosekPoena;
          const vrednostB = b.prosekPoena;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'skokovi': {
        niz.sort((a, b) => {
          const vrednostA = a.prosekSkokova;
          const vrednostB = b.prosekSkokova;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'skokoviNapad': {
        niz.sort((a, b) => {
          const vrednostA = a.prosekSkokoviNapad;
          const vrednostB = b.prosekSkokoviNapad;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'skokoviOdbrana': {
        niz.sort((a, b) => {
          const vrednostA = a.prosekSkokoviOdbrana;
          const vrednostB = b.prosekSkokoviOdbrana;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'asistencije': {
        niz.sort((a, b) => {
          const vrednostA = a.prosekAsistencija;
          const vrednostB = b.prosekAsistencija;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'ukradene': {
        niz.sort((a, b) => {
          const vrednostA = a.prosekUkradene;
          const vrednostB = b.prosekUkradene;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'blokade': {
        niz.sort((a, b) => {
          const vrednostA = a.prosekBlokade;
          const vrednostB = b.prosekBlokade;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'blokadePrimljene': {
        niz.sort((a, b) => {
          const vrednostA = a.prosekBlokadePrimljene;
          const vrednostB = b.prosekBlokadePrimljene;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'izgubljene': {
        niz.sort((a, b) => {
          const vrednostA = a.prosekIzgubljene;
          const vrednostB = b.prosekIzgubljene;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'dvaProcenat': {
        niz.sort((a, b) => {
          const vrednostA = a.prosekDvaPoena;
          const vrednostB = b.prosekDvaPoena;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'triProcenat': {
        niz.sort((a, b) => {
          const vrednostA = a.prosekTriPoena;
          const vrednostB = b.prosekTriPoena;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'slobodnoProcenat': {
        niz.sort((a, b) => {
          const vrednostA = a.prosekSlobodno;
          const vrednostB = b.prosekSlobodno;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'indeks': {
        niz.sort((a, b) => {
          const vrednostA = a.prosekIndeksa;
          const vrednostB = b.prosekIndeksa;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'licneGreske': {
        niz.sort((a, b) => {
          const vrednostA = a.prosekLicneGreske;
          const vrednostB = b.prosekLicneGreske;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }
      case 'iznudjeniFaulovi': {
        niz.sort((a, b) => {
          const vrednostA = a.prosekIznudjeniFaulovi;
          const vrednostB = b.prosekIznudjeniFaulovi;
          return this.sortSmer === 'desc' ? vrednostB - vrednostA : vrednostA - vrednostB;
        });
        break;
      }

      default:
        break;
    }
  }
  logOut() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }
  trenerPocetna() {
    this.router.navigate(['trener-pocetna']);
  }
  promeniIzbor(){
    if(this.izabranaSezona!=-1){
      this.izracunajProsekeSezona();
    }else{
      this.izracunajProseke();
    }
  }
}
