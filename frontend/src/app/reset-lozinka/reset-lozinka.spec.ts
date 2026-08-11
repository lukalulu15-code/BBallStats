import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetLozinka } from './reset-lozinka';

describe('ResetLozinka', () => {
  let component: ResetLozinka;
  let fixture: ComponentFixture<ResetLozinka>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetLozinka]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetLozinka);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
