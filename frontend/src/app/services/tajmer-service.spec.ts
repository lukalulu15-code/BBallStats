import { TestBed } from '@angular/core/testing';

import { TajmerService } from './tajmer-service';

describe('TajmerService', () => {
  let service: TajmerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TajmerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
