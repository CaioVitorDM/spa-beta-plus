import { TestBed } from '@angular/core/testing';

import { BetaEditService } from './beta-edit.service';

describe('BetaEditService', () => {
  let service: BetaEditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BetaEditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
