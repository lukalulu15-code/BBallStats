import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrtionStranica } from './registrtion-stranica';

describe('RegistrtionStranica', () => {
  let component: RegistrtionStranica;
  let fixture: ComponentFixture<RegistrtionStranica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrtionStranica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrtionStranica);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
