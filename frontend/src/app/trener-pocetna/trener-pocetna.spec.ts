import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrenerPocetna } from './trener-pocetna';

describe('TrenerPocetna', () => {
  let component: TrenerPocetna;
  let fixture: ComponentFixture<TrenerPocetna>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrenerPocetna]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrenerPocetna);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
