import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrenerProfilIgraca } from './trener-profil-igraca';

describe('TrenerProfilIgraca', () => {
  let component: TrenerProfilIgraca;
  let fixture: ComponentFixture<TrenerProfilIgraca>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrenerProfilIgraca]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrenerProfilIgraca);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
