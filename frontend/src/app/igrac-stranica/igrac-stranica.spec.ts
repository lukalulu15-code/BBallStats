import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IgracStranica } from './igrac-stranica';

describe('IgracStranica', () => {
  let component: IgracStranica;
  let fixture: ComponentFixture<IgracStranica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IgracStranica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IgracStranica);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
