import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtakmicaLiveKrenula } from './utakmica-live-krenula';

describe('UtakmicaLiveKrenula', () => {
  let component: UtakmicaLiveKrenula;
  let fixture: ComponentFixture<UtakmicaLiveKrenula>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtakmicaLiveKrenula]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtakmicaLiveKrenula);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
