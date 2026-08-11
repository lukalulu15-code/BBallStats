import { TestBed } from '@angular/core/testing';

import { SutService } from './sut-service';

describe('SutService', () => {
  let service: SutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
