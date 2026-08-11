import { TestBed } from '@angular/core/testing';

import { ProtivnickiIgraciService } from './protivnicki-igraci-service';

describe('ProtivnickiIgraciService', () => {
  let service: ProtivnickiIgraciService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProtivnickiIgraciService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
