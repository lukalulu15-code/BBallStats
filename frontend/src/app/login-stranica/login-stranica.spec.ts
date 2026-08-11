import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginStranica } from './login-stranica';

describe('LoginStranica', () => {
  let component: LoginStranica;
  let fixture: ComponentFixture<LoginStranica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginStranica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginStranica);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
