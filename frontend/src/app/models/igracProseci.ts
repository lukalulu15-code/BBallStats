import { Igrac } from './igrac';

export class IgracProseci {
  igrac: Igrac = new Igrac();
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
}
