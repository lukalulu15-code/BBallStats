import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrenerProfil } from './trener-profil';

describe('TrenerProfil', () => {
  let component: TrenerProfil;
  let fixture: ComponentFixture<TrenerProfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrenerProfil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrenerProfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
