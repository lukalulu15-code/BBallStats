import { TestBed } from '@angular/core/testing';

import { UtakmicaDogadjajiService } from './utakmica-dogadjaji-service';

describe('UtakmicaDogadjajiService', () => {
  let service: UtakmicaDogadjajiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtakmicaDogadjajiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
