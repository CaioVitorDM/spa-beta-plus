import { TestBed } from '@angular/core/testing';

import { BetaService } from './beta.service';

describe('BetaService', () => {
  let service: BetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
