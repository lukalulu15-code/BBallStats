import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrenerStatistika } from './trener-statistika';

describe('TrenerStatistika', () => {
  let component: TrenerStatistika;
  let fixture: ComponentFixture<TrenerStatistika>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrenerStatistika]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrenerStatistika);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
