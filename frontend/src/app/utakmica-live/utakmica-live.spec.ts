import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtakmicaLive } from './utakmica-live';

describe('UtakmicaLive', () => {
  let component: UtakmicaLive;
  let fixture: ComponentFixture<UtakmicaLive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtakmicaLive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtakmicaLive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
