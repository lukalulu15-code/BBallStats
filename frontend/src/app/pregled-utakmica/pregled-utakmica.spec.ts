import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregledUtakmica } from './pregled-utakmica';

describe('PregledUtakmica', () => {
  let component: PregledUtakmica;
  let fixture: ComponentFixture<PregledUtakmica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PregledUtakmica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PregledUtakmica);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
