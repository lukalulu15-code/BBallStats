import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrenerIgraci } from './trener-igraci';

describe('TrenerIgraci', () => {
  let component: TrenerIgraci;
  let fixture: ComponentFixture<TrenerIgraci>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrenerIgraci]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrenerIgraci);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
