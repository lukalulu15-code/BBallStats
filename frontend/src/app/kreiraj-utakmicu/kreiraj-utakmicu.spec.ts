import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KreirajUtakmicu } from './kreiraj-utakmicu';

describe('KreirajUtakmicu', () => {
  let component: KreirajUtakmicu;
  let fixture: ComponentFixture<KreirajUtakmicu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KreirajUtakmicu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KreirajUtakmicu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
