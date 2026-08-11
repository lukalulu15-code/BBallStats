import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { IgraciService } from '../services/igraci-service';
import { TreneriService } from '../services/treneri-service';
import { Trener } from '../models/trener';
import { Utakmica } from '../models/utakmica';
import { Igrac } from '../models/igrac';
import { CommonModule } from '@angular/common';
import { ProtivnickiIgraciService } from '../services/protivnicki-igraci-service';
import { ProtivnickiIgrac } from '../models/protivnickiIgrac';
import { StatistikaIgraca } from '../models/statistkaIgraca';
import { StatistikaIgracaService } from '../services/statistika-igraca-service';
import { UtakmiceService } from '../services/utakmice-service';
import { TajmerService } from '../services/tajmer-service';
import { UtakmicaDogadjajiService } from '../services/utakmica-dogadjaji-service';
import { UtakmicaDogadjaji } from '../models/utakmicaDogadjaji';

@Component({
  selector: 'app-utakmica-live-krenula',
  imports: [FormsModule, RouterOutlet, CommonModule],
  templateUrl: './utakmica-live-krenula.html',
  styleUrls: ['./utakmica-live-krenula.css', '../../styles.css'],
})
export class UtakmicaLiveKrenula {
  constructor(
    private router: Router,
    private igraciService: IgraciService,
    private treneriService: TreneriService,
    private protivnickiIgraciService: ProtivnickiIgraciService,
    private statistikaIgracaService: StatistikaIgracaService,
    private utakmiceService: UtakmiceService,
    private tajmerService: TajmerService,
    private utakmicaDogadjajiService: UtakmicaDogadjajiService,
  ) {}

  ngOnInit(): void {
    this.korisnickoImeTrenera = sessionStorage.getItem('korisnickoImeT');
    const utakmicaString = sessionStorage.getItem('utakmica');
    if (utakmicaString) {
      this.utakmica = JSON.parse(utakmicaString);
      if (this.utakmica != null) {
        this.utakmicaId = this.utakmica.id;
        this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((data) => {
          this.poeniDomacin = data.poeniDomacin;
          this.poeniGost = data.poeniGost;
        });
      }
    } else {
      this.utakmica = null;
    }
    if (this.korisnickoImeTrenera == null) {
      alert('Nije Vam dozvoljen pristup ovoj stranici');
      return;
    } else {
      this.protivnickiIgraciString = sessionStorage.getItem('protivnickiIgraci');
      this.nasiIgraciString = sessionStorage.getItem('nasiIgraci');
      if (this.protivnickiIgraciString != null) {
        this.protivnickiIgraci = JSON.parse(this.protivnickiIgraciString);
        /*
        for (let i = 0; i < 5; i++) {
          this.terenProtivnickiIgraci.push(this.protivnickiIgraci[i]);
        }
        for (let j = 5; j < this.protivnickiIgraci.length; j++) {
          this.klupaProtivnickiIgraci.push(this.protivnickiIgraci[j]);
        }
          */
      }
      if (this.nasiIgraciString != null) {
        this.nasiIgraci = JSON.parse(this.nasiIgraciString);
        /*
        for (let i = 0; i < 5; i++) {
          this.terenIgraci.push(this.nasiIgraci[i]);
        }
        for (let j = 5; j < this.nasiIgraci.length; j++) {
          this.klupaIgraci.push(this.nasiIgraci[j]);
        }
          */
      }

      this.treneriService.getTrenerKorisnickoIme(this.korisnickoImeTrenera).subscribe((data) => {
        this.trener = data;
        this.statistikaIgracaService
          .getIgraciKlubUtakmicaKlupa(this.utakmicaId, this.trener.klub)
          .subscribe((data) => {
            this.klupaIgraci = this.nasiIgraci.filter((igrac) =>
              data.some((stat) => stat.id === igrac.korisnickoIme),
            );
          });
        this.statistikaIgracaService
          .getIgraciKlubUtakmicaTeren(this.utakmicaId, this.trener.klub)
          .subscribe((data) => {
            this.terenIgraci = this.nasiIgraci.filter((igrac) =>
              data.some((stat) => stat.id === igrac.korisnickoIme),
            );
          });

        if (this.utakmica != null) {
          this.domacin = this.utakmica.domacin;
          this.gost = this.utakmica.gost;
          if (this.utakmica.domacin == this.trener.klub) {
            this.protivnik = this.utakmica.gost;
          } else {
            this.protivnik = this.utakmica.domacin;
          }
          this.protivnickiIgraciService.getAllProtivnickiKlub(this.protivnik).subscribe((data3) => {
            this.protivnickiIgraci = data3;
            this.statistikaIgracaService
              .getIgraciKlubUtakmicaKlupa(this.utakmicaId, this.protivnik)
              .subscribe((data) => {
                this.klupaProtivnickiIgraci = this.protivnickiIgraci.filter((igrac) =>
                  data.some((stat) => stat.id === JSON.stringify(igrac.id)),
                );
              });
            this.statistikaIgracaService
              .getIgraciKlubUtakmicaTeren(this.utakmicaId, this.protivnik)
              .subscribe((data) => {
                this.terenProtivnickiIgraci = this.protivnickiIgraci.filter((igrac) =>
                  data.some((stat) => stat.id === JSON.stringify(igrac.id)),
                );
              });
          });
          // učitaj sve događaje pa osveži minute
          this.utakmicaDogadjajiService.getAllDogadjaji(this.utakmicaId).subscribe((dogadjaji) => {
            this.sviDogadjaji = dogadjaji;
            this.statistikaIgracaService
              .getIgraciKlubUtakmica(this.utakmicaId, this.domacin)
              .subscribe((statsIgraci) => {
                this.statistikaIgracaService
                  .getIgraciKlubUtakmica(this.utakmicaId, this.gost)
                  .subscribe((statsIgraci) => {
                    this.gostujuciIgraciStats = statsIgraci;
                    for (let i = 0; i < statsIgraci.length; i++) {
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
                        if (
                          this.dvaPoenaPogodakUkupnoGosti + this.dvaPoenaPromasajUkupnoGosti !=
                          0
                        ) {
                          this.dvaPoenaProcenatUkupnoGosti =
                            (this.dvaPoenaPogodakUkupnoGosti /
                              (this.dvaPoenaPogodakUkupnoGosti +
                                this.dvaPoenaPromasajUkupnoGosti)) *
                            100;
                        } else {
                          this.dvaPoenaProcenatUkupnoGosti = 0;
                        }
                        if (
                          this.triPoenaPogodakUkupnoGosti + this.triPoenaPromasajUkupnoGosti !=
                          0
                        ) {
                          this.triPoenaProcenatUkupnoGosti =
                            (this.triPoenaPogodakUkupnoGosti /
                              (this.triPoenaPogodakUkupnoGosti +
                                this.triPoenaPromasajUkupnoGosti)) *
                            100;
                        } else {
                          this.triPoenaProcenatUkupnoGosti = 0;
                        }
                        if (
                          this.slobodnoPogodakUkupnoGosti + this.slobodnoPromasajUkupnoGosti !=
                          0
                        ) {
                          this.slobodnoProcenatUkupnoGosti =
                            (this.slobodnoPogodakUkupnoGosti /
                              (this.slobodnoPogodakUkupnoGosti +
                                this.slobodnoPromasajUkupnoGosti)) *
                            100;
                        } else {
                          this.slobodnoProcenatUkupnoGosti = 0;
                        }
                      }
                    }
                  });
                this.domaciIgraciStats = statsIgraci;
                for (let i = 0; i < statsIgraci.length; i++) {
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
              });
            this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((game) => {
              if (game.status == 'u toku') {
                this.azurirajMinuteSvih();
              }
            });
          });

          this.prikaziEkipu = this.utakmica.domacin;
        }
      });
      this.protivnickiIgraciService.getAllProtivnickiIgraci().subscribe((data) => {
        this.sviProtivnickiIgraci = data;
      });
    }

    this.utakmicaDogadjajiService.getAllDogadjajiCetvrtina(this.utakmicaId, 1).subscribe((data) => {
      this.dogadjajiPrvaCetvrtina = data;
    });
    this.utakmicaDogadjajiService.getAllDogadjajiCetvrtina(this.utakmicaId, 2).subscribe((data) => {
      this.dogadjajiDrugaCetvrtina = data;
    });
    this.utakmicaDogadjajiService.getAllDogadjajiCetvrtina(this.utakmicaId, 3).subscribe((data) => {
      this.dogadjajiTrecaCetvrtina = data;
    });
    this.utakmicaDogadjajiService.getAllDogadjajiCetvrtina(this.utakmicaId, 4).subscribe((data) => {
      this.dogadjajiCetvrtaCetvrtina = data;
    });
    this.utakmicaDogadjajiService.getAllDogadjajiProduzeci(this.utakmicaId).subscribe((data) => {
      this.dogadjajiProduzetak = data;
    });

    // učitaj stanje tajmera iz baze
    this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((data) => {
      this.tajmerService.cetvrtina = data.cetvrtina;
      this.cetvrtina = data.cetvrtina;

      if (data.tajmerRadi && data.poslednjiUpdate) {
        const proteklo = Math.floor((Date.now() - new Date(data.poslednjiUpdate).getTime()) / 1000);
        this.tajmerService.vreme = Math.max(0, data.vremeTajmer - proteklo);
        this.tajmerService.radi = true;
        this.tajmerService.pokreni();
      } else {
        this.tajmerService.vreme = data.vremeTajmer;
        this.tajmerService.radi = false;
      }
      this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((u: any) => {
        this.tajmerService.cetvrtina = u.cetvrtina;
        this.cetvrtina = u.cetvrtina;

        if (u.tajmerRadi && u.poslednjiUpdate) {
          // tajmer je radio - oduzmi koliko je realno prošlo od poslednjeg upisa
          const proteklo = Math.floor((Date.now() - new Date(u.poslednjiUpdate).getTime()) / 1000);
          this.tajmerService.vreme = Math.max(0, u.vremeTajmer - proteklo);
          this.tajmerService.radi = true;
          this.tajmerService.pokreni(); // nastavi odbrojavanje
        } else {
          // tajmer je bio pauziran - samo učitaj gde je stao
          this.tajmerService.vreme = u.vremeTajmer;
          this.tajmerService.radi = false;
        }

        this.vremeCetvrtina = this.tajmerService.formatVreme;
      });
    });

    // osvežavaj minute i vreme svake sekunde
    this.tajmerService.vremePromena.subscribe(() => {
      this.cetvrtina = this.tajmerService.cetvrtina;
      this.vremeCetvrtina = this.tajmerService.formatVreme;
      this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((game) => {
        if (game.status == 'u toku') {
          this.azurirajMinuteSvih();
        }
      });
    });
  }

  poeniDomacin: number = 0;
  poeniGost: number = 0;
  domacin: string = '';
  gost: string = '';

  korisnickoImeTrenera: string | null = '';
  trener: Trener = new Trener();
  utakmica: Utakmica | null = new Utakmica();
  igraci: Igrac[] = [];
  terenIgraci: Igrac[] = [];
  klupaIgraci: Igrac[] = [];
  brojNasihIgraca: number = 0;
  nasiIgraciString: string | null = '';

  protivnickiIgraci: ProtivnickiIgrac[] = [];
  sviProtivnickiIgraci: ProtivnickiIgrac[] = [];
  nasiIgraci: Igrac[] = [];
  protivnickiIgraciString: string | null = '';
  terenProtivnickiIgraci: ProtivnickiIgrac[] = [];
  klupaProtivnickiIgraci: ProtivnickiIgrac[] = [];

  cnt: number = 0;

  nasRezultat: number = 0;
  tajmerAktivan: boolean = true;
  njihovRezultat: number = 0;
  protivnik: string = '';

  poruka: string = '';
  message: string = '';

  greska: string = '';

  odabraniIgrac: any = null;
  dragIgrac: any = null;
  dragProtivnickiIgrac: any = null;
  dragoverZona: string | null = null;
  pbpLog: any[] = [];

  noviIgrac: Igrac = new Igrac();

  selectFokus: boolean = false;

  utakmicaId: number = -1;

  domaciIgraciStats: StatistikaIgraca[] = [];
  gostujuciIgraciStats: StatistikaIgraca[] = [];

  prikaziEkipu: string = '';

  updateIgrac: StatistikaIgraca = new StatistikaIgraca();

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

  cetvrtina: number = 0;
  vremeCetvrtina: string = '';
  vremeCetvrtinaSekunde: number = 0;

  dogadjajiPrvaCetvrtina: UtakmicaDogadjaji[] = [];
  dogadjajiDrugaCetvrtina: UtakmicaDogadjaji[] = [];
  dogadjajiTrecaCetvrtina: UtakmicaDogadjaji[] = [];
  dogadjajiCetvrtaCetvrtina: UtakmicaDogadjaji[] = [];
  dogadjajiProduzetak: UtakmicaDogadjaji[] = [];
  dogadjajId: number = 0;
  sviDogadjaji: UtakmicaDogadjaji[] = [];

  odabraniStatisikaIgraca: StatistikaIgraca = new StatistikaIgraca();

  pbpCetvrtina: number = 1;

  prikaziUnosVremena = false;
  unosMinuti: number = 0;
  unosSekunde: number = 0;
  unosShotClock: number = 0;

  aktivanTab: string = 'boxScore';

  pozicijeNasi = [
    { x: 110, y: 180 },
    { x: 185, y: 110 },
    { x: 185, y: 250 },
    { x: 255, y: 140 },
    { x: 255, y: 220 },
  ];

  pozicijeProtivnik = [
    { x: 530, y: 180 },
    { x: 455, y: 110 },
    { x: 455, y: 250 },
    { x: 385, y: 140 },
    { x: 385, y: 220 },
  ];

  /*

   obrisiIgraca(korisnickoImeIgraca:string){
    this.igraciService.deleteIgrac(korisnickoImeIgraca).subscribe(resp=>{
      alert("Uspesno ste obrisali igraca");
      this.igraciService.getAllIgraciTrenera(this.trener.korisnickoIme).subscribe(data=>{
        this.sviIgraciTrenera=data;
      })
    })
    
   }

   */

  // ─── DRAG & DROP ───

  onDragStart(igrac: any) {
    this.dragIgrac = igrac;
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    const zona = (e.currentTarget as HTMLElement).dataset['zona'];
    this.dragoverZona = zona || null;
  }

  onDragLeave(e: DragEvent) {
    this.dragoverZona = null;
  }

  onDrop(e: DragEvent, zona: string) {
    e.preventDefault();
    this.dragoverZona = null;
    if (!this.dragIgrac) return;
    if (this.dragIgrac)
      if (zona === 'teren') {
        if (this.terenIgraci.length >= 5) {
          alert('Na terenu već ima 5 igrača. Najpre izvedi nekog.');
          return;
        }
        this.dragIgrac.teren = true;
      } else {
        this.dragIgrac.teren = false;
        if (this.odabraniIgrac?.id === this.dragIgrac.id) {
          this.odabraniIgrac = null;
        }
      }
    this.dragIgrac = null;
  }

  onDropNaIgraca(e: DragEvent, cilj: any) {
    e.preventDefault();
    e.stopPropagation();
    this.dragoverZona = null;

    if (!this.dragIgrac || this.dragIgrac.korisnickoIme === cilj.korisnickoIme) return;

    const dragJeNaTerenu = this.terenIgraci.some(
      (ig) => ig.korisnickoIme === this.dragIgrac.korisnickoIme,
    );
    const ciljJeNaTerenu = this.terenIgraci.some((ig) => ig.korisnickoIme === cilj.korisnickoIme);
    const dragIgracData = this.dragIgrac;
    const ciljIgracData = cilj;

    if (dragJeNaTerenu && !ciljJeNaTerenu) {
      // sa terena na klupu - zamena
      let indexTeren = this.terenIgraci.findIndex((ig) => {
        return ig.korisnickoIme === this.dragIgrac.korisnickoIme;
      });
      let indexKlupa = this.klupaIgraci.findIndex((ig) => {
        return ig.korisnickoIme === cilj.korisnickoIme;
      });
      this.terenIgraci[indexTeren] = cilj;
      this.klupaIgraci[indexKlupa] = this.dragIgrac;

      if (this.tajmerService.cetvrtina == 1 && this.tajmerService.vreme == 600) {
        this.statistikaIgracaService
          .updateIgracStarter(dragIgracData.korisnickoIme, this.utakmicaId, false)
          .subscribe((msg) => {
            this.statistikaIgracaService
              .updateIgracStarter(ciljIgracData.korisnickoIme, this.utakmicaId, true)
              .subscribe((msg2) => {
                if (this.protivnik == this.gost) {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.domacin)
                    .subscribe((domaci) => {
                      this.domaciIgraciStats = domaci;
                    });
                } else {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.gost)
                    .subscribe((gosti) => {
                      this.gostujuciIgraciStats = gosti;
                    });
                }
              });
          });
      }
      this.statistikaIgracaService
        .updateIgracTeren(dragIgracData.korisnickoIme, this.utakmicaId, false)
        .subscribe((msg3) => {
          this.statistikaIgracaService
            .updateIgracTeren(ciljIgracData.korisnickoIme, this.utakmicaId, true)
            .subscribe((msg4) => {
              if (this.protivnik == this.gost) {
                this.statistikaIgracaService
                  .getIgraciKlubUtakmica(this.utakmicaId, this.domacin)
                  .subscribe((domaci) => {
                    this.domaciIgraciStats = domaci;
                  });
              } else {
                this.statistikaIgracaService
                  .getIgraciKlubUtakmica(this.utakmicaId, this.gost)
                  .subscribe((gosti) => {
                    this.gostujuciIgraciStats = gosti;
                  });
              }
            });
        });
      if (this.tajmerService.vreme != 600 || this.tajmerService.cetvrtina != 1) {
        this.statistikaIgracaService
          .getIgracUtakmica(dragIgracData.korisnickoIme, this.utakmicaId)
          .subscribe((dragIgracStats) => {
            this.statistikaIgracaService
              .getIgracUtakmica(ciljIgracData.korisnickoIme, this.utakmicaId)
              .subscribe((ciljIgracStats) => {
                this.utakmicaDogadjajiService
                  .addDogadjaj(
                    this.utakmicaId,
                    this.domacin,
                    this.gost,
                    this.tajmerVreme(),
                    this.cetvrtina,
                    this.poeniDomacin,
                    this.poeniGost,
                    'Sub OUT',
                    dragIgracData.klub,
                    dragIgracData.ime,
                    dragIgracData.prezime,
                    dragIgracData.broj,
                    dragIgracStats,
                  )
                  .subscribe((msg) => {
                    this.utakmicaDogadjajiService
                      .addDogadjaj(
                        this.utakmicaId,
                        this.domacin,
                        this.gost,
                        this.tajmerVreme(),
                        this.cetvrtina,
                        this.poeniDomacin,
                        this.poeniGost,
                        'Sub IN',
                        ciljIgracData.klub,
                        ciljIgracData.ime,
                        ciljIgracData.prezime,
                        ciljIgracData.broj,
                        ciljIgracStats,
                      )
                      .subscribe((msg2) => {
                        this.utakmicaDogadjajiService
                          .getAllDogadjaji(this.utakmicaId)
                          .subscribe((allDogadjaji) => {
                            this.sviDogadjaji = allDogadjaji; // ← DODAJ
                            this.azurirajMinuteSvih();
                            for (let i = 0; i < allDogadjaji.length; i++) {
                              if (allDogadjaji[i].cetvrtina == 1) {
                                if (
                                  !this.dogadjajiPrvaCetvrtina.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiPrvaCetvrtina.push(allDogadjaji[i]);
                                  this.dogadjajiPrvaCetvrtina.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;

                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              } else if (allDogadjaji[i].cetvrtina == 2) {
                                if (
                                  !this.dogadjajiDrugaCetvrtina.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiDrugaCetvrtina.push(allDogadjaji[i]);
                                  this.dogadjajiDrugaCetvrtina.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;

                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              } else if (allDogadjaji[i].cetvrtina == 3) {
                                if (
                                  !this.dogadjajiTrecaCetvrtina.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiTrecaCetvrtina.push(allDogadjaji[i]);
                                  this.dogadjajiTrecaCetvrtina.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;

                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              } else if (allDogadjaji[i].cetvrtina == 4) {
                                if (
                                  !this.dogadjajiCetvrtaCetvrtina.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiCetvrtaCetvrtina.push(allDogadjaji[i]);
                                  this.dogadjajiCetvrtaCetvrtina.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;

                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              } else if (allDogadjaji[i].cetvrtina > 4) {
                                if (
                                  !this.dogadjajiProduzetak.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiProduzetak.push(allDogadjaji[i]);
                                  this.dogadjajiProduzetak.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;
                                    if (a.cetvrtina !== b.cetvrtina) {
                                      return b.cetvrtina - a.cetvrtina;
                                    }
                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              }
                            }
                          });
                      });
                  });
              });
          });
      }
    } else if (!dragJeNaTerenu && ciljJeNaTerenu) {
      // sa klupe na teren - zamena
      let indexTeren = this.terenIgraci.findIndex((ig) => {
        return ig.korisnickoIme === cilj.korisnickoIme;
      });
      let indexKlupa = this.klupaIgraci.findIndex((ig) => {
        return ig.korisnickoIme === this.dragIgrac.korisnickoIme;
      });
      this.klupaIgraci[indexKlupa] = cilj;
      this.terenIgraci[indexTeren] = this.dragIgrac;

      if (this.tajmerService.cetvrtina == 1 && this.tajmerService.vreme == 600) {
        this.statistikaIgracaService
          .updateIgracStarter(dragIgracData.korisnickoIme, this.utakmicaId, true)
          .subscribe((msg) => {
            this.statistikaIgracaService
              .updateIgracStarter(ciljIgracData.korisnickoIme, this.utakmicaId, false)
              .subscribe((msg2) => {
                if (this.protivnik == this.gost) {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.domacin)
                    .subscribe((domaci) => {
                      this.domaciIgraciStats = domaci;
                    });
                } else {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.gost)
                    .subscribe((gosti) => {
                      this.gostujuciIgraciStats = gosti;
                    });
                }
              });
          });
      }
      this.statistikaIgracaService
        .updateIgracTeren(dragIgracData.korisnickoIme, this.utakmicaId, true)
        .subscribe((msg3) => {
          this.statistikaIgracaService
            .updateIgracTeren(ciljIgracData.korisnickoIme, this.utakmicaId, false)
            .subscribe((msg4) => {
              if (this.protivnik == this.gost) {
                this.statistikaIgracaService
                  .getIgraciKlubUtakmica(this.utakmicaId, this.domacin)
                  .subscribe((domaci) => {
                    this.domaciIgraciStats = domaci;
                  });
              } else {
                this.statistikaIgracaService
                  .getIgraciKlubUtakmica(this.utakmicaId, this.gost)
                  .subscribe((gosti) => {
                    this.gostujuciIgraciStats = gosti;
                  });
              }
            });
        });

      if (this.tajmerService.vreme != 600 || this.tajmerService.cetvrtina != 1) {
        this.statistikaIgracaService
          .getIgracUtakmica(dragIgracData.korisnickoIme, this.utakmicaId)
          .subscribe((dragIgracStats) => {
            this.statistikaIgracaService
              .getIgracUtakmica(ciljIgracData.korisnickoIme, this.utakmicaId)
              .subscribe((ciljIgracStats) => {
                this.utakmicaDogadjajiService
                  .addDogadjaj(
                    this.utakmicaId,
                    this.domacin,
                    this.gost,
                    this.tajmerVreme(),
                    this.cetvrtina,
                    this.poeniDomacin,
                    this.poeniGost,
                    'Sub IN',
                    dragIgracData.klub,
                    dragIgracData.ime,
                    dragIgracData.prezime,
                    dragIgracData.broj,
                    dragIgracStats,
                  )
                  .subscribe((msg) => {
                    this.utakmicaDogadjajiService
                      .addDogadjaj(
                        this.utakmicaId,
                        this.domacin,
                        this.gost,
                        this.tajmerVreme(),
                        this.cetvrtina,
                        this.poeniDomacin,
                        this.poeniGost,
                        'Sub OUT',
                        ciljIgracData.klub,
                        ciljIgracData.ime,
                        ciljIgracData.prezime,
                        ciljIgracData.broj,
                        ciljIgracStats,
                      )
                      .subscribe((msg2) => {
                        this.utakmicaDogadjajiService
                          .getAllDogadjaji(this.utakmicaId)
                          .subscribe((allDogadjaji) => {
                            this.sviDogadjaji = allDogadjaji; // ← DODAJ
                            this.azurirajMinuteSvih();
                            for (let i = 0; i < allDogadjaji.length; i++) {
                              if (allDogadjaji[i].cetvrtina == 1) {
                                if (
                                  !this.dogadjajiPrvaCetvrtina.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiPrvaCetvrtina.push(allDogadjaji[i]);
                                  this.dogadjajiPrvaCetvrtina.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;

                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              } else if (allDogadjaji[i].cetvrtina == 2) {
                                if (
                                  !this.dogadjajiDrugaCetvrtina.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiDrugaCetvrtina.push(allDogadjaji[i]);
                                  this.dogadjajiDrugaCetvrtina.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;

                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              } else if (allDogadjaji[i].cetvrtina == 3) {
                                if (
                                  !this.dogadjajiTrecaCetvrtina.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiTrecaCetvrtina.push(allDogadjaji[i]);
                                  this.dogadjajiTrecaCetvrtina.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;

                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              } else if (allDogadjaji[i].cetvrtina == 4) {
                                if (
                                  !this.dogadjajiCetvrtaCetvrtina.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiCetvrtaCetvrtina.push(allDogadjaji[i]);
                                  this.dogadjajiCetvrtaCetvrtina.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;

                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              } else if (allDogadjaji[i].cetvrtina > 4) {
                                if (
                                  !this.dogadjajiProduzetak.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiProduzetak.push(allDogadjaji[i]);
                                  this.dogadjajiProduzetak.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;
                                    if (a.cetvrtina !== b.cetvrtina) {
                                      return b.cetvrtina - a.cetvrtina;
                                    }
                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              }
                            }
                          });
                      });
                  });
              });
          });
      }
    } else if (dragJeNaTerenu && ciljJeNaTerenu) {
      // sa terena na teren  - zamena
      let indexTeren1 = this.terenIgraci.findIndex((ig) => {
        return ig.korisnickoIme === this.dragIgrac.korisnickoIme;
      });
      let indexTeren2 = this.terenIgraci.findIndex((ig) => {
        return ig.korisnickoIme === cilj.korisnickoIme;
      });
      this.terenIgraci[indexTeren1] = cilj;
      this.terenIgraci[indexTeren2] = this.dragIgrac;
    } else if (!dragJeNaTerenu && !ciljJeNaTerenu) {
      // sa klupe na klupu - zamena
      let indexKlupa1 = this.klupaIgraci.findIndex((ig) => {
        return ig.korisnickoIme === cilj.korisnickoIme;
      });
      let indexKlupa2 = this.klupaIgraci.findIndex((ig) => {
        return ig.korisnickoIme === this.dragIgrac.korisnickoIme;
      });
      this.klupaIgraci[indexKlupa2] = cilj;
      this.klupaIgraci[indexKlupa1] = this.dragIgrac;
    }

    this.dragIgrac = null;
  }

  onDragStartProtivnicki(igrac: any) {
    this.dragProtivnickiIgrac = igrac;
  }

  onDragOverProtivnicki(e: DragEvent) {
    e.preventDefault();
    const zona = (e.currentTarget as HTMLElement).dataset['zona'];
    this.dragoverZona = zona || null;
  }

  onDragLeaveProtivnicki(e: DragEvent) {
    this.dragoverZona = null;
  }

  onDropProtivnicki(e: DragEvent, zona: string) {
    e.preventDefault();
    this.dragoverZona = null;
    if (!this.dragProtivnickiIgrac) return;
    if (this.dragProtivnickiIgrac)
      if (zona === 'teren') {
        if (this.terenProtivnickiIgraci.length >= 5) {
          alert('Na terenu već ima 5 igrača. Najpre izvedi nekog.');
          return;
        }
        this.dragProtivnickiIgrac.teren = true;
      } else {
        this.dragProtivnickiIgrac.teren = false;
        if (this.odabraniIgrac?.id === this.dragProtivnickiIgrac.id) {
          this.odabraniIgrac = null;
        }
      }
    this.dragProtivnickiIgrac = null;
  }

  onDropNaProtivnickogIgraca(e: DragEvent, cilj: any) {
    e.preventDefault();
    e.stopPropagation();
    this.dragoverZona = null;

    if (!this.dragProtivnickiIgrac || this.dragProtivnickiIgrac.id === cilj.id) return;

    const dragJeNaTerenu = this.terenProtivnickiIgraci.some(
      (ig) => ig.id === this.dragProtivnickiIgrac.id,
    );
    const ciljJeNaTerenu = this.terenProtivnickiIgraci.some((ig) => ig.id === cilj.id);
    const dragProtivnickiIgraciData = this.dragProtivnickiIgrac;
    const ciljData = cilj;
    if (dragJeNaTerenu && !ciljJeNaTerenu) {
      // sa terena na klupu - zamena
      let indexTeren = this.terenProtivnickiIgraci.findIndex((ig) => {
        return ig.id === this.dragProtivnickiIgrac.id;
      });
      let indexKlupa = this.klupaProtivnickiIgraci.findIndex((ig) => {
        return ig.id === cilj.id;
      });
      this.terenProtivnickiIgraci[indexTeren] = cilj;
      this.klupaProtivnickiIgraci[indexKlupa] = this.dragProtivnickiIgrac;

      if (this.tajmerService.cetvrtina == 1 && this.tajmerService.vreme == 600) {
        this.statistikaIgracaService
          .updateIgracStarter(JSON.stringify(dragProtivnickiIgraciData.id), this.utakmicaId, false)
          .subscribe((msg) => {
            this.statistikaIgracaService
              .updateIgracStarter(JSON.stringify(ciljData.id), this.utakmicaId, true)
              .subscribe((msg2) => {
                if (this.protivnik != this.gost) {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.domacin)
                    .subscribe((domaci) => {
                      this.domaciIgraciStats = domaci;
                    });
                } else {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.gost)
                    .subscribe((gosti) => {
                      this.gostujuciIgraciStats = gosti;
                    });
                }
              });
          });
      }
      this.statistikaIgracaService
        .updateIgracTeren(JSON.stringify(dragProtivnickiIgraciData.id), this.utakmicaId, false)
        .subscribe((msg3) => {
          this.statistikaIgracaService
            .updateIgracTeren(JSON.stringify(ciljData.id), this.utakmicaId, true)
            .subscribe((msg4) => {
              if (this.protivnik != this.gost) {
                this.statistikaIgracaService
                  .getIgraciKlubUtakmica(this.utakmicaId, this.domacin)
                  .subscribe((domaci) => {
                    this.domaciIgraciStats = domaci;
                  });
              } else {
                this.statistikaIgracaService
                  .getIgraciKlubUtakmica(this.utakmicaId, this.gost)
                  .subscribe((gosti) => {
                    this.gostujuciIgraciStats = gosti;
                  });
              }
            });
        });
      if (this.tajmerService.vreme != 600 || this.tajmerService.cetvrtina != 1) {
        this.statistikaIgracaService
          .getIgracUtakmica(dragProtivnickiIgraciData.id, this.utakmicaId)
          .subscribe((dragProtivnickiIgraciStats) => {
            this.statistikaIgracaService
              .getIgracUtakmica(ciljData.id, this.utakmicaId)
              .subscribe((ciljStats) => {
                this.utakmicaDogadjajiService
                  .addDogadjaj(
                    this.utakmicaId,
                    this.domacin,
                    this.gost,
                    this.tajmerVreme(),
                    this.cetvrtina,
                    this.poeniDomacin,
                    this.poeniGost,
                    'Sub OUT',
                    dragProtivnickiIgraciData.klub,
                    dragProtivnickiIgraciData.ime,
                    dragProtivnickiIgraciData.prezime,
                    dragProtivnickiIgraciData.broj,
                    dragProtivnickiIgraciStats,
                  )
                  .subscribe((msg) => {
                    this.utakmicaDogadjajiService
                      .addDogadjaj(
                        this.utakmicaId,
                        this.domacin,
                        this.gost,
                        this.tajmerVreme(),
                        this.cetvrtina,
                        this.poeniDomacin,
                        this.poeniGost,
                        'Sub IN',
                        ciljData.klub,
                        ciljData.ime,
                        ciljData.prezime,
                        ciljData.broj,
                        ciljStats,
                      )
                      .subscribe((msg2) => {
                        this.utakmicaDogadjajiService
                          .getAllDogadjaji(this.utakmicaId)
                          .subscribe((allDogadjaji) => {
                            this.sviDogadjaji = allDogadjaji; // ← DODAJ
                            this.azurirajMinuteSvih();
                            for (let i = 0; i < allDogadjaji.length; i++) {
                              if (allDogadjaji[i].cetvrtina == 1) {
                                if (
                                  !this.dogadjajiPrvaCetvrtina.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiPrvaCetvrtina.push(allDogadjaji[i]);
                                  this.dogadjajiPrvaCetvrtina.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;

                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              } else if (allDogadjaji[i].cetvrtina == 2) {
                                if (
                                  !this.dogadjajiDrugaCetvrtina.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiDrugaCetvrtina.push(allDogadjaji[i]);
                                  this.dogadjajiDrugaCetvrtina.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;

                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              } else if (allDogadjaji[i].cetvrtina == 3) {
                                if (
                                  !this.dogadjajiTrecaCetvrtina.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiTrecaCetvrtina.push(allDogadjaji[i]);
                                  this.dogadjajiTrecaCetvrtina.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;

                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              } else if (allDogadjaji[i].cetvrtina == 4) {
                                if (
                                  !this.dogadjajiCetvrtaCetvrtina.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiCetvrtaCetvrtina.push(allDogadjaji[i]);
                                  this.dogadjajiCetvrtaCetvrtina.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;

                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              } else if (allDogadjaji[i].cetvrtina > 4) {
                                if (
                                  !this.dogadjajiProduzetak.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiProduzetak.push(allDogadjaji[i]);
                                  this.dogadjajiProduzetak.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;
                                    if (a.cetvrtina !== b.cetvrtina) {
                                      return b.cetvrtina - a.cetvrtina;
                                    }
                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              }
                            }
                          });
                      });
                  });
              });
          });
      }
    } else if (!dragJeNaTerenu && ciljJeNaTerenu) {
      // sa klupe na teren - zamena
      let indexTeren = this.terenProtivnickiIgraci.findIndex((ig) => {
        return ig.id === cilj.id;
      });
      let indexKlupa = this.klupaProtivnickiIgraci.findIndex((ig) => {
        return ig.id === this.dragProtivnickiIgrac.id;
      });
      this.klupaProtivnickiIgraci[indexKlupa] = cilj;
      this.terenProtivnickiIgraci[indexTeren] = this.dragProtivnickiIgrac;

      if (this.tajmerService.cetvrtina == 1 && this.tajmerService.vreme == 600) {
        this.statistikaIgracaService
          .updateIgracStarter(JSON.stringify(dragProtivnickiIgraciData.id), this.utakmicaId, true)
          .subscribe((msg) => {
            this.statistikaIgracaService
              .updateIgracStarter(JSON.stringify(ciljData.id), this.utakmicaId, false)
              .subscribe((msg2) => {
                if (this.protivnik != this.gost) {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.domacin)
                    .subscribe((domaci) => {
                      this.domaciIgraciStats = domaci;
                    });
                } else {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.gost)
                    .subscribe((gosti) => {
                      this.gostujuciIgraciStats = gosti;
                    });
                }
              });
          });
      }
      this.statistikaIgracaService
        .updateIgracTeren(JSON.stringify(dragProtivnickiIgraciData.id), this.utakmicaId, true)
        .subscribe((msg3) => {
          this.statistikaIgracaService
            .updateIgracTeren(JSON.stringify(ciljData.id), this.utakmicaId, false)
            .subscribe((msg4) => {
              if (this.protivnik != this.gost) {
                this.statistikaIgracaService
                  .getIgraciKlubUtakmica(this.utakmicaId, this.domacin)
                  .subscribe((domaci) => {
                    this.domaciIgraciStats = domaci;
                  });
              } else {
                this.statistikaIgracaService
                  .getIgraciKlubUtakmica(this.utakmicaId, this.gost)
                  .subscribe((gosti) => {
                    this.gostujuciIgraciStats = gosti;
                  });
              }
            });
        });
      if (this.tajmerService.vreme != 600 || this.tajmerService.cetvrtina != 1) {
        this.statistikaIgracaService
          .getIgracUtakmica(dragProtivnickiIgraciData.id, this.utakmicaId)
          .subscribe((dragProtivnickiIgraciStats) => {
            this.statistikaIgracaService
              .getIgracUtakmica(ciljData.id, this.utakmicaId)
              .subscribe((ciljStats) => {
                this.utakmicaDogadjajiService
                  .addDogadjaj(
                    this.utakmicaId,
                    this.domacin,
                    this.gost,
                    this.tajmerVreme(),
                    this.cetvrtina,
                    this.poeniDomacin,
                    this.poeniGost,
                    'Sub IN',
                    dragProtivnickiIgraciData.klub,
                    dragProtivnickiIgraciData.ime,
                    dragProtivnickiIgraciData.prezime,
                    dragProtivnickiIgraciData.broj,
                    dragProtivnickiIgraciStats,
                  )
                  .subscribe((msg) => {
                    this.utakmicaDogadjajiService
                      .addDogadjaj(
                        this.utakmicaId,
                        this.domacin,
                        this.gost,
                        this.tajmerVreme(),
                        this.cetvrtina,
                        this.poeniDomacin,
                        this.poeniGost,
                        'Sub OUT',
                        ciljData.klub,
                        ciljData.ime,
                        ciljData.prezime,
                        ciljData.broj,
                        ciljStats,
                      )
                      .subscribe((msg2) => {
                        this.utakmicaDogadjajiService
                          .getAllDogadjaji(this.utakmicaId)
                          .subscribe((allDogadjaji) => {
                            this.sviDogadjaji = allDogadjaji; // ← DODAJ
                            this.azurirajMinuteSvih();
                            for (let i = 0; i < allDogadjaji.length; i++) {
                              if (allDogadjaji[i].cetvrtina == 1) {
                                if (
                                  !this.dogadjajiPrvaCetvrtina.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiPrvaCetvrtina.push(allDogadjaji[i]);
                                  this.dogadjajiPrvaCetvrtina.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;
                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              } else if (allDogadjaji[i].cetvrtina == 2) {
                                if (
                                  !this.dogadjajiDrugaCetvrtina.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiDrugaCetvrtina.push(allDogadjaji[i]);
                                  this.dogadjajiDrugaCetvrtina.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;

                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              } else if (allDogadjaji[i].cetvrtina == 3) {
                                if (
                                  !this.dogadjajiTrecaCetvrtina.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiTrecaCetvrtina.push(allDogadjaji[i]);
                                  this.dogadjajiTrecaCetvrtina.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;

                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              } else if (allDogadjaji[i].cetvrtina == 4) {
                                if (
                                  !this.dogadjajiCetvrtaCetvrtina.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiCetvrtaCetvrtina.push(allDogadjaji[i]);
                                  this.dogadjajiCetvrtaCetvrtina.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;

                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              } else if (allDogadjaji[i].cetvrtina > 4) {
                                if (
                                  !this.dogadjajiProduzetak.some(
                                    (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                  )
                                ) {
                                  this.dogadjajiProduzetak.push(allDogadjaji[i]);
                                  this.dogadjajiProduzetak.sort((a, b) => {
                                    const [minA, secA] = a.vreme.split(':').map(Number);
                                    const [minB, secB] = b.vreme.split(':').map(Number);
                                    const ukupnosekundeA = minA * 60 + secA;
                                    const ukuonosekundeB = minB * 60 + secB;
                                    if (a.cetvrtina !== b.cetvrtina) {
                                      return b.cetvrtina - a.cetvrtina;
                                    }
                                    if (ukupnosekundeA !== ukuonosekundeB) {
                                      return ukupnosekundeA - ukuonosekundeB;
                                    }
                                    return b.id - a.id;
                                  });
                                }
                              }
                            }
                          });
                      });
                  });
              });
          });
      }
    } else if (dragJeNaTerenu && ciljJeNaTerenu) {
      // sa terena na teren  - zamena
      let indexTeren1 = this.terenProtivnickiIgraci.findIndex((ig) => {
        return ig.id === this.dragProtivnickiIgrac.id;
      });
      let indexTeren2 = this.terenProtivnickiIgraci.findIndex((ig) => {
        return ig.id === cilj.id;
      });
      this.terenProtivnickiIgraci[indexTeren1] = cilj;
      this.terenProtivnickiIgraci[indexTeren2] = this.dragProtivnickiIgrac;
    } else if (!dragJeNaTerenu && !ciljJeNaTerenu) {
      // sa klupe na klupu - zamena
      let indexKlupa1 = this.klupaProtivnickiIgraci.findIndex((ig) => {
        return ig.id === cilj.id;
      });
      let indexKlupa2 = this.klupaProtivnickiIgraci.findIndex((ig) => {
        return ig.id === this.dragProtivnickiIgrac.id;
      });
      this.klupaProtivnickiIgraci[indexKlupa2] = cilj;
      this.klupaProtivnickiIgraci[indexKlupa1] = this.dragProtivnickiIgrac;
    }

    this.dragProtivnickiIgrac = null;
  }

  odaberiIgraca(igrac: Igrac) {
    this.odabraniIgrac = igrac;
    this.statistikaIgracaService
      .getIgracUtakmica(igrac.korisnickoIme, this.utakmicaId)
      .subscribe((data) => {
        this.odabraniStatisikaIgraca = data;
        this.updateIgrac = data;
      });
  }
  odaberiProtivnickog(igrac: ProtivnickiIgrac) {
    this.odabraniIgrac = igrac;
    this.statistikaIgracaService
      .getIgracUtakmica(JSON.stringify(igrac.id), this.utakmicaId)
      .subscribe((data) => {
        this.odabraniStatisikaIgraca = data;
        this.updateIgrac = data;
      });
  }

  odabranNas(): boolean {
    if (this.odabraniIgrac != null) {
      if ('korisnickoIme' in this.odabraniIgrac) {
        return true;
      } else if ('id' in this.odabraniIgrac) {
        return false;
      }
    }
    return false;
  }

  izberiBox(tim: string) {
    this.prikaziEkipu = tim;
  }

  dvaPoenaPogodak(igrac: string) {
    this.shotReset(24);
    this.statistikaIgracaService
      .getIgracUtakmica(igrac, this.utakmicaId)
      .subscribe((dataPreUpdate) => {
        let poeni = dataPreUpdate.poeni + 2;
        let dvaPoenaPogodak = dataPreUpdate.dvaPoenaPogodak + 1;
        let dvaPoenaProcenat =
          ((dataPreUpdate.dvaPoenaPogodak + 1) /
            (dataPreUpdate.dvaPoenaPogodak + 1 + dataPreUpdate.dvaPoenaPromasaj)) *
          100;
        let indeks = dataPreUpdate.indeks + 2;
        this.statistikaIgracaService
          .updateIgracStatistika(
            igrac,
            this.utakmicaId,
            poeni,
            dvaPoenaPogodak,
            dataPreUpdate.dvaPoenaPromasaj,
            dvaPoenaProcenat,
            dataPreUpdate.triPoenaPogodak,
            dataPreUpdate.triPoenaPromasaj,
            dataPreUpdate.triPoenaProcenat,
            dataPreUpdate.slobodnoPogodak,
            dataPreUpdate.slobodnoPromasaj,
            dataPreUpdate.slobodnoProcenat,
            dataPreUpdate.skokoviNapad,
            dataPreUpdate.skokoviOdbrana,
            dataPreUpdate.skokoviUkupno,
            dataPreUpdate.asistencije,
            dataPreUpdate.ukradene,
            dataPreUpdate.izgubljene,
            dataPreUpdate.blokade,
            dataPreUpdate.blokadePrimljene,
            dataPreUpdate.licneGreske,
            dataPreUpdate.iznudjeniFaulovi,
            indeks,
            dataPreUpdate.plusMinus,
          )
          .subscribe((data) => {
            if (data.message == 'ok') {
              this.statistikaIgracaService
                .getIgraciKlubUtakmica(this.utakmicaId, this.protivnik)
                .subscribe((dataProtivnicki) => {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.trener.klub)
                    .subscribe((dataNasi) => {
                      if (this.trener.klub == this.utakmica?.domacin) {
                        this.domaciIgraciStats = dataNasi;
                        this.gostujuciIgraciStats = dataProtivnicki;
                      } else {
                        this.domaciIgraciStats = dataProtivnicki;
                        this.gostujuciIgraciStats = dataNasi;
                      }
                      this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((game) => {
                        if (game.status == 'u toku') {
                          this.azurirajMinuteSvih();
                        }
                      });
                      if (this.updateIgrac.klub === this.utakmica?.domacin) {
                        this.poeniDomacin += 2;
                        this.utakmiceService
                          .updatePoeniUtakmicaDomacin(this.utakmicaId, this.poeniDomacin)
                          .subscribe((poeniUpdate) => {
                            if (poeniUpdate.message != 'ok') {
                              alert('Error');
                              return;
                            }
                          });
                        for (let i = 0; i < this.domaciIgraciStats.length; i++) {
                          if (this.domaciIgraciStats[i].teren) {
                            this.statistikaIgracaService
                              .getIgracUtakmica(this.domaciIgraciStats[i].id, this.utakmicaId)
                              .subscribe((igracPreUpdate) => {
                                this.statistikaIgracaService
                                  .updateIgracPlusMinus(
                                    igracPreUpdate.id,
                                    this.utakmicaId,
                                    igracPreUpdate.plusMinus + 2,
                                  )
                                  .subscribe((msg) => {});
                              });
                            this.domaciIgraciStats[i].plusMinus += 2;
                          }
                          if (i == 0) {
                            this.plusMinusUkupnoDomaci = 0;
                          }
                          this.plusMinusUkupnoDomaci += this.domaciIgraciStats[i].plusMinus;
                        }
                        for (let i = 0; i < this.gostujuciIgraciStats.length; i++) {
                          if (this.gostujuciIgraciStats[i].teren) {
                            this.statistikaIgracaService
                              .getIgracUtakmica(this.gostujuciIgraciStats[i].id, this.utakmicaId)
                              .subscribe((igracPreUpdate) => {
                                this.statistikaIgracaService
                                  .updateIgracPlusMinus(
                                    igracPreUpdate.id,
                                    this.utakmicaId,
                                    igracPreUpdate.plusMinus - 2,
                                  )
                                  .subscribe((msg) => {});
                              });
                            this.gostujuciIgraciStats[i].plusMinus -= 2;
                          }
                          if (i == 0) {
                            this.plusMinusUkupnoGosti = 0;
                          }
                          this.plusMinusUkupnoGosti += this.gostujuciIgraciStats[i].plusMinus;
                        }
                      } else if (this.updateIgrac.klub === this.utakmica?.gost) {
                        this.poeniGost += 2;
                        this.utakmiceService
                          .updatePoeniUtakmicaGost(this.utakmicaId, this.poeniGost)
                          .subscribe((poeniUpdate) => {
                            if (poeniUpdate.message != 'ok') {
                              alert('Error');
                              return;
                            }
                          });
                        for (let i = 0; i < this.gostujuciIgraciStats.length; i++) {
                          if (this.gostujuciIgraciStats[i].teren) {
                            this.statistikaIgracaService
                              .getIgracUtakmica(this.gostujuciIgraciStats[i].id, this.utakmicaId)
                              .subscribe((igracPreUpdate) => {
                                this.statistikaIgracaService
                                  .updateIgracPlusMinus(
                                    igracPreUpdate.id,
                                    this.utakmicaId,
                                    igracPreUpdate.plusMinus + 2,
                                  )
                                  .subscribe((msg) => {});
                              });
                            this.gostujuciIgraciStats[i].plusMinus += 2;
                          }
                          if (i == 0) {
                            this.plusMinusUkupnoGosti = 0;
                          }
                          this.plusMinusUkupnoGosti += this.gostujuciIgraciStats[i].plusMinus;
                        }
                        for (let i = 0; i < this.domaciIgraciStats.length; i++) {
                          if (this.domaciIgraciStats[i].teren) {
                            this.statistikaIgracaService
                              .getIgracUtakmica(this.domaciIgraciStats[i].id, this.utakmicaId)
                              .subscribe((igracPreUpdate) => {
                                this.statistikaIgracaService
                                  .updateIgracPlusMinus(
                                    igracPreUpdate.id,
                                    this.utakmicaId,
                                    igracPreUpdate.plusMinus - 2,
                                  )
                                  .subscribe((msg) => {});
                              });
                            this.domaciIgraciStats[i].plusMinus -= 2;
                          }
                          if (i == 0) {
                            this.plusMinusUkupnoDomaci = 0;
                          }
                          this.plusMinusUkupnoDomaci += this.domaciIgraciStats[i].plusMinus;
                        }
                      }
                      this.statistikaIgracaService
                        .getIgracUtakmica(igrac, this.utakmicaId)
                        .subscribe((dataIgrac) => {
                          this.utakmicaDogadjajiService
                            .addDogadjaj(
                              this.utakmicaId,
                              this.domacin,
                              this.gost,
                              this.tajmerVreme(),
                              this.cetvrtina,
                              this.poeniDomacin,
                              this.poeniGost,
                              '2FG Made',
                              dataPreUpdate.klub,
                              dataPreUpdate.ime,
                              dataPreUpdate.prezime,
                              dataPreUpdate.broj,
                              dataIgrac,
                            )
                            .subscribe((data) => {
                              this.utakmicaDogadjajiService
                                .getAllDogadjaji(this.utakmicaId)
                                .subscribe((allDogadjaji) => {
                                  for (let i = 0; i < allDogadjaji.length; i++) {
                                    if (allDogadjaji[i].cetvrtina == 1) {
                                      if (
                                        !this.dogadjajiPrvaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiPrvaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiPrvaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;
                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 2) {
                                      if (
                                        !this.dogadjajiDrugaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiDrugaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiDrugaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 3) {
                                      if (
                                        !this.dogadjajiTrecaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiTrecaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiTrecaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 4) {
                                      if (
                                        !this.dogadjajiCetvrtaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiCetvrtaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiCetvrtaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina > 4) {
                                      if (
                                        !this.dogadjajiProduzetak.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiProduzetak.push(allDogadjaji[i]);
                                        this.dogadjajiProduzetak.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;
                                          if (a.cetvrtina !== b.cetvrtina) {
                                            return b.cetvrtina - a.cetvrtina;
                                          }
                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    }
                                  }
                                });
                            });
                        });
                    });
                });
            } else {
              alert('error');
            }
          });
        if (dataPreUpdate.klub == this.utakmica?.domacin) {
          this.dvaPoenaPogodakUkupnoDomaci++;
          this.indeksUkupnoDomaci += 2;
          this.poeniUkupnoDomaci += 2;
          this.dvaPoenaProcenatUkupnoDomaci =
            (this.dvaPoenaPogodakUkupnoDomaci /
              (this.dvaPoenaPogodakUkupnoDomaci + this.dvaPoenaPromasajUkupnoDomaci)) *
            100;
        } else if (dataPreUpdate.klub == this.utakmica?.gost) {
          this.dvaPoenaPogodakUkupnoGosti++;
          this.indeksUkupnoGosti += 2;
          this.poeniUkupnoGosti += 2;
          this.dvaPoenaProcenatUkupnoGosti =
            (this.dvaPoenaPogodakUkupnoGosti /
              (this.dvaPoenaPogodakUkupnoGosti + this.dvaPoenaPromasajUkupnoGosti)) *
            100;
        }
      });
  }
  dvaPoenaPromasaj(igrac: string) {
    this.statistikaIgracaService
      .getIgracUtakmica(igrac, this.utakmicaId)
      .subscribe((dataPreUpdate) => {
        let dvaPoenaPromasaj = dataPreUpdate.dvaPoenaPromasaj + 1;
        let dvaPoenaProcenat =
          (dataPreUpdate.dvaPoenaPogodak /
            (dataPreUpdate.dvaPoenaPogodak + 1 + dataPreUpdate.dvaPoenaPromasaj)) *
          100;
        let indeks = dataPreUpdate.indeks - 1;
        this.statistikaIgracaService
          .updateIgracStatistika(
            igrac,
            this.utakmicaId,
            dataPreUpdate.poeni,
            dataPreUpdate.dvaPoenaPogodak,
            dvaPoenaPromasaj,
            dvaPoenaProcenat,
            dataPreUpdate.triPoenaPogodak,
            dataPreUpdate.triPoenaPromasaj,
            dataPreUpdate.triPoenaProcenat,
            dataPreUpdate.slobodnoPogodak,
            dataPreUpdate.slobodnoPromasaj,
            dataPreUpdate.slobodnoProcenat,
            dataPreUpdate.skokoviNapad,
            dataPreUpdate.skokoviOdbrana,
            dataPreUpdate.skokoviUkupno,
            dataPreUpdate.asistencije,
            dataPreUpdate.ukradene,
            dataPreUpdate.izgubljene,
            dataPreUpdate.blokade,
            dataPreUpdate.blokadePrimljene,
            dataPreUpdate.licneGreske,
            dataPreUpdate.iznudjeniFaulovi,
            indeks,
            dataPreUpdate.plusMinus,
          )
          .subscribe((data) => {
            if (data.message == 'ok') {
              this.statistikaIgracaService
                .getIgraciKlubUtakmica(this.utakmicaId, this.protivnik)
                .subscribe((dataProtivnicki) => {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.trener.klub)
                    .subscribe((dataNasi) => {
                      if (this.trener.klub == this.utakmica?.domacin) {
                        this.domaciIgraciStats = dataNasi;
                        this.gostujuciIgraciStats = dataProtivnicki;
                      } else {
                        this.domaciIgraciStats = dataProtivnicki;
                        this.gostujuciIgraciStats = dataNasi;
                      }
                      this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((game) => {
                        if (game.status == 'u toku') {
                          this.azurirajMinuteSvih();
                        }
                      });
                      this.statistikaIgracaService
                        .getIgracUtakmica(igrac, this.utakmicaId)
                        .subscribe((dataIgrac) => {
                          this.utakmicaDogadjajiService
                            .addDogadjaj(
                              this.utakmicaId,
                              this.domacin,
                              this.gost,
                              this.tajmerVreme(),
                              this.cetvrtina,
                              this.poeniDomacin,
                              this.poeniGost,
                              '2FG Miss',
                              dataPreUpdate.klub,
                              dataPreUpdate.ime,
                              dataPreUpdate.prezime,
                              dataPreUpdate.broj,
                              dataIgrac,
                            )
                            .subscribe((data) => {
                              this.utakmicaDogadjajiService
                                .getAllDogadjaji(this.utakmicaId)
                                .subscribe((allDogadjaji) => {
                                  for (let i = 0; i < allDogadjaji.length; i++) {
                                    if (allDogadjaji[i].cetvrtina == 1) {
                                      if (
                                        !this.dogadjajiPrvaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiPrvaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiPrvaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 2) {
                                      if (
                                        !this.dogadjajiDrugaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiDrugaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiDrugaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 3) {
                                      if (
                                        !this.dogadjajiTrecaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiTrecaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiTrecaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 4) {
                                      if (
                                        !this.dogadjajiCetvrtaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiCetvrtaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiCetvrtaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina > 4) {
                                      if (
                                        !this.dogadjajiProduzetak.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiProduzetak.push(allDogadjaji[i]);
                                        this.dogadjajiProduzetak.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;
                                          if (a.cetvrtina !== b.cetvrtina) {
                                            return b.cetvrtina - a.cetvrtina;
                                          }
                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    }
                                  }
                                });
                            });
                        });
                    });
                });
            } else {
              alert('error');
            }
          });
        if (dataPreUpdate.klub == this.utakmica?.domacin) {
          this.dvaPoenaPromasajUkupnoDomaci++;
          this.indeksUkupnoDomaci--;
          this.dvaPoenaProcenatUkupnoDomaci =
            (this.dvaPoenaPogodakUkupnoDomaci /
              (this.dvaPoenaPogodakUkupnoDomaci + this.dvaPoenaPromasajUkupnoDomaci)) *
            100;
        } else if (dataPreUpdate.klub == this.utakmica?.gost) {
          this.dvaPoenaPromasajUkupnoGosti++;
          this.indeksUkupnoGosti--;
          this.dvaPoenaProcenatUkupnoGosti =
            (this.dvaPoenaPogodakUkupnoGosti /
              (this.dvaPoenaPogodakUkupnoGosti + this.dvaPoenaPromasajUkupnoGosti)) *
            100;
        }
      });
  }
  triPoenaPogodak(igrac: string) {
    this.shotReset(24);
    this.statistikaIgracaService
      .getIgracUtakmica(igrac, this.utakmicaId)
      .subscribe((dataPreUpdate) => {
        let poeni = dataPreUpdate.poeni + 3;
        let triPoenaPogodak = dataPreUpdate.triPoenaPogodak + 1;
        let triPoenaProcenat =
          ((dataPreUpdate.triPoenaPogodak + 1) /
            (dataPreUpdate.triPoenaPogodak + 1 + dataPreUpdate.triPoenaPromasaj)) *
          100;
        let indeks = dataPreUpdate.indeks + 3;
        this.statistikaIgracaService
          .updateIgracStatistika(
            igrac,
            this.utakmicaId,
            poeni,
            dataPreUpdate.dvaPoenaPogodak,
            dataPreUpdate.dvaPoenaPromasaj,
            dataPreUpdate.dvaPoenaProcenat,
            triPoenaPogodak,
            dataPreUpdate.triPoenaPromasaj,
            triPoenaProcenat,
            dataPreUpdate.slobodnoPogodak,
            dataPreUpdate.slobodnoPromasaj,
            dataPreUpdate.slobodnoProcenat,
            dataPreUpdate.skokoviNapad,
            dataPreUpdate.skokoviOdbrana,
            dataPreUpdate.skokoviUkupno,
            dataPreUpdate.asistencije,
            dataPreUpdate.ukradene,
            dataPreUpdate.izgubljene,
            dataPreUpdate.blokade,
            dataPreUpdate.blokadePrimljene,
            dataPreUpdate.licneGreske,
            dataPreUpdate.iznudjeniFaulovi,
            indeks,
            dataPreUpdate.plusMinus,
          )
          .subscribe((data) => {
            if (data.message == 'ok') {
              this.statistikaIgracaService
                .getIgraciKlubUtakmica(this.utakmicaId, this.protivnik)
                .subscribe((dataProtivnicki) => {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.trener.klub)
                    .subscribe((dataNasi) => {
                      if (this.trener.klub == this.utakmica?.domacin) {
                        this.domaciIgraciStats = dataNasi;
                        this.gostujuciIgraciStats = dataProtivnicki;
                      } else {
                        this.domaciIgraciStats = dataProtivnicki;
                        this.gostujuciIgraciStats = dataNasi;
                      }
                      this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((game) => {
                        if (game.status == 'u toku') {
                          this.azurirajMinuteSvih();
                        }
                      });
                      if (this.updateIgrac.klub === this.utakmica?.domacin) {
                        this.poeniDomacin += 3;
                        this.utakmiceService
                          .updatePoeniUtakmicaDomacin(this.utakmicaId, this.poeniDomacin)
                          .subscribe((poeniUpdate) => {
                            if (poeniUpdate.message != 'ok') {
                              alert('Error');
                              return;
                            }
                          });

                        for (let i = 0; i < this.domaciIgraciStats.length; i++) {
                          if (this.domaciIgraciStats[i].teren) {
                            this.statistikaIgracaService
                              .getIgracUtakmica(this.domaciIgraciStats[i].id, this.utakmicaId)
                              .subscribe((igracPreUpdate) => {
                                this.statistikaIgracaService
                                  .updateIgracPlusMinus(
                                    igracPreUpdate.id,
                                    this.utakmicaId,
                                    igracPreUpdate.plusMinus + 3,
                                  )
                                  .subscribe((msg) => {});
                              });
                            this.domaciIgraciStats[i].plusMinus += 3;
                          }
                          if (i == 0) {
                            this.plusMinusUkupnoDomaci = 0;
                          }
                          this.plusMinusUkupnoDomaci += this.domaciIgraciStats[i].plusMinus;
                        }
                        for (let i = 0; i < this.gostujuciIgraciStats.length; i++) {
                          if (this.gostujuciIgraciStats[i].teren) {
                            this.statistikaIgracaService
                              .getIgracUtakmica(this.gostujuciIgraciStats[i].id, this.utakmicaId)
                              .subscribe((igracPreUpdate) => {
                                this.statistikaIgracaService
                                  .updateIgracPlusMinus(
                                    igracPreUpdate.id,
                                    this.utakmicaId,
                                    igracPreUpdate.plusMinus - 3,
                                  )
                                  .subscribe((msg) => {});
                              });
                            this.gostujuciIgraciStats[i].plusMinus -= 3;
                          }
                          if (i == 0) {
                            this.plusMinusUkupnoGosti = 0;
                          }
                          this.plusMinusUkupnoGosti += this.gostujuciIgraciStats[i].plusMinus;
                        }
                      } else if (this.updateIgrac.klub === this.utakmica?.gost) {
                        this.poeniGost += 3;
                        this.utakmiceService
                          .updatePoeniUtakmicaGost(this.utakmicaId, this.poeniGost)
                          .subscribe((poeniUpdate) => {
                            if (poeniUpdate.message != 'ok') {
                              alert('Error');
                              return;
                            }
                          });
                        for (let i = 0; i < this.gostujuciIgraciStats.length; i++) {
                          if (this.gostujuciIgraciStats[i].teren) {
                            this.statistikaIgracaService
                              .getIgracUtakmica(this.gostujuciIgraciStats[i].id, this.utakmicaId)
                              .subscribe((igracPreUpdate) => {
                                this.statistikaIgracaService
                                  .updateIgracPlusMinus(
                                    igracPreUpdate.id,
                                    this.utakmicaId,
                                    igracPreUpdate.plusMinus + 3,
                                  )
                                  .subscribe((msg) => {});
                              });
                            this.gostujuciIgraciStats[i].plusMinus += 3;
                          }
                          if (i == 0) {
                            this.plusMinusUkupnoGosti = 0;
                          }
                          this.plusMinusUkupnoGosti += this.gostujuciIgraciStats[i].plusMinus;
                        }
                        for (let i = 0; i < this.domaciIgraciStats.length; i++) {
                          if (this.domaciIgraciStats[i].teren) {
                            this.statistikaIgracaService
                              .getIgracUtakmica(this.domaciIgraciStats[i].id, this.utakmicaId)
                              .subscribe((igracPreUpdate) => {
                                this.statistikaIgracaService
                                  .updateIgracPlusMinus(
                                    igracPreUpdate.id,
                                    this.utakmicaId,
                                    igracPreUpdate.plusMinus - 3,
                                  )
                                  .subscribe((msg) => {});
                              });
                            this.domaciIgraciStats[i].plusMinus -= 3;
                          }
                          if (i == 0) {
                            this.plusMinusUkupnoDomaci = 0;
                          }
                          this.plusMinusUkupnoDomaci += this.domaciIgraciStats[i].plusMinus;
                        }
                      }
                      this.statistikaIgracaService
                        .getIgracUtakmica(igrac, this.utakmicaId)
                        .subscribe((dataIgrac) => {
                          this.utakmicaDogadjajiService
                            .addDogadjaj(
                              this.utakmicaId,
                              this.domacin,
                              this.gost,
                              this.tajmerVreme(),
                              this.cetvrtina,
                              this.poeniDomacin,
                              this.poeniGost,
                              '3FG Made',
                              dataPreUpdate.klub,
                              dataPreUpdate.ime,
                              dataPreUpdate.prezime,
                              dataPreUpdate.broj,
                              dataIgrac,
                            )
                            .subscribe((data) => {
                              this.utakmicaDogadjajiService
                                .getAllDogadjaji(this.utakmicaId)
                                .subscribe((allDogadjaji) => {
                                  for (let i = 0; i < allDogadjaji.length; i++) {
                                    if (allDogadjaji[i].cetvrtina == 1) {
                                      if (
                                        !this.dogadjajiPrvaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiPrvaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiPrvaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 2) {
                                      if (
                                        !this.dogadjajiDrugaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiDrugaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiDrugaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 3) {
                                      if (
                                        !this.dogadjajiTrecaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiTrecaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiTrecaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 4) {
                                      if (
                                        !this.dogadjajiCetvrtaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiCetvrtaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiCetvrtaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina > 4) {
                                      if (
                                        !this.dogadjajiProduzetak.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiProduzetak.push(allDogadjaji[i]);
                                        this.dogadjajiProduzetak.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;
                                          if (a.cetvrtina !== b.cetvrtina) {
                                            return b.cetvrtina - a.cetvrtina;
                                          }
                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    }
                                  }
                                });
                            });
                        });
                    });
                });
            } else {
              alert('error');
            }
          });
        if (dataPreUpdate.klub == this.utakmica?.domacin) {
          this.triPoenaPogodakUkupnoDomaci++;
          this.indeksUkupnoDomaci += 3;
          this.poeniUkupnoDomaci += 3;
          this.triPoenaProcenatUkupnoDomaci =
            (this.triPoenaPogodakUkupnoDomaci /
              (this.triPoenaPogodakUkupnoDomaci + this.triPoenaPromasajUkupnoDomaci)) *
            100;
        } else if (dataPreUpdate.klub == this.utakmica?.gost) {
          this.triPoenaPogodakUkupnoGosti++;
          this.indeksUkupnoGosti += 3;
          this.poeniUkupnoGosti += 3;
          this.triPoenaProcenatUkupnoGosti =
            (this.triPoenaPogodakUkupnoGosti /
              (this.triPoenaPogodakUkupnoGosti + this.triPoenaPromasajUkupnoGosti)) *
            100;
        }
      });
  }
  triPoenaPromasaj(igrac: string) {
    this.statistikaIgracaService
      .getIgracUtakmica(igrac, this.utakmicaId)
      .subscribe((dataPreUpdate) => {
        let triPoenaPromasaj = dataPreUpdate.triPoenaPromasaj + 1;
        let triPoenaProcenat =
          (dataPreUpdate.triPoenaPogodak /
            (dataPreUpdate.triPoenaPogodak + 1 + dataPreUpdate.triPoenaPromasaj)) *
          100;
        let indeks = dataPreUpdate.indeks - 1;
        this.statistikaIgracaService
          .updateIgracStatistika(
            igrac,
            this.utakmicaId,
            dataPreUpdate.poeni,
            dataPreUpdate.dvaPoenaPogodak,
            dataPreUpdate.dvaPoenaPromasaj,
            dataPreUpdate.dvaPoenaProcenat,
            dataPreUpdate.triPoenaPogodak,
            triPoenaPromasaj,
            triPoenaProcenat,
            dataPreUpdate.slobodnoPogodak,
            dataPreUpdate.slobodnoPromasaj,
            dataPreUpdate.slobodnoProcenat,
            dataPreUpdate.skokoviNapad,
            dataPreUpdate.skokoviOdbrana,
            dataPreUpdate.skokoviUkupno,
            dataPreUpdate.asistencije,
            dataPreUpdate.ukradene,
            dataPreUpdate.izgubljene,
            dataPreUpdate.blokade,
            dataPreUpdate.blokadePrimljene,
            dataPreUpdate.licneGreske,
            dataPreUpdate.iznudjeniFaulovi,
            indeks,
            dataPreUpdate.plusMinus,
          )
          .subscribe((data) => {
            if (data.message == 'ok') {
              this.statistikaIgracaService
                .getIgraciKlubUtakmica(this.utakmicaId, this.protivnik)
                .subscribe((dataProtivnicki) => {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.trener.klub)
                    .subscribe((dataNasi) => {
                      if (this.trener.klub == this.utakmica?.domacin) {
                        this.domaciIgraciStats = dataNasi;
                        this.gostujuciIgraciStats = dataProtivnicki;
                      } else {
                        this.domaciIgraciStats = dataProtivnicki;
                        this.gostujuciIgraciStats = dataNasi;
                      }
                      this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((game) => {
                        if (game.status == 'u toku') {
                          this.azurirajMinuteSvih();
                        }
                      });
                      this.statistikaIgracaService
                        .getIgracUtakmica(igrac, this.utakmicaId)
                        .subscribe((dataIgrac) => {
                          this.utakmicaDogadjajiService
                            .addDogadjaj(
                              this.utakmicaId,
                              this.domacin,
                              this.gost,
                              this.tajmerVreme(),
                              this.cetvrtina,
                              this.poeniDomacin,
                              this.poeniGost,
                              '3FG Miss',
                              dataPreUpdate.klub,
                              dataPreUpdate.ime,
                              dataPreUpdate.prezime,
                              dataPreUpdate.broj,
                              dataIgrac,
                            )
                            .subscribe((data) => {
                              this.utakmicaDogadjajiService
                                .getAllDogadjaji(this.utakmicaId)
                                .subscribe((allDogadjaji) => {
                                  for (let i = 0; i < allDogadjaji.length; i++) {
                                    if (allDogadjaji[i].cetvrtina == 1) {
                                      if (
                                        !this.dogadjajiPrvaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiPrvaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiPrvaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 2) {
                                      if (
                                        !this.dogadjajiDrugaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiDrugaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiDrugaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 3) {
                                      if (
                                        !this.dogadjajiTrecaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiTrecaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiTrecaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 4) {
                                      if (
                                        !this.dogadjajiCetvrtaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiCetvrtaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiCetvrtaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina > 4) {
                                      if (
                                        !this.dogadjajiProduzetak.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiProduzetak.push(allDogadjaji[i]);
                                        this.dogadjajiProduzetak.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;
                                          if (a.cetvrtina !== b.cetvrtina) {
                                            return b.cetvrtina - a.cetvrtina;
                                          }
                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    }
                                  }
                                });
                            });
                        });
                    });
                });
            } else {
              alert('error');
            }
          });
        if (dataPreUpdate.klub == this.utakmica?.domacin) {
          this.triPoenaPromasajUkupnoDomaci++;
          this.indeksUkupnoDomaci--;
          this.triPoenaProcenatUkupnoDomaci =
            (this.triPoenaPogodakUkupnoDomaci /
              (this.triPoenaPogodakUkupnoDomaci + this.triPoenaPromasajUkupnoDomaci)) *
            100;
        } else if (dataPreUpdate.klub == this.utakmica?.gost) {
          this.triPoenaPromasajUkupnoGosti++;
          this.indeksUkupnoGosti--;
          this.triPoenaProcenatUkupnoGosti =
            (this.triPoenaPogodakUkupnoGosti /
              (this.triPoenaPogodakUkupnoGosti + this.triPoenaPromasajUkupnoGosti)) *
            100;
        }
      });
  }
  slobodnoBacanjePogodak(igrac: string) {
    this.statistikaIgracaService
      .getIgracUtakmica(igrac, this.utakmicaId)
      .subscribe((dataPreUpdate) => {
        let poeni = dataPreUpdate.poeni + 1;
        let slobodnoPogodak = dataPreUpdate.slobodnoPogodak + 1;
        let slobodnoProcenat =
          ((dataPreUpdate.slobodnoPogodak + 1) /
            (dataPreUpdate.slobodnoPogodak + 1 + dataPreUpdate.slobodnoPromasaj)) *
          100;
        let indeks = dataPreUpdate.indeks + 1;
        this.statistikaIgracaService
          .updateIgracStatistika(
            igrac,
            this.utakmicaId,
            poeni,
            dataPreUpdate.dvaPoenaPogodak,
            dataPreUpdate.dvaPoenaPromasaj,
            dataPreUpdate.dvaPoenaProcenat,
            dataPreUpdate.triPoenaPogodak,
            dataPreUpdate.triPoenaPromasaj,
            dataPreUpdate.triPoenaProcenat,
            slobodnoPogodak,
            dataPreUpdate.slobodnoPromasaj,
            slobodnoProcenat,
            dataPreUpdate.skokoviNapad,
            dataPreUpdate.skokoviOdbrana,
            dataPreUpdate.skokoviUkupno,
            dataPreUpdate.asistencije,
            dataPreUpdate.ukradene,
            dataPreUpdate.izgubljene,
            dataPreUpdate.blokade,
            dataPreUpdate.blokadePrimljene,
            dataPreUpdate.licneGreske,
            dataPreUpdate.iznudjeniFaulovi,
            indeks,
            dataPreUpdate.plusMinus,
          )
          .subscribe((data) => {
            if (data.message == 'ok') {
              this.statistikaIgracaService
                .getIgraciKlubUtakmica(this.utakmicaId, this.protivnik)
                .subscribe((dataProtivnicki) => {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.trener.klub)
                    .subscribe((dataNasi) => {
                      if (this.trener.klub == this.utakmica?.domacin) {
                        this.domaciIgraciStats = dataNasi;
                        this.gostujuciIgraciStats = dataProtivnicki;
                      } else {
                        this.domaciIgraciStats = dataProtivnicki;
                        this.gostujuciIgraciStats = dataNasi;
                      }
                      this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((game) => {
                        if (game.status == 'u toku') {
                          this.azurirajMinuteSvih();
                        }
                      });
                      if (this.updateIgrac.klub === this.utakmica?.domacin) {
                        this.poeniDomacin += 1;
                        this.utakmiceService
                          .updatePoeniUtakmicaDomacin(this.utakmicaId, this.poeniDomacin)
                          .subscribe((poeniUpdate) => {
                            if (poeniUpdate.message != 'ok') {
                              alert('Error');
                              return;
                            }
                          });
                        for (let i = 0; i < this.domaciIgraciStats.length; i++) {
                          if (this.domaciIgraciStats[i].teren) {
                            this.statistikaIgracaService
                              .getIgracUtakmica(this.domaciIgraciStats[i].id, this.utakmicaId)
                              .subscribe((igracPreUpdate) => {
                                this.statistikaIgracaService
                                  .updateIgracPlusMinus(
                                    igracPreUpdate.id,
                                    this.utakmicaId,
                                    igracPreUpdate.plusMinus + 1,
                                  )
                                  .subscribe((msg) => {});
                              });
                            this.domaciIgraciStats[i].plusMinus++;
                          }
                          if (i == 0) {
                            this.plusMinusUkupnoDomaci = 0;
                          }
                          this.plusMinusUkupnoDomaci += this.domaciIgraciStats[i].plusMinus;
                        }

                        for (let i = 0; i < this.gostujuciIgraciStats.length; i++) {
                          if (this.gostujuciIgraciStats[i].teren) {
                            this.statistikaIgracaService
                              .getIgracUtakmica(this.gostujuciIgraciStats[i].id, this.utakmicaId)
                              .subscribe((igracPreUpdate) => {
                                this.statistikaIgracaService
                                  .updateIgracPlusMinus(
                                    igracPreUpdate.id,
                                    this.utakmicaId,
                                    igracPreUpdate.plusMinus - 1,
                                  )
                                  .subscribe((msg) => {});
                              });
                            this.gostujuciIgraciStats[i].plusMinus--;
                          }
                          if (i == 0) {
                            this.plusMinusUkupnoGosti = 0;
                          }
                          this.plusMinusUkupnoGosti += this.gostujuciIgraciStats[i].plusMinus;
                        }
                      } else if (this.updateIgrac.klub === this.utakmica?.gost) {
                        this.poeniGost += 1;
                        this.utakmiceService
                          .updatePoeniUtakmicaGost(this.utakmicaId, this.poeniGost)
                          .subscribe((poeniUpdate) => {
                            if (poeniUpdate.message != 'ok') {
                              alert('Error');
                              return;
                            }
                          });
                        for (let i = 0; i < this.gostujuciIgraciStats.length; i++) {
                          if (this.gostujuciIgraciStats[i].teren) {
                            this.statistikaIgracaService
                              .getIgracUtakmica(this.gostujuciIgraciStats[i].id, this.utakmicaId)
                              .subscribe((igracPreUpdate) => {
                                this.statistikaIgracaService
                                  .updateIgracPlusMinus(
                                    igracPreUpdate.id,
                                    this.utakmicaId,
                                    igracPreUpdate.plusMinus + 1,
                                  )
                                  .subscribe((msg) => {});
                              });
                            this.gostujuciIgraciStats[i].plusMinus++;
                          }
                          if (i == 0) {
                            this.plusMinusUkupnoGosti = 0;
                          }
                          this.plusMinusUkupnoGosti += this.gostujuciIgraciStats[i].plusMinus;
                        }

                        for (let i = 0; i < this.domaciIgraciStats.length; i++) {
                          if (this.domaciIgraciStats[i].teren) {
                            this.statistikaIgracaService
                              .getIgracUtakmica(this.domaciIgraciStats[i].id, this.utakmicaId)
                              .subscribe((igracPreUpdate) => {
                                this.statistikaIgracaService
                                  .updateIgracPlusMinus(
                                    igracPreUpdate.id,
                                    this.utakmicaId,
                                    igracPreUpdate.plusMinus - 1,
                                  )
                                  .subscribe((msg) => {});
                              });
                            this.domaciIgraciStats[i].plusMinus++;
                          }
                          if (i == 0) {
                            this.plusMinusUkupnoDomaci = 0;
                          }
                          this.plusMinusUkupnoDomaci += this.domaciIgraciStats[i].plusMinus;
                        }
                      }
                      this.statistikaIgracaService
                        .getIgracUtakmica(igrac, this.utakmicaId)
                        .subscribe((dataIgrac) => {
                          this.utakmicaDogadjajiService
                            .addDogadjaj(
                              this.utakmicaId,
                              this.domacin,
                              this.gost,
                              this.tajmerVreme(),
                              this.cetvrtina,
                              this.poeniDomacin,
                              this.poeniGost,
                              'FT Made',
                              dataPreUpdate.klub,
                              dataPreUpdate.ime,
                              dataPreUpdate.prezime,
                              dataPreUpdate.broj,
                              dataIgrac,
                            )
                            .subscribe((data) => {
                              this.utakmicaDogadjajiService
                                .getAllDogadjaji(this.utakmicaId)
                                .subscribe((allDogadjaji) => {
                                  for (let i = 0; i < allDogadjaji.length; i++) {
                                    if (allDogadjaji[i].cetvrtina == 1) {
                                      if (
                                        !this.dogadjajiPrvaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiPrvaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiPrvaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 2) {
                                      if (
                                        !this.dogadjajiDrugaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiDrugaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiDrugaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 3) {
                                      if (
                                        !this.dogadjajiTrecaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiTrecaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiTrecaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 4) {
                                      if (
                                        !this.dogadjajiCetvrtaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiCetvrtaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiCetvrtaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina > 4) {
                                      if (
                                        !this.dogadjajiProduzetak.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiProduzetak.push(allDogadjaji[i]);
                                        this.dogadjajiProduzetak.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;
                                          if (a.cetvrtina !== b.cetvrtina) {
                                            return b.cetvrtina - a.cetvrtina;
                                          }
                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    }
                                  }
                                });
                            });
                        });
                    });
                });
            } else {
              alert('error');
            }
          });
        if (dataPreUpdate.klub == this.utakmica?.domacin) {
          this.slobodnoPogodakUkupnoDomaci++;
          this.indeksUkupnoDomaci++;
          this.poeniUkupnoDomaci++;
          this.slobodnoProcenatUkupnoDomaci =
            (this.slobodnoPogodakUkupnoDomaci /
              (this.slobodnoPogodakUkupnoDomaci + this.slobodnoPromasajUkupnoDomaci)) *
            100;
        } else if (dataPreUpdate.klub == this.utakmica?.gost) {
          this.slobodnoPogodakUkupnoGosti++;
          this.indeksUkupnoGosti++;
          this.poeniUkupnoGosti++;
          this.slobodnoProcenatUkupnoGosti =
            (this.slobodnoPogodakUkupnoGosti /
              (this.slobodnoPogodakUkupnoGosti + this.slobodnoPromasajUkupnoGosti)) *
            100;
        }
      });
  }
  slobodnoBacanjePromasaj(igrac: string) {
    this.statistikaIgracaService
      .getIgracUtakmica(igrac, this.utakmicaId)
      .subscribe((dataPreUpdate) => {
        let slobodnoPromasaj = dataPreUpdate.slobodnoPromasaj + 1;
        let slobodnoProcenat =
          (dataPreUpdate.slobodnoPogodak /
            (dataPreUpdate.slobodnoPogodak + 1 + dataPreUpdate.slobodnoPromasaj)) *
          100;
        let indeks = dataPreUpdate.indeks - 1;
        this.statistikaIgracaService
          .updateIgracStatistika(
            igrac,
            this.utakmicaId,
            dataPreUpdate.poeni,
            dataPreUpdate.dvaPoenaPogodak,
            dataPreUpdate.dvaPoenaPromasaj,
            dataPreUpdate.dvaPoenaProcenat,
            dataPreUpdate.triPoenaPogodak,
            dataPreUpdate.triPoenaPromasaj,
            dataPreUpdate.triPoenaProcenat,
            dataPreUpdate.slobodnoPogodak,
            slobodnoPromasaj,
            slobodnoProcenat,
            dataPreUpdate.skokoviNapad,
            dataPreUpdate.skokoviOdbrana,
            dataPreUpdate.skokoviUkupno,
            dataPreUpdate.asistencije,
            dataPreUpdate.ukradene,
            dataPreUpdate.izgubljene,
            dataPreUpdate.blokade,
            dataPreUpdate.blokadePrimljene,
            dataPreUpdate.licneGreske,
            dataPreUpdate.iznudjeniFaulovi,
            indeks,
            dataPreUpdate.plusMinus,
          )
          .subscribe((data) => {
            if (data.message == 'ok') {
              this.statistikaIgracaService
                .getIgraciKlubUtakmica(this.utakmicaId, this.protivnik)
                .subscribe((dataProtivnicki) => {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.trener.klub)
                    .subscribe((dataNasi) => {
                      if (this.trener.klub == this.utakmica?.domacin) {
                        this.domaciIgraciStats = dataNasi;
                        this.gostujuciIgraciStats = dataProtivnicki;
                      } else {
                        this.domaciIgraciStats = dataProtivnicki;
                        this.gostujuciIgraciStats = dataNasi;
                      }
                      this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((game) => {
                        if (game.status == 'u toku') {
                          this.azurirajMinuteSvih();
                        }
                      });
                      this.statistikaIgracaService
                        .getIgracUtakmica(igrac, this.utakmicaId)
                        .subscribe((dataIgrac) => {
                          this.utakmicaDogadjajiService
                            .addDogadjaj(
                              this.utakmicaId,
                              this.domacin,
                              this.gost,
                              this.tajmerVreme(),
                              this.cetvrtina,
                              this.poeniDomacin,
                              this.poeniGost,
                              'FT Miss',
                              dataPreUpdate.klub,
                              dataPreUpdate.ime,
                              dataPreUpdate.prezime,
                              dataPreUpdate.broj,
                              dataIgrac,
                            )
                            .subscribe((data) => {
                              this.utakmicaDogadjajiService
                                .getAllDogadjaji(this.utakmicaId)
                                .subscribe((allDogadjaji) => {
                                  for (let i = 0; i < allDogadjaji.length; i++) {
                                    if (allDogadjaji[i].cetvrtina == 1) {
                                      if (
                                        !this.dogadjajiPrvaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiPrvaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiPrvaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 2) {
                                      if (
                                        !this.dogadjajiDrugaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiDrugaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiDrugaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 3) {
                                      if (
                                        !this.dogadjajiTrecaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiTrecaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiTrecaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 4) {
                                      if (
                                        !this.dogadjajiCetvrtaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiCetvrtaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiCetvrtaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina > 4) {
                                      if (
                                        !this.dogadjajiProduzetak.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiProduzetak.push(allDogadjaji[i]);
                                        this.dogadjajiProduzetak.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;
                                          if (a.cetvrtina !== b.cetvrtina) {
                                            return b.cetvrtina - a.cetvrtina;
                                          }
                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    }
                                  }
                                });
                            });
                        });
                    });
                });
            } else {
              alert('error');
            }
          });
        if (dataPreUpdate.klub == this.utakmica?.domacin) {
          this.slobodnoPromasajUkupnoDomaci++;
          this.indeksUkupnoDomaci--;
          this.slobodnoProcenatUkupnoDomaci =
            (this.slobodnoPogodakUkupnoDomaci /
              (this.slobodnoPogodakUkupnoDomaci + this.slobodnoPromasajUkupnoDomaci)) *
            100;
        } else if (dataPreUpdate.klub == this.utakmica?.gost) {
          this.slobodnoPromasajUkupnoGosti++;
          this.indeksUkupnoGosti--;
          this.slobodnoProcenatUkupnoGosti =
            (this.slobodnoPogodakUkupnoGosti /
              (this.slobodnoPogodakUkupnoGosti + this.slobodnoPromasajUkupnoGosti)) *
            100;
        }
      });
  }
  skokNapad(igrac: string) {
    if (this.shotVreme() < 14) {
      this.shotReset(14);
    }
    this.statistikaIgracaService
      .getIgracUtakmica(igrac, this.utakmicaId)
      .subscribe((dataPreUpdate) => {
        let skokoviNapad = dataPreUpdate.skokoviNapad + 1;
        let skokoviUkupno = dataPreUpdate.skokoviUkupno + 1;
        let indeks = dataPreUpdate.indeks + 1;
        this.statistikaIgracaService
          .updateIgracStatistika(
            igrac,
            this.utakmicaId,
            dataPreUpdate.poeni,
            dataPreUpdate.dvaPoenaPogodak,
            dataPreUpdate.dvaPoenaPromasaj,
            dataPreUpdate.dvaPoenaProcenat,
            dataPreUpdate.triPoenaPogodak,
            dataPreUpdate.triPoenaPromasaj,
            dataPreUpdate.triPoenaProcenat,
            dataPreUpdate.slobodnoPogodak,
            dataPreUpdate.slobodnoPromasaj,
            dataPreUpdate.slobodnoProcenat,
            skokoviNapad,
            dataPreUpdate.skokoviOdbrana,
            skokoviUkupno,
            dataPreUpdate.asistencije,
            dataPreUpdate.ukradene,
            dataPreUpdate.izgubljene,
            dataPreUpdate.blokade,
            dataPreUpdate.blokadePrimljene,
            dataPreUpdate.licneGreske,
            dataPreUpdate.iznudjeniFaulovi,
            indeks,
            dataPreUpdate.plusMinus,
          )
          .subscribe((data) => {
            if (data.message == 'ok') {
              this.statistikaIgracaService
                .getIgraciKlubUtakmica(this.utakmicaId, this.protivnik)
                .subscribe((dataProtivnicki) => {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.trener.klub)
                    .subscribe((dataNasi) => {
                      if (this.trener.klub == this.utakmica?.domacin) {
                        this.domaciIgraciStats = dataNasi;
                        this.gostujuciIgraciStats = dataProtivnicki;
                      } else {
                        this.domaciIgraciStats = dataProtivnicki;
                        this.gostujuciIgraciStats = dataNasi;
                      }
                      this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((game) => {
                        if (game.status == 'u toku') {
                          this.azurirajMinuteSvih();
                        }
                      });
                      this.statistikaIgracaService
                        .getIgracUtakmica(igrac, this.utakmicaId)
                        .subscribe((dataIgrac) => {
                          this.utakmicaDogadjajiService
                            .addDogadjaj(
                              this.utakmicaId,
                              this.domacin,
                              this.gost,
                              this.tajmerVreme(),
                              this.cetvrtina,
                              this.poeniDomacin,
                              this.poeniGost,
                              'Off Rebound',
                              dataPreUpdate.klub,
                              dataPreUpdate.ime,
                              dataPreUpdate.prezime,
                              dataPreUpdate.broj,
                              dataIgrac,
                            )
                            .subscribe((data) => {
                              this.utakmicaDogadjajiService
                                .getAllDogadjaji(this.utakmicaId)
                                .subscribe((allDogadjaji) => {
                                  for (let i = 0; i < allDogadjaji.length; i++) {
                                    if (allDogadjaji[i].cetvrtina == 1) {
                                      if (
                                        !this.dogadjajiPrvaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiPrvaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiPrvaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 2) {
                                      if (
                                        !this.dogadjajiDrugaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiDrugaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiDrugaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 3) {
                                      if (
                                        !this.dogadjajiTrecaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiTrecaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiTrecaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 4) {
                                      if (
                                        !this.dogadjajiCetvrtaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiCetvrtaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiCetvrtaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina > 4) {
                                      if (
                                        !this.dogadjajiProduzetak.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiProduzetak.push(allDogadjaji[i]);
                                        this.dogadjajiProduzetak.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;
                                          if (a.cetvrtina !== b.cetvrtina) {
                                            return b.cetvrtina - a.cetvrtina;
                                          }
                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    }
                                  }
                                });
                            });
                        });
                    });
                });
            } else {
              alert('error');
            }
          });
        if (dataPreUpdate.klub == this.utakmica?.domacin) {
          this.skokoviNapadUkupnoDomaci++;
          this.indeksUkupnoDomaci++;
        } else if (dataPreUpdate.klub == this.utakmica?.gost) {
          this.skokoviNapadUkupnoGosti++;
          this.indeksUkupnoGosti++;
        }
      });
  }
  skokOdbrana(igrac: string) {
    this.shotReset(24);
    this.statistikaIgracaService
      .getIgracUtakmica(igrac, this.utakmicaId)
      .subscribe((dataPreUpdate) => {
        let skokoviOdbrana = dataPreUpdate.skokoviOdbrana + 1;
        let skokoviUkupno = dataPreUpdate.skokoviUkupno + 1;
        let indeks = dataPreUpdate.indeks + 1;
        this.statistikaIgracaService
          .updateIgracStatistika(
            igrac,
            this.utakmicaId,
            dataPreUpdate.poeni,
            dataPreUpdate.dvaPoenaPogodak,
            dataPreUpdate.dvaPoenaPromasaj,
            dataPreUpdate.dvaPoenaProcenat,
            dataPreUpdate.triPoenaPogodak,
            dataPreUpdate.triPoenaPromasaj,
            dataPreUpdate.triPoenaProcenat,
            dataPreUpdate.slobodnoPogodak,
            dataPreUpdate.slobodnoPromasaj,
            dataPreUpdate.slobodnoProcenat,
            dataPreUpdate.skokoviNapad,
            skokoviOdbrana,
            skokoviUkupno,
            dataPreUpdate.asistencije,
            dataPreUpdate.ukradene,
            dataPreUpdate.izgubljene,
            dataPreUpdate.blokade,
            dataPreUpdate.blokadePrimljene,
            dataPreUpdate.licneGreske,
            dataPreUpdate.iznudjeniFaulovi,
            indeks,
            dataPreUpdate.plusMinus,
          )
          .subscribe((data) => {
            if (data.message == 'ok') {
              this.statistikaIgracaService
                .getIgraciKlubUtakmica(this.utakmicaId, this.protivnik)
                .subscribe((dataProtivnicki) => {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.trener.klub)
                    .subscribe((dataNasi) => {
                      if (this.trener.klub == this.utakmica?.domacin) {
                        this.domaciIgraciStats = dataNasi;
                        this.gostujuciIgraciStats = dataProtivnicki;
                      } else {
                        this.domaciIgraciStats = dataProtivnicki;
                        this.gostujuciIgraciStats = dataNasi;
                      }
                      this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((game) => {
                        if (game.status == 'u toku') {
                          this.azurirajMinuteSvih();
                        }
                      });
                      this.statistikaIgracaService
                        .getIgracUtakmica(igrac, this.utakmicaId)
                        .subscribe((dataIgrac) => {
                          this.utakmicaDogadjajiService
                            .addDogadjaj(
                              this.utakmicaId,
                              this.domacin,
                              this.gost,
                              this.tajmerVreme(),
                              this.cetvrtina,
                              this.poeniDomacin,
                              this.poeniGost,
                              'Def Reb',
                              dataPreUpdate.klub,
                              dataPreUpdate.ime,
                              dataPreUpdate.prezime,
                              dataPreUpdate.broj,
                              dataIgrac,
                            )
                            .subscribe((data) => {
                              this.utakmicaDogadjajiService
                                .getAllDogadjaji(this.utakmicaId)
                                .subscribe((allDogadjaji) => {
                                  for (let i = 0; i < allDogadjaji.length; i++) {
                                    if (allDogadjaji[i].cetvrtina == 1) {
                                      if (
                                        !this.dogadjajiPrvaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiPrvaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiPrvaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 2) {
                                      if (
                                        !this.dogadjajiDrugaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiDrugaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiDrugaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 3) {
                                      if (
                                        !this.dogadjajiTrecaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiTrecaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiTrecaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 4) {
                                      if (
                                        !this.dogadjajiCetvrtaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiCetvrtaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiCetvrtaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina > 4) {
                                      if (
                                        !this.dogadjajiProduzetak.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiProduzetak.push(allDogadjaji[i]);
                                        this.dogadjajiProduzetak.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;
                                          if (a.cetvrtina !== b.cetvrtina) {
                                            return b.cetvrtina - a.cetvrtina;
                                          }
                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    }
                                  }
                                });
                            });
                        });
                    });
                });
            } else {
              alert('error');
            }
          });
        if (dataPreUpdate.klub == this.utakmica?.domacin) {
          this.skokoviOdbranaUkupnoDomaci++;
          this.indeksUkupnoDomaci++;
        } else if (dataPreUpdate.klub == this.utakmica?.gost) {
          this.skokoviOdbranaUkupnoGosti++;
          this.indeksUkupnoGosti++;
        }
      });
  }
  asistencija(igrac: string) {
    this.statistikaIgracaService
      .getIgracUtakmica(igrac, this.utakmicaId)
      .subscribe((dataPreUpdate) => {
        let asistencije = dataPreUpdate.asistencije + 1;
        let indeks = dataPreUpdate.indeks + 1;
        this.statistikaIgracaService
          .updateIgracStatistika(
            igrac,
            this.utakmicaId,
            dataPreUpdate.poeni,
            dataPreUpdate.dvaPoenaPogodak,
            dataPreUpdate.dvaPoenaPromasaj,
            dataPreUpdate.dvaPoenaProcenat,
            dataPreUpdate.triPoenaPogodak,
            dataPreUpdate.triPoenaPromasaj,
            dataPreUpdate.triPoenaProcenat,
            dataPreUpdate.slobodnoPogodak,
            dataPreUpdate.slobodnoPromasaj,
            dataPreUpdate.slobodnoProcenat,
            dataPreUpdate.skokoviNapad,
            dataPreUpdate.skokoviOdbrana,
            dataPreUpdate.skokoviUkupno,
            asistencije,
            dataPreUpdate.ukradene,
            dataPreUpdate.izgubljene,
            dataPreUpdate.blokade,
            dataPreUpdate.blokadePrimljene,
            dataPreUpdate.licneGreske,
            dataPreUpdate.iznudjeniFaulovi,
            indeks,
            dataPreUpdate.plusMinus,
          )
          .subscribe((data) => {
            if (data.message == 'ok') {
              this.statistikaIgracaService
                .getIgraciKlubUtakmica(this.utakmicaId, this.protivnik)
                .subscribe((dataProtivnicki) => {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.trener.klub)
                    .subscribe((dataNasi) => {
                      if (this.trener.klub == this.utakmica?.domacin) {
                        this.domaciIgraciStats = dataNasi;
                        this.gostujuciIgraciStats = dataProtivnicki;
                      } else {
                        this.domaciIgraciStats = dataProtivnicki;
                        this.gostujuciIgraciStats = dataNasi;
                      }
                      this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((game) => {
                        if (game.status == 'u toku') {
                          this.azurirajMinuteSvih();
                        }
                      });
                      this.statistikaIgracaService
                        .getIgracUtakmica(igrac, this.utakmicaId)
                        .subscribe((dataIgrac) => {
                          this.utakmicaDogadjajiService
                            .addDogadjaj(
                              this.utakmicaId,
                              this.domacin,
                              this.gost,
                              this.tajmerVreme(),
                              this.cetvrtina,
                              this.poeniDomacin,
                              this.poeniGost,
                              'Assist',
                              dataPreUpdate.klub,
                              dataPreUpdate.ime,
                              dataPreUpdate.prezime,
                              dataPreUpdate.broj,
                              dataIgrac,
                            )
                            .subscribe((data) => {
                              this.utakmicaDogadjajiService
                                .getAllDogadjaji(this.utakmicaId)
                                .subscribe((allDogadjaji) => {
                                  for (let i = 0; i < allDogadjaji.length; i++) {
                                    if (allDogadjaji[i].cetvrtina == 1) {
                                      if (
                                        !this.dogadjajiPrvaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiPrvaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiPrvaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 2) {
                                      if (
                                        !this.dogadjajiDrugaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiDrugaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiDrugaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 3) {
                                      if (
                                        !this.dogadjajiTrecaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiTrecaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiTrecaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 4) {
                                      if (
                                        !this.dogadjajiCetvrtaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiCetvrtaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiCetvrtaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina > 4) {
                                      if (
                                        !this.dogadjajiProduzetak.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiProduzetak.push(allDogadjaji[i]);
                                        this.dogadjajiProduzetak.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;
                                          if (a.cetvrtina !== b.cetvrtina) {
                                            return b.cetvrtina - a.cetvrtina;
                                          }
                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    }
                                  }
                                });
                            });
                        });
                    });
                });
            } else {
              alert('error');
            }
          });
        if (dataPreUpdate.klub == this.utakmica?.domacin) {
          this.asistencijeUkupnoDomaci++;
          this.indeksUkupnoDomaci++;
        } else if (dataPreUpdate.klub == this.utakmica?.gost) {
          this.asistencijeUkupnoGosti++;
          this.indeksUkupnoGosti++;
        }
      });
  }
  ukradena(igrac: string) {
    this.statistikaIgracaService
      .getIgracUtakmica(igrac, this.utakmicaId)
      .subscribe((dataPreUpdate) => {
        let ukradene = dataPreUpdate.ukradene + 1;
        let indeks = dataPreUpdate.indeks + 1;
        this.statistikaIgracaService
          .updateIgracStatistika(
            igrac,
            this.utakmicaId,
            dataPreUpdate.poeni,
            dataPreUpdate.dvaPoenaPogodak,
            dataPreUpdate.dvaPoenaPromasaj,
            dataPreUpdate.dvaPoenaProcenat,
            dataPreUpdate.triPoenaPogodak,
            dataPreUpdate.triPoenaPromasaj,
            dataPreUpdate.triPoenaProcenat,
            dataPreUpdate.slobodnoPogodak,
            dataPreUpdate.slobodnoPromasaj,
            dataPreUpdate.slobodnoProcenat,
            dataPreUpdate.skokoviNapad,
            dataPreUpdate.skokoviOdbrana,
            dataPreUpdate.skokoviUkupno,
            dataPreUpdate.asistencije,
            ukradene,
            dataPreUpdate.izgubljene,
            dataPreUpdate.blokade,
            dataPreUpdate.blokadePrimljene,
            dataPreUpdate.licneGreske,
            dataPreUpdate.iznudjeniFaulovi,
            indeks,
            dataPreUpdate.plusMinus,
          )
          .subscribe((data) => {
            if (data.message == 'ok') {
              this.statistikaIgracaService
                .getIgraciKlubUtakmica(this.utakmicaId, this.protivnik)
                .subscribe((dataProtivnicki) => {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.trener.klub)
                    .subscribe((dataNasi) => {
                      if (this.trener.klub == this.utakmica?.domacin) {
                        this.domaciIgraciStats = dataNasi;
                        this.gostujuciIgraciStats = dataProtivnicki;
                      } else {
                        this.domaciIgraciStats = dataProtivnicki;
                        this.gostujuciIgraciStats = dataNasi;
                      }
                      this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((game) => {
                        if (game.status == 'u toku') {
                          this.azurirajMinuteSvih();
                        }
                      });
                      this.statistikaIgracaService
                        .getIgracUtakmica(igrac, this.utakmicaId)
                        .subscribe((dataIgrac) => {
                          this.utakmicaDogadjajiService
                            .addDogadjaj(
                              this.utakmicaId,
                              this.domacin,
                              this.gost,
                              this.tajmerVreme(),
                              this.cetvrtina,
                              this.poeniDomacin,
                              this.poeniGost,
                              'Steal',
                              dataPreUpdate.klub,
                              dataPreUpdate.ime,
                              dataPreUpdate.prezime,
                              dataPreUpdate.broj,
                              dataIgrac,
                            )
                            .subscribe((data) => {
                              this.utakmicaDogadjajiService
                                .getAllDogadjaji(this.utakmicaId)
                                .subscribe((allDogadjaji) => {
                                  for (let i = 0; i < allDogadjaji.length; i++) {
                                    if (allDogadjaji[i].cetvrtina == 1) {
                                      if (
                                        !this.dogadjajiPrvaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiPrvaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiPrvaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 2) {
                                      if (
                                        !this.dogadjajiDrugaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiDrugaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiDrugaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 3) {
                                      if (
                                        !this.dogadjajiTrecaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiTrecaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiTrecaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 4) {
                                      if (
                                        !this.dogadjajiCetvrtaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiCetvrtaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiCetvrtaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina > 4) {
                                      if (
                                        !this.dogadjajiProduzetak.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiProduzetak.push(allDogadjaji[i]);
                                        this.dogadjajiProduzetak.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;
                                          if (a.cetvrtina !== b.cetvrtina) {
                                            return b.cetvrtina - a.cetvrtina;
                                          }
                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    }
                                  }
                                });
                            });
                        });
                    });
                });
            } else {
              alert('error');
            }
          });
        if (dataPreUpdate.klub == this.utakmica?.domacin) {
          this.ukradeneUkupnoDomaci++;
          this.indeksUkupnoDomaci++;
        } else if (dataPreUpdate.klub == this.utakmica?.gost) {
          this.ukradeneUkupnoGosti++;
          this.indeksUkupnoGosti++;
        }
      });
  }
  izgubljena(igrac: string) {
    this.shotReset(24);
    this.statistikaIgracaService
      .getIgracUtakmica(igrac, this.utakmicaId)
      .subscribe((dataPreUpdate) => {
        let izgubljene = dataPreUpdate.izgubljene + 1;
        let indeks = dataPreUpdate.indeks - 1;
        this.statistikaIgracaService
          .updateIgracStatistika(
            igrac,
            this.utakmicaId,
            dataPreUpdate.poeni,
            dataPreUpdate.dvaPoenaPogodak,
            dataPreUpdate.dvaPoenaPromasaj,
            dataPreUpdate.dvaPoenaProcenat,
            dataPreUpdate.triPoenaPogodak,
            dataPreUpdate.triPoenaPromasaj,
            dataPreUpdate.triPoenaProcenat,
            dataPreUpdate.slobodnoPogodak,
            dataPreUpdate.slobodnoPromasaj,
            dataPreUpdate.slobodnoProcenat,
            dataPreUpdate.skokoviNapad,
            dataPreUpdate.skokoviOdbrana,
            dataPreUpdate.skokoviUkupno,
            dataPreUpdate.asistencije,
            dataPreUpdate.ukradene,
            izgubljene,
            dataPreUpdate.blokade,
            dataPreUpdate.blokadePrimljene,
            dataPreUpdate.licneGreske,
            dataPreUpdate.iznudjeniFaulovi,
            indeks,
            dataPreUpdate.plusMinus,
          )
          .subscribe((data) => {
            if (data.message == 'ok') {
              this.statistikaIgracaService
                .getIgraciKlubUtakmica(this.utakmicaId, this.protivnik)
                .subscribe((dataProtivnicki) => {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.trener.klub)
                    .subscribe((dataNasi) => {
                      if (this.trener.klub == this.utakmica?.domacin) {
                        this.domaciIgraciStats = dataNasi;
                        this.gostujuciIgraciStats = dataProtivnicki;
                      } else {
                        this.domaciIgraciStats = dataProtivnicki;
                        this.gostujuciIgraciStats = dataNasi;
                      }
                      this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((game) => {
                        if (game.status == 'u toku') {
                          this.azurirajMinuteSvih();
                        }
                      });
                      this.statistikaIgracaService
                        .getIgracUtakmica(igrac, this.utakmicaId)
                        .subscribe((dataIgrac) => {
                          this.utakmicaDogadjajiService
                            .addDogadjaj(
                              this.utakmicaId,
                              this.domacin,
                              this.gost,
                              this.tajmerVreme(),
                              this.cetvrtina,
                              this.poeniDomacin,
                              this.poeniGost,
                              'Turnover',
                              dataPreUpdate.klub,
                              dataPreUpdate.ime,
                              dataPreUpdate.prezime,
                              dataPreUpdate.broj,
                              dataIgrac,
                            )
                            .subscribe((data) => {
                              this.utakmicaDogadjajiService
                                .getAllDogadjaji(this.utakmicaId)
                                .subscribe((allDogadjaji) => {
                                  for (let i = 0; i < allDogadjaji.length; i++) {
                                    if (allDogadjaji[i].cetvrtina == 1) {
                                      if (
                                        !this.dogadjajiPrvaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiPrvaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiPrvaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 2) {
                                      if (
                                        !this.dogadjajiDrugaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiDrugaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiDrugaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 3) {
                                      if (
                                        !this.dogadjajiTrecaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiTrecaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiTrecaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 4) {
                                      if (
                                        !this.dogadjajiCetvrtaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiCetvrtaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiCetvrtaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina > 4) {
                                      if (
                                        !this.dogadjajiProduzetak.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiProduzetak.push(allDogadjaji[i]);
                                        this.dogadjajiProduzetak.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;
                                          if (a.cetvrtina !== b.cetvrtina) {
                                            return b.cetvrtina - a.cetvrtina;
                                          }
                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    }
                                  }
                                });
                            });
                        });
                    });
                });
            } else {
              alert('error');
            }
          });
        if (dataPreUpdate.klub == this.utakmica?.domacin) {
          this.izgubljeneUkupnoDomaci++;
          this.indeksUkupnoDomaci--;
        } else if (dataPreUpdate.klub == this.utakmica?.gost) {
          this.izgubljeneUkupnoGosti++;
          this.indeksUkupnoGosti--;
        }
      });
  }
  blokadaFor(igrac: string) {
    this.statistikaIgracaService
      .getIgracUtakmica(igrac, this.utakmicaId)
      .subscribe((dataPreUpdate) => {
        let blokade = dataPreUpdate.blokade + 1;
        let indeks = dataPreUpdate.indeks + 1;
        this.statistikaIgracaService
          .updateIgracStatistika(
            igrac,
            this.utakmicaId,
            dataPreUpdate.poeni,
            dataPreUpdate.dvaPoenaPogodak,
            dataPreUpdate.dvaPoenaPromasaj,
            dataPreUpdate.dvaPoenaProcenat,
            dataPreUpdate.triPoenaPogodak,
            dataPreUpdate.triPoenaPromasaj,
            dataPreUpdate.triPoenaProcenat,
            dataPreUpdate.slobodnoPogodak,
            dataPreUpdate.slobodnoPromasaj,
            dataPreUpdate.slobodnoProcenat,
            dataPreUpdate.skokoviNapad,
            dataPreUpdate.skokoviOdbrana,
            dataPreUpdate.skokoviUkupno,
            dataPreUpdate.asistencije,
            dataPreUpdate.ukradene,
            dataPreUpdate.izgubljene,
            blokade,
            dataPreUpdate.blokadePrimljene,
            dataPreUpdate.licneGreske,
            dataPreUpdate.iznudjeniFaulovi,
            indeks,
            dataPreUpdate.plusMinus,
          )
          .subscribe((data) => {
            if (data.message == 'ok') {
              this.statistikaIgracaService
                .getIgraciKlubUtakmica(this.utakmicaId, this.protivnik)
                .subscribe((dataProtivnicki) => {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.trener.klub)
                    .subscribe((dataNasi) => {
                      if (this.trener.klub == this.utakmica?.domacin) {
                        this.domaciIgraciStats = dataNasi;
                        this.gostujuciIgraciStats = dataProtivnicki;
                      } else {
                        this.domaciIgraciStats = dataProtivnicki;
                        this.gostujuciIgraciStats = dataNasi;
                      }
                      this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((game) => {
                        if (game.status == 'u toku') {
                          this.azurirajMinuteSvih();
                        }
                      });
                      this.statistikaIgracaService
                        .getIgracUtakmica(igrac, this.utakmicaId)
                        .subscribe((dataIgrac) => {
                          this.utakmicaDogadjajiService
                            .addDogadjaj(
                              this.utakmicaId,
                              this.domacin,
                              this.gost,
                              this.tajmerVreme(),
                              this.cetvrtina,
                              this.poeniDomacin,
                              this.poeniGost,
                              'Block',
                              dataPreUpdate.klub,
                              dataPreUpdate.ime,
                              dataPreUpdate.prezime,
                              dataPreUpdate.broj,
                              dataIgrac,
                            )
                            .subscribe((data) => {
                              this.utakmicaDogadjajiService
                                .getAllDogadjaji(this.utakmicaId)
                                .subscribe((allDogadjaji) => {
                                  for (let i = 0; i < allDogadjaji.length; i++) {
                                    if (allDogadjaji[i].cetvrtina == 1) {
                                      if (
                                        !this.dogadjajiPrvaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiPrvaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiPrvaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 2) {
                                      if (
                                        !this.dogadjajiDrugaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiDrugaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiDrugaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 3) {
                                      if (
                                        !this.dogadjajiTrecaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiTrecaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiTrecaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 4) {
                                      if (
                                        !this.dogadjajiCetvrtaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiCetvrtaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiCetvrtaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina > 4) {
                                      if (
                                        !this.dogadjajiProduzetak.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiProduzetak.push(allDogadjaji[i]);
                                        this.dogadjajiProduzetak.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;
                                          if (a.cetvrtina !== b.cetvrtina) {
                                            return b.cetvrtina - a.cetvrtina;
                                          }
                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    }
                                  }
                                });
                            });
                        });
                    });
                });
            } else {
              alert('error');
            }
          });
        if (dataPreUpdate.klub == this.utakmica?.domacin) {
          this.blokadeUkupnoDomaci++;
          this.indeksUkupnoDomaci++;
        } else if (dataPreUpdate.klub == this.utakmica?.gost) {
          this.blokadeUkupnoGosti++;
          this.indeksUkupnoGosti++;
        }
      });
  }
  blokadaAgainst(igrac: string) {
    this.statistikaIgracaService
      .getIgracUtakmica(igrac, this.utakmicaId)
      .subscribe((dataPreUpdate) => {
        let blokadePrimljene = dataPreUpdate.blokadePrimljene + 1;
        this.statistikaIgracaService
          .updateIgracStatistika(
            igrac,
            this.utakmicaId,
            dataPreUpdate.poeni,
            dataPreUpdate.dvaPoenaPogodak,
            dataPreUpdate.dvaPoenaPromasaj,
            dataPreUpdate.dvaPoenaProcenat,
            dataPreUpdate.triPoenaPogodak,
            dataPreUpdate.triPoenaPromasaj,
            dataPreUpdate.triPoenaProcenat,
            dataPreUpdate.slobodnoPogodak,
            dataPreUpdate.slobodnoPromasaj,
            dataPreUpdate.slobodnoProcenat,
            dataPreUpdate.skokoviNapad,
            dataPreUpdate.skokoviOdbrana,
            dataPreUpdate.skokoviUkupno,
            dataPreUpdate.asistencije,
            dataPreUpdate.ukradene,
            dataPreUpdate.izgubljene,
            dataPreUpdate.blokade,
            blokadePrimljene,
            dataPreUpdate.licneGreske,
            dataPreUpdate.iznudjeniFaulovi,
            dataPreUpdate.indeks,
            dataPreUpdate.plusMinus,
          )
          .subscribe((data) => {
            if (data.message == 'ok') {
              this.statistikaIgracaService
                .getIgraciKlubUtakmica(this.utakmicaId, this.protivnik)
                .subscribe((dataProtivnicki) => {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.trener.klub)
                    .subscribe((dataNasi) => {
                      if (this.trener.klub == this.utakmica?.domacin) {
                        this.domaciIgraciStats = dataNasi;
                        this.gostujuciIgraciStats = dataProtivnicki;
                      } else {
                        this.domaciIgraciStats = dataProtivnicki;
                        this.gostujuciIgraciStats = dataNasi;
                      }
                      this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((game) => {
                        if (game.status == 'u toku') {
                          this.azurirajMinuteSvih();
                        }
                      });
                      this.statistikaIgracaService
                        .getIgracUtakmica(igrac, this.utakmicaId)
                        .subscribe((dataIgrac) => {
                          this.utakmicaDogadjajiService
                            .addDogadjaj(
                              this.utakmicaId,
                              this.domacin,
                              this.gost,
                              this.tajmerVreme(),
                              this.cetvrtina,
                              this.poeniDomacin,
                              this.poeniGost,
                              'Shot Rejected',
                              dataPreUpdate.klub,
                              dataPreUpdate.ime,
                              dataPreUpdate.prezime,
                              dataPreUpdate.broj,
                              dataIgrac,
                            )
                            .subscribe((data) => {
                              this.utakmicaDogadjajiService
                                .getAllDogadjaji(this.utakmicaId)
                                .subscribe((allDogadjaji) => {
                                  for (let i = 0; i < allDogadjaji.length; i++) {
                                    if (allDogadjaji[i].cetvrtina == 1) {
                                      if (
                                        !this.dogadjajiPrvaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiPrvaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiPrvaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 2) {
                                      if (
                                        !this.dogadjajiDrugaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiDrugaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiDrugaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 3) {
                                      if (
                                        !this.dogadjajiTrecaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiTrecaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiTrecaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 4) {
                                      if (
                                        !this.dogadjajiCetvrtaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiCetvrtaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiCetvrtaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina > 4) {
                                      if (
                                        !this.dogadjajiProduzetak.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiProduzetak.push(allDogadjaji[i]);
                                        this.dogadjajiProduzetak.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;
                                          if (a.cetvrtina !== b.cetvrtina) {
                                            return b.cetvrtina - a.cetvrtina;
                                          }
                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    }
                                  }
                                });
                            });
                        });
                    });
                });
            } else {
              alert('error');
            }
          });
        if (dataPreUpdate.klub == this.utakmica?.domacin) {
          this.blokadePrimljeneUkupnoDomaci++;
          this.indeksUkupnoDomaci--;
        } else if (dataPreUpdate.klub == this.utakmica?.gost) {
          this.blokadePrimljeneUkupnoGosti++;
          this.indeksUkupnoGosti--;
        }
      });
  }
  faulDrawn(igrac: string) {
    this.tajmerPauziraj();
    this.statistikaIgracaService
      .getIgracUtakmica(igrac, this.utakmicaId)
      .subscribe((dataPreUpdate) => {
        let iznudjeniFaulovi = dataPreUpdate.iznudjeniFaulovi + 1;
        let indeks = dataPreUpdate.indeks + 1;
        this.statistikaIgracaService
          .updateIgracStatistika(
            igrac,
            this.utakmicaId,
            dataPreUpdate.poeni,
            dataPreUpdate.dvaPoenaPogodak,
            dataPreUpdate.dvaPoenaPromasaj,
            dataPreUpdate.dvaPoenaProcenat,
            dataPreUpdate.triPoenaPogodak,
            dataPreUpdate.triPoenaPromasaj,
            dataPreUpdate.triPoenaProcenat,
            dataPreUpdate.slobodnoPogodak,
            dataPreUpdate.slobodnoPromasaj,
            dataPreUpdate.slobodnoProcenat,
            dataPreUpdate.skokoviNapad,
            dataPreUpdate.skokoviOdbrana,
            dataPreUpdate.skokoviUkupno,
            dataPreUpdate.asistencije,
            dataPreUpdate.ukradene,
            dataPreUpdate.izgubljene,
            dataPreUpdate.blokade,
            dataPreUpdate.blokadePrimljene,
            dataPreUpdate.licneGreske,
            iznudjeniFaulovi,
            indeks,
            dataPreUpdate.plusMinus,
          )
          .subscribe((data) => {
            if (data.message == 'ok') {
              this.statistikaIgracaService
                .getIgraciKlubUtakmica(this.utakmicaId, this.protivnik)
                .subscribe((dataProtivnicki) => {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.trener.klub)
                    .subscribe((dataNasi) => {
                      if (this.trener.klub == this.utakmica?.domacin) {
                        this.domaciIgraciStats = dataNasi;
                        this.gostujuciIgraciStats = dataProtivnicki;
                      } else {
                        this.domaciIgraciStats = dataProtivnicki;
                        this.gostujuciIgraciStats = dataNasi;
                      }
                      this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((game) => {
                        if (game.status == 'u toku') {
                          this.azurirajMinuteSvih();
                        }
                      });
                      this.statistikaIgracaService
                        .getIgracUtakmica(igrac, this.utakmicaId)
                        .subscribe((dataIgrac) => {
                          this.utakmicaDogadjajiService
                            .addDogadjaj(
                              this.utakmicaId,
                              this.domacin,
                              this.gost,
                              this.tajmerVreme(),
                              this.cetvrtina,
                              this.poeniDomacin,
                              this.poeniGost,
                              'Foul drawn',
                              dataPreUpdate.klub,
                              dataPreUpdate.ime,
                              dataPreUpdate.prezime,
                              dataPreUpdate.broj,
                              dataIgrac,
                            )
                            .subscribe((data) => {
                              this.utakmicaDogadjajiService
                                .getAllDogadjaji(this.utakmicaId)
                                .subscribe((allDogadjaji) => {
                                  for (let i = 0; i < allDogadjaji.length; i++) {
                                    if (allDogadjaji[i].cetvrtina == 1) {
                                      if (
                                        !this.dogadjajiPrvaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiPrvaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiPrvaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 2) {
                                      if (
                                        !this.dogadjajiDrugaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiDrugaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiDrugaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 3) {
                                      if (
                                        !this.dogadjajiTrecaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiTrecaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiTrecaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 4) {
                                      if (
                                        !this.dogadjajiCetvrtaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiCetvrtaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiCetvrtaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina > 4) {
                                      if (
                                        !this.dogadjajiProduzetak.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiProduzetak.push(allDogadjaji[i]);
                                        this.dogadjajiProduzetak.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;
                                          if (a.cetvrtina !== b.cetvrtina) {
                                            return b.cetvrtina - a.cetvrtina;
                                          }
                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    }
                                  }
                                });
                            });
                        });
                    });
                });
            } else {
              alert('error');
            }
          });
        if (dataPreUpdate.klub == this.utakmica?.domacin) {
          this.iznudjeniFauloviUkupnoDomaci++;
          this.indeksUkupnoDomaci++;
        } else if (dataPreUpdate.klub == this.utakmica?.gost) {
          this.iznudjeniFauloviUkupnoGosti++;
          this.indeksUkupnoGosti++;
        }
      });
  }
  faulCom(igrac: string) {
    if (this.shotVreme() < 13) {
      this.shotReset(14);
    }
    this.tajmerPauziraj();
    this.statistikaIgracaService
      .getIgracUtakmica(igrac, this.utakmicaId)
      .subscribe((dataPreUpdate) => {
        let licneGreske = dataPreUpdate.licneGreske + 1;
        let indeks = dataPreUpdate.indeks - 1;
        this.statistikaIgracaService
          .updateIgracStatistika(
            igrac,
            this.utakmicaId,
            dataPreUpdate.poeni,
            dataPreUpdate.dvaPoenaPogodak,
            dataPreUpdate.dvaPoenaPromasaj,
            dataPreUpdate.dvaPoenaProcenat,
            dataPreUpdate.triPoenaPogodak,
            dataPreUpdate.triPoenaPromasaj,
            dataPreUpdate.triPoenaProcenat,
            dataPreUpdate.slobodnoPogodak,
            dataPreUpdate.slobodnoPromasaj,
            dataPreUpdate.slobodnoProcenat,
            dataPreUpdate.skokoviNapad,
            dataPreUpdate.skokoviOdbrana,
            dataPreUpdate.skokoviUkupno,
            dataPreUpdate.asistencije,
            dataPreUpdate.ukradene,
            dataPreUpdate.izgubljene,
            dataPreUpdate.blokade,
            dataPreUpdate.blokadePrimljene,
            licneGreske,
            dataPreUpdate.iznudjeniFaulovi,
            indeks,
            dataPreUpdate.plusMinus,
          )
          .subscribe((data) => {
            if (data.message == 'ok') {
              this.statistikaIgracaService
                .getIgraciKlubUtakmica(this.utakmicaId, this.protivnik)
                .subscribe((dataProtivnicki) => {
                  this.statistikaIgracaService
                    .getIgraciKlubUtakmica(this.utakmicaId, this.trener.klub)
                    .subscribe((dataNasi) => {
                      if (this.trener.klub == this.utakmica?.domacin) {
                        this.domaciIgraciStats = dataNasi;
                        this.gostujuciIgraciStats = dataProtivnicki;
                      } else {
                        this.domaciIgraciStats = dataProtivnicki;
                        this.gostujuciIgraciStats = dataNasi;
                      }
                      this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((game) => {
                        if (game.status == 'u toku') {
                          this.azurirajMinuteSvih();
                        }
                      });
                      this.statistikaIgracaService
                        .getIgracUtakmica(igrac, this.utakmicaId)
                        .subscribe((dataIgrac) => {
                          this.utakmicaDogadjajiService
                            .addDogadjaj(
                              this.utakmicaId,
                              this.domacin,
                              this.gost,
                              this.tajmerVreme(),
                              this.cetvrtina,
                              this.poeniDomacin,
                              this.poeniGost,
                              'Foul',
                              dataPreUpdate.klub,
                              dataPreUpdate.ime,
                              dataPreUpdate.prezime,
                              dataPreUpdate.broj,
                              dataIgrac,
                            )
                            .subscribe((data) => {
                              this.utakmicaDogadjajiService
                                .getAllDogadjaji(this.utakmicaId)
                                .subscribe((allDogadjaji) => {
                                  for (let i = 0; i < allDogadjaji.length; i++) {
                                    if (allDogadjaji[i].cetvrtina == 1) {
                                      if (
                                        !this.dogadjajiPrvaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiPrvaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiPrvaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 2) {
                                      if (
                                        !this.dogadjajiDrugaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiDrugaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiDrugaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 3) {
                                      if (
                                        !this.dogadjajiTrecaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiTrecaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiTrecaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina == 4) {
                                      if (
                                        !this.dogadjajiCetvrtaCetvrtina.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiCetvrtaCetvrtina.push(allDogadjaji[i]);
                                        this.dogadjajiCetvrtaCetvrtina.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;

                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    } else if (allDogadjaji[i].cetvrtina > 4) {
                                      if (
                                        !this.dogadjajiProduzetak.some(
                                          (dogadjaj) => dogadjaj.id === allDogadjaji[i].id,
                                        )
                                      ) {
                                        this.dogadjajiProduzetak.push(allDogadjaji[i]);
                                        this.dogadjajiProduzetak.sort((a, b) => {
                                          const [minA, secA] = a.vreme.split(':').map(Number);
                                          const [minB, secB] = b.vreme.split(':').map(Number);
                                          const ukupnosekundeA = minA * 60 + secA;
                                          const ukuonosekundeB = minB * 60 + secB;
                                          if (a.cetvrtina !== b.cetvrtina) {
                                            return b.cetvrtina - a.cetvrtina;
                                          }
                                          if (ukupnosekundeA !== ukuonosekundeB) {
                                            return ukupnosekundeA - ukuonosekundeB;
                                          }
                                          return b.id - a.id;
                                        });
                                      }
                                    }
                                  }
                                });
                            });
                        });
                    });
                });
            } else {
              alert('error');
            }
          });
        if (dataPreUpdate.klub == this.utakmica?.domacin) {
          this.licneGreskeUkupnoDomaci++;
          this.indeksUkupnoDomaci--;
        } else if (dataPreUpdate.klub == this.utakmica?.gost) {
          this.licneGreskeUkupnoGosti++;
          this.indeksUkupnoGosti--;
        }
      });
  }

  shotPokreni() {
    this.tajmerService.shotPokreni();
  }
  shotPauziraj() {
    this.tajmerService.shotPauziraj();
  }

  tajmerPokreni() {
    this.tajmerService.pokreni();
    this.tajmerService.shotPokreni();
    this.utakmiceService
      .updateTajmer(
        this.utakmicaId,
        this.tajmerService.vreme,
        this.tajmerService.cetvrtina,
        this.tajmerService.radi,
      )
      .subscribe();
  }
  tajmerRadi(): boolean {
    return this.tajmerService.radi;
  }
  tajmerPauziraj() {
    this.tajmerService.pauziraj();
    this.tajmerService.shotPauziraj();
    this.utakmiceService
      .updateTajmer(
        this.utakmicaId,
        this.tajmerService.vreme,
        this.tajmerService.cetvrtina,
        this.tajmerService.radi,
      )
      .subscribe();
  }
  tajmerReset() {
    this.tajmerService.reset();
    this.tajmerService.shotReset(24);
    this.utakmiceService
      .updateTajmer(
        this.utakmicaId,
        this.tajmerService.vreme,
        this.tajmerService.cetvrtina,
        this.tajmerService.radi,
      )
      .subscribe();
  }
  tajmerSledecaCetvrtina() {
    this.tajmerService.sledecaCetvrtina();
    this.cetvrtina = this.tajmerService.cetvrtina;
    this.azurirajMinuteSvih();

    this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((data) => {
      if (data.status == 'u toku') {
        this.utakmiceService
          .updateTajmer(
            this.utakmicaId,
            this.tajmerService.vreme,
            this.tajmerService.cetvrtina,
            this.tajmerService.radi,
          )
          .subscribe();
        this.minutiUkupnoDomaci = 0;
        this.minutiUkupnoGosti = 0;
        this.domaciIgraciStats.forEach((igrac) => {
          this.statistikaIgracaService
            .updateIgracMinuti(igrac.id, this.utakmicaId, igrac.minuti)
            .subscribe((msg) => {
              this.minutiUkupnoDomaci += this.vremeUSekunde(igrac.minuti);
            });
        });
        this.gostujuciIgraciStats.forEach((igrac) => {
          this.statistikaIgracaService
            .updateIgracMinuti(igrac.id, this.utakmicaId, igrac.minuti)
            .subscribe((msg) => {
              this.minutiUkupnoGosti += this.vremeUSekunde(igrac.minuti);
            });
        });
      }
    });
  }
  tajmerPrethodnaCetvrtina() {
    this.tajmerService.prethodnaCetvrtina();
    this.cetvrtina = this.tajmerService.cetvrtina;
    this.azurirajMinuteSvih();
    this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((data) => {
      if (data.status == 'u toku') {
        this.utakmiceService
          .updateTajmer(
            this.utakmicaId,
            this.tajmerService.vreme,
            this.tajmerService.cetvrtina,
            this.tajmerService.radi,
          )
          .subscribe();
        this.minutiUkupnoDomaci = 0;
        this.minutiUkupnoGosti = 0;
        this.domaciIgraciStats.forEach((igrac) => {
          this.statistikaIgracaService
            .updateIgracMinuti(igrac.id, this.utakmicaId, igrac.minuti)
            .subscribe((msg) => {
              this.minutiUkupnoDomaci += this.vremeUSekunde(igrac.minuti);
            });
        });
        this.gostujuciIgraciStats.forEach((igrac) => {
          this.statistikaIgracaService
            .updateIgracMinuti(igrac.id, this.utakmicaId, igrac.minuti)
            .subscribe((msg) => {
              this.minutiUkupnoGosti += this.vremeUSekunde(igrac.minuti);
            });
        });
      }
    });
  }
  tajmerVreme(): string {
    return this.tajmerService.formatVreme;
  }

  izaberiCetvrtinuPbp(cetvrtina: number) {
    this.pbpCetvrtina = cetvrtina;
  }
  shotReset(time: number) {
    this.tajmerService.shotReset(time);
    //  this.tajmerService.pokreni();
  }
  tajmerVremeSekunde(): number {
    return this.tajmerService.vreme;
  }
  postaviVreme() {
    // pretvori u sekunde i postavi na tajmer
    //  this.tajmerService.shotReset(this.unosShotClock);
    const ukupnoSekundi = this.unosMinuti * 60 + this.unosSekunde;
    this.tajmerService.vreme = ukupnoSekundi; // ili kako god čuvaš vreme
    this.prikaziUnosVremena = false; // sakrij input nakon potvrde
    this.utakmiceService
      .updateTajmer(
        this.utakmicaId,
        this.tajmerService.vreme,
        this.tajmerService.cetvrtina,
        this.tajmerService.radi,
      )
      .subscribe();
  }

  shotVreme(): number {
    return this.tajmerService.shotVreme();
  }

  // "10:00" → sekunde
  vremeUSekunde(vreme: string): number {
    const [min, sec] = vreme.split(':').map(Number);
    return min * 60 + sec;
  }

  // (četvrtina + preostalo vreme) → proteklo vreme od početka utakmice
  apsolutnoVreme(cetvrtina: number, preostaloSekundi: number): number {
    if (cetvrtina <= 4) {
      // regularne četvrtine - 10 minuta (600s)
      return (cetvrtina - 1) * 600 + (600 - preostaloSekundi);
    } else {
      // produžeci - prve 4 četvrtine = 2400s, pa svaki produžetak 5 min (300s)
      const prethodniProduzeci = cetvrtina - 5; // koliko produžetaka pre ovog
      return 2400 + prethodniProduzeci * 300 + (300 - preostaloSekundi);
    }
  }

  // sekunde → "mm:ss"
  formatMinute(sekundi: number): string {
    const min = Math.floor(sekundi / 60);
    const sec = sekundi % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  private idIzDogadjaja(igrac: any): string {
    // naš igrač ima korisnickoIme, protivnički ima id (number)
    return igrac.korisnickoIme ?? String(igrac.id);
  }

  izracunajMinute(statId: string, trenutnoApsolutnoVreme: number): number {
    const subovi = this.sviDogadjaji
      .filter(
        (d) =>
          (d.opis === 'Sub IN' || d.opis === 'Sub OUT') &&
          d.igrac &&
          this.idIzDogadjaja(d.igrac) === statId,
      )
      .map((d) => ({
        tip: d.opis,
        apsolutno: this.apsolutnoVreme(d.cetvrtina, this.vremeUSekunde(d.vreme)),
        redosled: d.id, // ← DODAJ id događaja
      }))
      .sort((a, b) => {
        if (a.apsolutno !== b.apsolutno) return a.apsolutno - b.apsolutno;
        return a.redosled - b.redosled; // ← ZAMENI tip-sort sa id-sort
      });

    let ukupno = 0;
    let vremeUlaska: number | null = null;

    const naTerenu =
      this.terenIgraci.some((ig) => ig.korisnickoIme === statId) ||
      this.terenProtivnickiIgraci.some((ig) => String(ig.id) === statId);

    if (subovi.length === 0) {
      return naTerenu ? trenutnoApsolutnoVreme : 0;
    }

    if (subovi[0].tip === 'Sub OUT') {
      vremeUlaska = 0;
    }

    for (const s of subovi) {
      if (s.tip === 'Sub IN') {
        vremeUlaska = s.apsolutno;
      } else if (s.tip === 'Sub OUT' && vremeUlaska !== null) {
        ukupno += s.apsolutno - vremeUlaska;
        vremeUlaska = null;
      }
    }

    if (vremeUlaska !== null) {
      ukupno += trenutnoApsolutnoVreme - vremeUlaska;
    }
    return ukupno;
  }

  azurirajMinuteSvih() {
    if (this.domaciIgraciStats.length === 0 && this.gostujuciIgraciStats.length === 0) return;

    const trenutno = this.apsolutnoVreme(this.tajmerService.cetvrtina, this.tajmerService.vreme);
    [...this.domaciIgraciStats, ...this.gostujuciIgraciStats].forEach((igrac) => {
      const sekundi = this.izracunajMinute(igrac.id, trenutno);
      igrac.minuti = this.formatMinute(sekundi);
    });
  }

  izracunajUkupnoDomaciStats() {
    this.statistikaIgracaService
      .getIgraciKlubUtakmica(this.utakmicaId, this.domacin)
      .subscribe((statsIgraci) => {
        this.domaciIgraciStats = statsIgraci;
        for (let i = 0; i < statsIgraci.length; i++) {
          if (i == 0) {
            this.minutiUkupnoDomaci = 0;
            this.poeniUkupnoDomaci = 0;
            this.dvaPoenaPogodakUkupnoDomaci = 0;
            this.dvaPoenaPromasajUkupnoDomaci = 0;
            this.triPoenaPogodakUkupnoDomaci = 0;
            this.triPoenaPromasajUkupnoDomaci = 0;
            this.triPoenaProcenatUkupnoDomaci = 0;
            this.slobodnoPogodakUkupnoDomaci = 0;
            this.slobodnoPromasajUkupnoDomaci = 0;
            this.slobodnoProcenatUkupnoDomaci = 0;
            this.skokoviNapadUkupnoDomaci = 0;
            this.skokoviOdbranaUkupnoDomaci = 0;
            this.skokoviUkupnoUkupnoDomaci = 0;
            this.asistencijeUkupnoDomaci = 0;
            this.ukradeneUkupnoDomaci = 0;
            this.izgubljeneUkupnoDomaci = 0;
            this.blokadeUkupnoDomaci = 0;
            this.blokadePrimljeneUkupnoDomaci = 0;
            this.licneGreskeUkupnoDomaci = 0;
            this.iznudjeniFauloviUkupnoDomaci = 0;
            this.indeksUkupnoDomaci = 0;
            this.plusMinusUkupnoDomaci = 0;
            this.dvaPoenaProcenatUkupnoDomaci = 0;
            this.triPoenaProcenatUkupnoDomaci = 0;
            this.slobodnoProcenatUkupnoDomaci = 0;
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
            this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((game) => {
              if (game.status == 'u toku') {
                this.azurirajMinuteSvih();
              }
            });
          }
        }
      });
  }

  izracunajUkupnoGostiStats() {
    this.statistikaIgracaService
      .getIgraciKlubUtakmica(this.utakmicaId, this.gost)
      .subscribe((statsIgraci) => {
        this.gostujuciIgraciStats = statsIgraci;
        for (let i = 0; i < statsIgraci.length; i++) {
          if (i == 0) {
            this.minutiUkupnoGosti = 0;
            this.poeniUkupnoGosti = 0;
            this.dvaPoenaPogodakUkupnoGosti = 0;
            this.dvaPoenaPromasajUkupnoGosti = 0;
            this.triPoenaPogodakUkupnoGosti = 0;
            this.triPoenaPromasajUkupnoGosti = 0;
            this.triPoenaProcenatUkupnoGosti = 0;
            this.slobodnoPogodakUkupnoGosti = 0;
            this.slobodnoPromasajUkupnoGosti = 0;
            this.slobodnoProcenatUkupnoGosti = 0;
            this.skokoviNapadUkupnoGosti = 0;
            this.skokoviOdbranaUkupnoGosti = 0;
            this.skokoviUkupnoUkupnoGosti = 0;
            this.asistencijeUkupnoGosti = 0;
            this.ukradeneUkupnoGosti = 0;
            this.izgubljeneUkupnoGosti = 0;
            this.blokadeUkupnoGosti = 0;
            this.blokadePrimljeneUkupnoGosti = 0;
            this.licneGreskeUkupnoGosti = 0;
            this.iznudjeniFauloviUkupnoGosti = 0;
            this.indeksUkupnoGosti = 0;
            this.plusMinusUkupnoGosti = 0;
            this.dvaPoenaProcenatUkupnoGosti = 0;
            this.triPoenaProcenatUkupnoGosti = 0;
            this.slobodnoProcenatUkupnoGosti = 0;
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
            this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((game) => {
              if (game.status == 'u toku') {
                this.azurirajMinuteSvih();
              }
            });
          }
        }
      });
  }

  igracNaTerenuTrenutak(cetvrtina: number, preostalo: number, statId: string): boolean {
    const ciljnoVreme = this.apsolutnoVreme(cetvrtina, preostalo);

    // svi Sub događaji ovog igrača PRE ili U ciljnom vremenu, sortirani hronološki
    const subovi = this.sviDogadjaji
      .filter(
        (d) =>
          (d.opis === 'Sub IN' || d.opis === 'Sub OUT') &&
          d.igrac &&
          this.idIzDogadjaja(d.igrac) === statId &&
          this.apsolutnoVreme(d.cetvrtina, this.vremeUSekunde(d.vreme)) <= ciljnoVreme,
      )
      .map((d) => ({
        tip: d.opis,
        apsolutno: this.apsolutnoVreme(d.cetvrtina, this.vremeUSekunde(d.vreme)),
        redosled: d.id,
      }))
      .sort((a, b) => {
        if (a.apsolutno !== b.apsolutno) return a.apsolutno - b.apsolutno;
        return a.redosled - b.redosled;
      });

    if (subovi.length === 0) {
      // nema događaja pre tog trenutka - na terenu samo ako je starter
      const igrac =
        this.domaciIgraciStats.find((ig) => ig.id === statId) ||
        this.gostujuciIgraciStats.find((ig) => ig.id === statId);
      return igrac ? igrac.starter : false;
    }

    // poslednji događaj pre/u ciljnom vremenu određuje status
    const poslednji = subovi[subovi.length - 1];
    return poslednji.tip === 'Sub IN';
  }

  obrisiDogadjaj(dogadjaj: UtakmicaDogadjaji) {
    let cetvrtinaDeleted = dogadjaj.cetvrtina;
    let igrac = dogadjaj.igrac;
    let opis = dogadjaj.opis;
    this.utakmicaDogadjajiService.deleteDogadjaj(dogadjaj.id, this.utakmicaId).subscribe((data) => {
      this.utakmicaDogadjajiService
        .getAllDogadjajiCetvrtina(this.utakmicaId, 1)
        .subscribe((data1) => {
          this.dogadjajiPrvaCetvrtina = data1;
        });
      this.utakmicaDogadjajiService
        .getAllDogadjajiCetvrtina(this.utakmicaId, 2)
        .subscribe((data2) => {
          this.dogadjajiDrugaCetvrtina = data2;
        });
      this.utakmicaDogadjajiService
        .getAllDogadjajiCetvrtina(this.utakmicaId, 3)
        .subscribe((data3) => {
          this.dogadjajiTrecaCetvrtina = data3;
        });
      this.utakmicaDogadjajiService
        .getAllDogadjajiCetvrtina(this.utakmicaId, 4)
        .subscribe((data4) => {
          this.dogadjajiCetvrtaCetvrtina = data4;
        });
      this.utakmicaDogadjajiService.getAllDogadjajiProduzeci(this.utakmicaId).subscribe((data5) => {
        this.dogadjajiProduzetak = data5;
      });
      this.statistikaIgracaService
        .getIgracUtakmica(igrac.id, this.utakmicaId)
        .subscribe((dataPreDelete) => {
          let deleteStatIgrac = dataPreDelete;
          if (data.message == 'ok') {
            //  alert('ok');
            switch (opis) {
              case '2FG Made': {
                deleteStatIgrac.dvaPoenaPogodak--;
                deleteStatIgrac.poeni -= 2;
                deleteStatIgrac.indeks -= 2;
                if (dataPreDelete.klub == this.domacin) {
                  this.utakmiceService
                    .updatePoeniUtakmicaDomacin(this.utakmicaId, this.poeniDomacin - 2)
                    .subscribe((msg) => {
                      this.poeniDomacin -= 2;
                    });
                  for (let i = 0; i < this.gostujuciIgraciStats.length; i++) {
                    if (
                      this.igracNaTerenuTrenutak(
                        dogadjaj.cetvrtina,
                        this.vremeUSekunde(dogadjaj.vreme),
                        this.gostujuciIgraciStats[i].id,
                      )
                    ) {
                      this.statistikaIgracaService
                        .getIgracUtakmica(this.gostujuciIgraciStats[i].id, this.utakmicaId)
                        .subscribe((igracPreUpdate) => {
                          this.statistikaIgracaService
                            .updateIgracPlusMinus(
                              igracPreUpdate.id,
                              this.utakmicaId,
                              igracPreUpdate.plusMinus + 2,
                            )
                            .subscribe((msg) => {});
                        });
                      this.gostujuciIgraciStats[i].plusMinus += 2;
                    }
                    if (i == 0) {
                      this.plusMinusUkupnoGosti = 0;
                    }
                    this.plusMinusUkupnoGosti += this.gostujuciIgraciStats[i].plusMinus;
                  }
                  for (let i = 0; i < this.domaciIgraciStats.length; i++) {
                    if (
                      this.igracNaTerenuTrenutak(
                        dogadjaj.cetvrtina,
                        this.vremeUSekunde(dogadjaj.vreme),
                        this.domaciIgraciStats[i].id,
                      )
                    ) {
                      this.statistikaIgracaService
                        .getIgracUtakmica(this.domaciIgraciStats[i].id, this.utakmicaId)
                        .subscribe((igracPreUpdate) => {
                          this.statistikaIgracaService
                            .updateIgracPlusMinus(
                              igracPreUpdate.id,
                              this.utakmicaId,
                              igracPreUpdate.plusMinus - 2,
                            )
                            .subscribe((msg) => {});
                        });
                      this.domaciIgraciStats[i].plusMinus -= 2;
                    }
                    if (i == 0) {
                      this.plusMinusUkupnoDomaci = 0;
                    }
                    this.plusMinusUkupnoDomaci += this.domaciIgraciStats[i].plusMinus;
                  }
                } else {
                  this.utakmiceService
                    .updatePoeniUtakmicaGost(this.utakmicaId, this.poeniGost - 2)
                    .subscribe((msg) => {
                      this.poeniGost -= 2;
                    });
                  for (let i = 0; i < this.domaciIgraciStats.length; i++) {
                    if (
                      this.igracNaTerenuTrenutak(
                        dogadjaj.cetvrtina,
                        this.vremeUSekunde(dogadjaj.vreme),
                        this.domaciIgraciStats[i].id,
                      )
                    ) {
                      this.statistikaIgracaService
                        .getIgracUtakmica(this.domaciIgraciStats[i].id, this.utakmicaId)
                        .subscribe((igracPreUpdate) => {
                          this.statistikaIgracaService
                            .updateIgracPlusMinus(
                              igracPreUpdate.id,
                              this.utakmicaId,
                              igracPreUpdate.plusMinus + 2,
                            )
                            .subscribe((msg) => {});
                        });
                      this.domaciIgraciStats[i].plusMinus += 2;
                    }
                    if (i == 0) {
                      this.plusMinusUkupnoDomaci = 0;
                    }
                    this.plusMinusUkupnoDomaci += this.domaciIgraciStats[i].plusMinus;
                  }
                  for (let i = 0; i < this.gostujuciIgraciStats.length; i++) {
                    if (
                      this.igracNaTerenuTrenutak(
                        dogadjaj.cetvrtina,
                        this.vremeUSekunde(dogadjaj.vreme),
                        this.gostujuciIgraciStats[i].id,
                      )
                    ) {
                      this.statistikaIgracaService
                        .getIgracUtakmica(this.gostujuciIgraciStats[i].id, this.utakmicaId)
                        .subscribe((igracPreUpdate) => {
                          this.statistikaIgracaService
                            .updateIgracPlusMinus(
                              igracPreUpdate.id,
                              this.utakmicaId,
                              igracPreUpdate.plusMinus - 2,
                            )
                            .subscribe((msg) => {});
                        });
                      this.gostujuciIgraciStats[i].plusMinus -= 2;
                    }
                    if (i == 0) {
                      this.plusMinusUkupnoGosti = 0;
                    }
                    this.plusMinusUkupnoGosti += this.gostujuciIgraciStats[i].plusMinus;
                  }
                }
                if (deleteStatIgrac.dvaPoenaPogodak > 1 || deleteStatIgrac.dvaPoenaPromasaj > 1) {
                  deleteStatIgrac.dvaPoenaProcenat =
                    (deleteStatIgrac.dvaPoenaPogodak /
                      (deleteStatIgrac.dvaPoenaPogodak + deleteStatIgrac.dvaPoenaPromasaj)) *
                    100;
                } else {
                  deleteStatIgrac.dvaPoenaProcenat = 0;
                }

                break;
              }
              case '2FG Miss': {
                deleteStatIgrac.dvaPoenaPromasaj--;
                deleteStatIgrac.indeks++;
                if (deleteStatIgrac.dvaPoenaPogodak > 1 || deleteStatIgrac.dvaPoenaPromasaj > 1) {
                  deleteStatIgrac.dvaPoenaProcenat =
                    (deleteStatIgrac.dvaPoenaPogodak /
                      (deleteStatIgrac.dvaPoenaPogodak + deleteStatIgrac.dvaPoenaPromasaj)) *
                    100;
                } else {
                  deleteStatIgrac.dvaPoenaProcenat = 0;
                }
                break;
              }
              case '3FG Made': {
                deleteStatIgrac.triPoenaPogodak--;
                deleteStatIgrac.poeni -= 3;
                deleteStatIgrac.indeks -= 3;
                if (dataPreDelete.klub == this.domacin) {
                  this.utakmiceService
                    .updatePoeniUtakmicaDomacin(this.utakmicaId, this.poeniDomacin - 3)
                    .subscribe((msg) => {
                      this.poeniDomacin -= 3;
                    });

                  for (let i = 0; i < this.gostujuciIgraciStats.length; i++) {
                    if (
                      this.igracNaTerenuTrenutak(
                        dogadjaj.cetvrtina,
                        this.vremeUSekunde(dogadjaj.vreme),
                        this.gostujuciIgraciStats[i].id,
                      )
                    ) {
                      this.statistikaIgracaService
                        .getIgracUtakmica(this.gostujuciIgraciStats[i].id, this.utakmicaId)
                        .subscribe((igracPreUpdate) => {
                          this.statistikaIgracaService
                            .updateIgracPlusMinus(
                              igracPreUpdate.id,
                              this.utakmicaId,
                              igracPreUpdate.plusMinus + 3,
                            )
                            .subscribe((msg) => {});
                        });
                      this.gostujuciIgraciStats[i].plusMinus += 3;
                    }
                    if (i == 0) {
                      this.plusMinusUkupnoGosti = 0;
                    }
                    this.plusMinusUkupnoGosti += this.gostujuciIgraciStats[i].plusMinus;
                  }
                  for (let i = 0; i < this.domaciIgraciStats.length; i++) {
                    if (
                      this.igracNaTerenuTrenutak(
                        dogadjaj.cetvrtina,
                        this.vremeUSekunde(dogadjaj.vreme),
                        this.domaciIgraciStats[i].id,
                      )
                    ) {
                      this.statistikaIgracaService
                        .getIgracUtakmica(this.domaciIgraciStats[i].id, this.utakmicaId)
                        .subscribe((igracPreUpdate) => {
                          this.statistikaIgracaService
                            .updateIgracPlusMinus(
                              igracPreUpdate.id,
                              this.utakmicaId,
                              igracPreUpdate.plusMinus - 3,
                            )
                            .subscribe((msg) => {});
                        });
                      this.domaciIgraciStats[i].plusMinus -= 3;
                    }
                    if (i == 0) {
                      this.plusMinusUkupnoDomaci = 0;
                    }
                    this.plusMinusUkupnoDomaci += this.domaciIgraciStats[i].plusMinus;
                  }
                } else {
                  this.utakmiceService
                    .updatePoeniUtakmicaGost(this.utakmicaId, this.poeniGost - 3)
                    .subscribe((msg) => {
                      this.poeniGost -= 3;
                    });
                  for (let i = 0; i < this.domaciIgraciStats.length; i++) {
                    if (
                      this.igracNaTerenuTrenutak(
                        dogadjaj.cetvrtina,
                        this.vremeUSekunde(dogadjaj.vreme),
                        this.domaciIgraciStats[i].id,
                      )
                    ) {
                      this.statistikaIgracaService
                        .getIgracUtakmica(this.domaciIgraciStats[i].id, this.utakmicaId)
                        .subscribe((igracPreUpdate) => {
                          this.statistikaIgracaService
                            .updateIgracPlusMinus(
                              igracPreUpdate.id,
                              this.utakmicaId,
                              igracPreUpdate.plusMinus + 3,
                            )
                            .subscribe((msg) => {});
                        });
                      this.domaciIgraciStats[i].plusMinus += 3;
                    }
                    if (i == 0) {
                      this.plusMinusUkupnoDomaci = 0;
                    }
                    this.plusMinusUkupnoDomaci += this.domaciIgraciStats[i].plusMinus;
                  }
                  for (let i = 0; i < this.gostujuciIgraciStats.length; i++) {
                    if (
                      this.igracNaTerenuTrenutak(
                        dogadjaj.cetvrtina,
                        this.vremeUSekunde(dogadjaj.vreme),
                        this.gostujuciIgraciStats[i].id,
                      )
                    ) {
                      this.statistikaIgracaService
                        .getIgracUtakmica(this.gostujuciIgraciStats[i].id, this.utakmicaId)
                        .subscribe((igracPreUpdate) => {
                          this.statistikaIgracaService
                            .updateIgracPlusMinus(
                              igracPreUpdate.id,
                              this.utakmicaId,
                              igracPreUpdate.plusMinus - 3,
                            )
                            .subscribe((msg) => {});
                        });
                      this.gostujuciIgraciStats[i].plusMinus -= 3;
                    }
                    if (i == 0) {
                      this.plusMinusUkupnoGosti = 0;
                    }
                    this.plusMinusUkupnoGosti += this.gostujuciIgraciStats[i].plusMinus;
                  }
                }
                if (deleteStatIgrac.triPoenaPogodak > 1 || deleteStatIgrac.triPoenaPromasaj > 1) {
                  deleteStatIgrac.triPoenaProcenat =
                    (deleteStatIgrac.triPoenaPogodak /
                      (deleteStatIgrac.triPoenaPogodak + deleteStatIgrac.triPoenaPromasaj)) *
                    100;
                } else {
                  deleteStatIgrac.triPoenaProcenat = 0;
                }

                break;
              }
              case '3FG Miss': {
                deleteStatIgrac.triPoenaPromasaj--;
                deleteStatIgrac.indeks++;
                if (deleteStatIgrac.triPoenaPogodak > 1 || deleteStatIgrac.triPoenaPromasaj > 1) {
                  deleteStatIgrac.triPoenaProcenat =
                    (deleteStatIgrac.triPoenaPogodak /
                      (deleteStatIgrac.triPoenaPogodak + deleteStatIgrac.triPoenaPromasaj)) *
                    100;
                } else {
                  deleteStatIgrac.triPoenaProcenat = 0;
                }
                break;
              }
              case 'FT Made': {
                deleteStatIgrac.slobodnoPogodak--;
                deleteStatIgrac.poeni--;
                deleteStatIgrac.indeks--;
                if (dataPreDelete.klub == this.domacin) {
                  this.utakmiceService
                    .updatePoeniUtakmicaDomacin(this.utakmicaId, this.poeniDomacin - 1)
                    .subscribe((msg) => {
                      this.poeniDomacin--;
                    });
                  for (let i = 0; i < this.gostujuciIgraciStats.length; i++) {
                    if (
                      this.igracNaTerenuTrenutak(
                        dogadjaj.cetvrtina,
                        this.vremeUSekunde(dogadjaj.vreme),
                        this.gostujuciIgraciStats[i].id,
                      )
                    ) {
                      this.statistikaIgracaService
                        .getIgracUtakmica(this.gostujuciIgraciStats[i].id, this.utakmicaId)
                        .subscribe((igracPreUpdate) => {
                          this.statistikaIgracaService
                            .updateIgracPlusMinus(
                              igracPreUpdate.id,
                              this.utakmicaId,
                              igracPreUpdate.plusMinus + 1,
                            )
                            .subscribe((msg) => {});
                        });
                      this.gostujuciIgraciStats[i].plusMinus++;
                    }
                    if (i == 0) {
                      this.plusMinusUkupnoGosti = 0;
                    }
                    this.plusMinusUkupnoGosti += this.gostujuciIgraciStats[i].plusMinus;
                  }

                  for (let i = 0; i < this.domaciIgraciStats.length; i++) {
                    if (
                      this.igracNaTerenuTrenutak(
                        dogadjaj.cetvrtina,
                        this.vremeUSekunde(dogadjaj.vreme),
                        this.domaciIgraciStats[i].id,
                      )
                    ) {
                      this.statistikaIgracaService
                        .getIgracUtakmica(this.domaciIgraciStats[i].id, this.utakmicaId)
                        .subscribe((igracPreUpdate) => {
                          this.statistikaIgracaService
                            .updateIgracPlusMinus(
                              igracPreUpdate.id,
                              this.utakmicaId,
                              igracPreUpdate.plusMinus - 1,
                            )
                            .subscribe((msg) => {});
                        });
                      this.domaciIgraciStats[i].plusMinus++;
                    }
                    if (i == 0) {
                      this.plusMinusUkupnoDomaci = 0;
                    }
                    this.plusMinusUkupnoDomaci += this.domaciIgraciStats[i].plusMinus;
                  }
                } else {
                  this.utakmiceService
                    .updatePoeniUtakmicaGost(this.utakmicaId, this.poeniGost - 1)
                    .subscribe((msg) => {
                      this.poeniGost--;
                    });
                  for (let i = 0; i < this.domaciIgraciStats.length; i++) {
                    if (
                      this.igracNaTerenuTrenutak(
                        dogadjaj.cetvrtina,
                        this.vremeUSekunde(dogadjaj.vreme),
                        this.domaciIgraciStats[i].id,
                      )
                    ) {
                      this.statistikaIgracaService
                        .getIgracUtakmica(this.domaciIgraciStats[i].id, this.utakmicaId)
                        .subscribe((igracPreUpdate) => {
                          this.statistikaIgracaService
                            .updateIgracPlusMinus(
                              igracPreUpdate.id,
                              this.utakmicaId,
                              igracPreUpdate.plusMinus + 1,
                            )
                            .subscribe((msg) => {});
                        });
                      this.domaciIgraciStats[i].plusMinus++;
                    }
                    if (i == 0) {
                      this.plusMinusUkupnoDomaci = 0;
                    }
                    this.plusMinusUkupnoDomaci += this.domaciIgraciStats[i].plusMinus;
                  }

                  for (let i = 0; i < this.gostujuciIgraciStats.length; i++) {
                    if (
                      this.igracNaTerenuTrenutak(
                        dogadjaj.cetvrtina,
                        this.vremeUSekunde(dogadjaj.vreme),
                        this.gostujuciIgraciStats[i].id,
                      )
                    ) {
                      this.statistikaIgracaService
                        .getIgracUtakmica(this.gostujuciIgraciStats[i].id, this.utakmicaId)
                        .subscribe((igracPreUpdate) => {
                          this.statistikaIgracaService
                            .updateIgracPlusMinus(
                              igracPreUpdate.id,
                              this.utakmicaId,
                              igracPreUpdate.plusMinus - 1,
                            )
                            .subscribe((msg) => {});
                        });
                      this.gostujuciIgraciStats[i].plusMinus--;
                    }
                    if (i == 0) {
                      this.plusMinusUkupnoGosti = 0;
                    }
                    this.plusMinusUkupnoGosti += this.gostujuciIgraciStats[i].plusMinus;
                  }
                }
                if (deleteStatIgrac.slobodnoPogodak > 1 || deleteStatIgrac.slobodnoPromasaj > 1) {
                  deleteStatIgrac.slobodnoProcenat =
                    (deleteStatIgrac.slobodnoPogodak /
                      (deleteStatIgrac.slobodnoPogodak + deleteStatIgrac.slobodnoPromasaj)) *
                    100;
                } else {
                  deleteStatIgrac.slobodnoProcenat = 0;
                }
                break;
              }
              case 'FT Miss': {
                deleteStatIgrac.slobodnoPromasaj--;
                deleteStatIgrac.indeks++;
                if (deleteStatIgrac.slobodnoPogodak > 1 || deleteStatIgrac.slobodnoPromasaj > 1) {
                  deleteStatIgrac.slobodnoProcenat =
                    (deleteStatIgrac.slobodnoPogodak /
                      (deleteStatIgrac.slobodnoPogodak + deleteStatIgrac.slobodnoPromasaj)) *
                    100;
                } else {
                  deleteStatIgrac.slobodnoProcenat = 0;
                }
                break;
              }
              case 'Off Rebound': {
                deleteStatIgrac.skokoviNapad--;
                deleteStatIgrac.skokoviUkupno--;
                deleteStatIgrac.indeks--;
                break;
              }
              case 'Def Reb': {
                deleteStatIgrac.skokoviOdbrana--;
                deleteStatIgrac.skokoviUkupno--;
                deleteStatIgrac.indeks--;
                break;
              }
              case 'Assist': {
                deleteStatIgrac.asistencije--;
                deleteStatIgrac.indeks--;
                break;
              }
              case 'Steal': {
                deleteStatIgrac.ukradene--;
                deleteStatIgrac.indeks--;
                break;
              }
              case 'Turnover': {
                deleteStatIgrac.izgubljene--;
                deleteStatIgrac.indeks++;
                break;
              }
              case 'Block': {
                deleteStatIgrac.blokade--;
                deleteStatIgrac.indeks--;
                break;
              }
              case 'Shot Rejected': {
                deleteStatIgrac.blokadePrimljene--;
                break;
              }
              case 'Foul drawn': {
                deleteStatIgrac.iznudjeniFaulovi--;
                deleteStatIgrac.indeks--;
                break;
              }
              case 'Foul': {
                deleteStatIgrac.licneGreske--;
                deleteStatIgrac.indeks++;
                break;
              }
              default:
                break;
            }
            if (cetvrtinaDeleted == 1) {
              this.utakmicaDogadjajiService
                .getAllDogadjajiCetvrtina(this.utakmicaId, 1)
                .subscribe((dogadajiAfter) => {
                  this.dogadjajiPrvaCetvrtina = dogadajiAfter;
                });
            } else if (cetvrtinaDeleted == 2) {
              this.utakmicaDogadjajiService
                .getAllDogadjajiCetvrtina(this.utakmicaId, 2)
                .subscribe((dogadajiAfter) => {
                  this.dogadjajiDrugaCetvrtina = dogadajiAfter;
                });
            } else if (cetvrtinaDeleted == 3) {
              this.utakmicaDogadjajiService
                .getAllDogadjajiCetvrtina(this.utakmicaId, 3)
                .subscribe((dogadajiAfter) => {
                  this.dogadjajiTrecaCetvrtina = dogadajiAfter;
                });
            } else if (cetvrtinaDeleted == 4) {
              this.utakmicaDogadjajiService
                .getAllDogadjajiCetvrtina(this.utakmicaId, 4)
                .subscribe((dogadajiAfter) => {
                  this.dogadjajiCetvrtaCetvrtina = dogadajiAfter;
                });
            } else if (cetvrtinaDeleted > 4) {
              this.utakmicaDogadjajiService
                .getAllDogadjajiProduzeci(this.utakmicaId)
                .subscribe((dogadajiAfter) => {
                  this.dogadjajiProduzetak = dogadajiAfter;
                });
            }
            this.utakmicaDogadjajiService
              .getAllDogadjaji(this.utakmicaId)
              .subscribe((dogadjajiAfter) => {
                this.sviDogadjaji = dogadjajiAfter;
              });
            this.statistikaIgracaService
              .updateIgracStatistika(
                deleteStatIgrac.id,
                deleteStatIgrac.utakmicaId,
                deleteStatIgrac.poeni,
                deleteStatIgrac.dvaPoenaPogodak,
                deleteStatIgrac.dvaPoenaPromasaj,
                deleteStatIgrac.dvaPoenaProcenat,
                deleteStatIgrac.triPoenaPogodak,
                deleteStatIgrac.triPoenaPromasaj,
                deleteStatIgrac.triPoenaProcenat,
                deleteStatIgrac.slobodnoPogodak,
                deleteStatIgrac.slobodnoPromasaj,
                deleteStatIgrac.slobodnoProcenat,
                deleteStatIgrac.skokoviNapad,
                deleteStatIgrac.skokoviOdbrana,
                deleteStatIgrac.skokoviUkupno,
                deleteStatIgrac.asistencije,
                deleteStatIgrac.ukradene,
                deleteStatIgrac.izgubljene,
                deleteStatIgrac.blokade,
                deleteStatIgrac.blokadePrimljene,
                deleteStatIgrac.licneGreske,
                deleteStatIgrac.iznudjeniFaulovi,
                deleteStatIgrac.indeks,
                deleteStatIgrac.plusMinus,
              )
              .subscribe((msg) => {
                if (deleteStatIgrac.klub == this.domacin) {
                  this.izracunajUkupnoDomaciStats();
                } else {
                  this.izracunajUkupnoGostiStats();
                }
              });
          } else {
            console.log('Error');
          }
        });
    });
  }

  zavrsi() {
    // prvo osveži minute na tačne vrednosti

    this.utakmiceService.getUtakmica(this.utakmicaId).subscribe((data) => {
      if (data.status == 'u toku') {
        this.azurirajMinuteSvih();

        const trenutno = this.apsolutnoVreme(
          this.tajmerService.cetvrtina,
          this.tajmerService.vreme,
        );

        // upiši minute svih igrača u bazu
        [...this.domaciIgraciStats, ...this.gostujuciIgraciStats].forEach((igrac) => {
          const sekundi = this.izracunajMinute(igrac.id, trenutno);
          const minutiString = this.formatMinute(sekundi);
          this.statistikaIgracaService
            .updateIgracMinuti(igrac.id, this.utakmicaId, minutiString)
            .subscribe();
        });

        // zaustavi tajmer i sačuvaj finalno stanje
        this.tajmerService.pauziraj();
        this.utakmiceService
          .updateTajmer(
            this.utakmicaId,
            this.tajmerService.vreme,
            this.tajmerService.cetvrtina,
            false,
          )
          .subscribe();

        // označi utakmicu kao završenu
        if (this.trener.klub == this.domacin) {
          if (this.poeniDomacin > this.poeniGost) {
            this.utakmiceService.zavrsiUtakmicu(this.utakmicaId, 'pobeda').subscribe();
          } else if (this.poeniDomacin < this.poeniGost) {
            this.utakmiceService.zavrsiUtakmicu(this.utakmicaId, 'poraz').subscribe();
          } else if (this.poeniDomacin == this.poeniGost) {
            this.utakmiceService.zavrsiUtakmicu(this.utakmicaId, 'nereseno').subscribe();
          }
        } else if (this.trener.klub == this.gost) {
          if (this.poeniDomacin < this.poeniGost) {
            this.utakmiceService.zavrsiUtakmicu(this.utakmicaId, 'pobeda').subscribe();
          } else if (this.poeniDomacin > this.poeniGost) {
            this.utakmiceService.zavrsiUtakmicu(this.utakmicaId, 'poraz').subscribe();
          } else if (this.poeniDomacin == this.poeniGost) {
            this.utakmiceService.zavrsiUtakmicu(this.utakmicaId, 'nereseno').subscribe();
          }
        }
      }
      alert(
        'Utakmica je zavrsena: ' +
          this.domacin +
          ' ' +
          this.poeniDomacin +
          '-' +
          this.poeniGost +
          ' ' +
          this.gost,
      );
    });
  }
  logOut() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }
  postaviTab(tab: string) {
    this.aktivanTab = tab;
  }
  prikaziPotvrdu: boolean = false;
  otvoriPotvrdu() {
    this.prikaziPotvrdu = true;
  }

  zatvoriPotvrdu() {
    this.prikaziPotvrdu = false;
  }
  potvrdiIzlaz() {
    this.prikaziPotvrdu = false;
    if (this.tajmerService.radi) {
      this.tajmerService.pauziraj(); // pauziraj pre izlaska
    }
    this.router.navigate(['/trener-pocetna']);
  }
}
