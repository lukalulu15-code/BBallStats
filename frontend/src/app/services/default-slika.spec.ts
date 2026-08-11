import { TestBed } from '@angular/core/testing';

import { DefaultSlika } from './default-slika';

describe('DefaultSlika', () => {
  let service: DefaultSlika;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultSlika);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
