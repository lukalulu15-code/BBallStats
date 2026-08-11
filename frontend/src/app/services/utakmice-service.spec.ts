import { TestBed } from '@angular/core/testing';

import { UtakmiceService } from './utakmice-service';

describe('UtakmiceService', () => {
  let service: UtakmiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtakmiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
