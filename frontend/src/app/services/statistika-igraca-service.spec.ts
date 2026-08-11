import { TestBed } from '@angular/core/testing';

import { StatistikaIgracaService } from './statistika-igraca-service';

describe('StatistikaIgraca', () => {
  let service: StatistikaIgracaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatistikaIgracaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
