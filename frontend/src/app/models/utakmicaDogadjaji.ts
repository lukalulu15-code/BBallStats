import { StatistikaIgraca } from "./statistkaIgraca";

export class UtakmicaDogadjaji{
    id:number=0;
    utakmicaId:number=0;
    domacin:string="";
    gost:string="";
    vreme:string="";
    cetvrtina:number=0;
    poeniDomacin:number=0;
    poeniGost:number=0;
    opis:string="";
    klub:string="";
    imeIgraca:string="";
    prezimeIgraca:string="";
    brojIgraca:number=0;
    igrac:StatistikaIgraca=new StatistikaIgraca();
}