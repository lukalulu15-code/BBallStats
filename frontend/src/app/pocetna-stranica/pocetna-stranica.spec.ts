import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PocetnaStranica } from './pocetna-stranica';

describe('PocetnaStranica', () => {
  let component: PocetnaStranica;
  let fixture: ComponentFixture<PocetnaStranica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PocetnaStranica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PocetnaStranica);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
