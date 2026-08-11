import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrenerShootingChart } from './trener-shooting-chart';

describe('TrenerShootingChart', () => {
  let component: TrenerShootingChart;
  let fixture: ComponentFixture<TrenerShootingChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrenerShootingChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrenerShootingChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
