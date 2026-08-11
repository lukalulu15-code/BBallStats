import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregledUtakmicaDetalji } from './pregled-utakmica-detalji';

describe('PregledUtakmicaDetalji', () => {
  let component: PregledUtakmicaDetalji;
  let fixture: ComponentFixture<PregledUtakmicaDetalji>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PregledUtakmicaDetalji]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PregledUtakmicaDetalji);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
