import { TestBed } from '@angular/core/testing';

import { BetaExamsService } from './beta-exams.service';

describe('BetaExamsService', () => {
  let service: BetaExamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BetaExamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
