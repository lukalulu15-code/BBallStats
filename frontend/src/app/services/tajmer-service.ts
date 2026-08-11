import { Injectable } from '@angular/core';
import { UtakmicaLiveKrenula } from '../utakmica-live-krenula/utakmica-live-krenula';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TajmerService {
  vreme = 600; // 10 minuta u sekundama (jedna četvrtina)
  radi = false;
  cetvrtina = 1;
  private interval: any;

  vremePromena = new Subject<{vreme:number,cetvrtina:number}>();

  pokreni() {
    if (this.radi) return;
    this.radi = true;
    this.interval = setInterval(() => {
      if (this.vreme > 0) {
        this.vreme--;
        this.vremePromena.next({vreme:this.vreme,cetvrtina:this.cetvrtina})
        
      } else {
        this.pauziraj();
        this.shotPauziraj();
        // ovde možeš emitovati event da je četvrtina gotova
      }
    }, 1000);
  }

  pauziraj() {
    this.shotRadiVal = false;
    clearInterval(this.shotInterval);
    this.radi = false;
    clearInterval(this.interval);
  }

  reset() {
    this.pauziraj();
    this.vreme = 600;
    this.shotVremeVal=24;
  }

  sledecaCetvrtina() {
    if (this.cetvrtina < 4) {
      this.cetvrtina++;
      this.vreme = 600;
    } else {
      // produžetak - 5 minuta
      this.cetvrtina++;
      this.vreme = 300;
    }
    this.vremePromena.next({vreme:this.vreme,cetvrtina:this.cetvrtina})
  }

  prethodnaCetvrtina() {
  if (this.cetvrtina > 1) {
    this.cetvrtina--;
    // ako se vraćaš iz produžetka (cetvrtina je bila >4), vreme je 5 min, inače 10
    this.vreme = this.cetvrtina > 4 ? 300 : 600;
  }
  this.vremePromena.next({ vreme: this.vreme, cetvrtina: this.cetvrtina });
}

  // formatira u MM:SS
  get formatVreme(): string {
    const min = Math.floor(this.vreme / 60);
    const sec = this.vreme % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  shotVremeVal = 24;
  shotRadiVal = false;
  private shotInterval: any;

  shotVreme(): number {
    return this.shotVremeVal;
  }

  shotRadi(): boolean {
    return this.shotRadiVal;
  }

  shotPokreni() {
    if (this.shotRadiVal) return;
    this.shotRadiVal = true;
    this.shotInterval = setInterval(() => {
      if (this.shotVremeVal > 0) {
        this.shotVremeVal--;
      } else {
        this.shotPauziraj();
        // ovde možeš dodati zvuk/alert da je isteklo
      }
    }, 1000);
  }

  shotPauziraj() {
    this.shotRadiVal = false;
    clearInterval(this.shotInterval);
  }

  shotReset(sekundi: number) {
    this.shotVremeVal = sekundi;
  }
}
