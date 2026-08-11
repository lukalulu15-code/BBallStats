import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrenerIzvestaj } from './trener-izvestaj';

describe('TrenerIzvestaj', () => {
  let component: TrenerIzvestaj;
  let fixture: ComponentFixture<TrenerIzvestaj>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrenerIzvestaj]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrenerIzvestaj);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
