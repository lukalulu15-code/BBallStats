export class Utakmica{
    id:number=0;
    datum:string ="";
    vreme:string="";
    domacin:string="";
    gost:string="";
    takmicenje:string="";
    napomena:string="";
    trener:string="";
    poeniDomacin:number=0;
    poeniGost:number=0;
    status : string="";
    vremeTajmer:number=0;
    cetvrtina:number=0;
    tajmerRadi:boolean=false;
    poslednjiUpdate:Date|null=null;
    sezonaPocetak:number=0;
    sezonaKraj:number=0;
}
