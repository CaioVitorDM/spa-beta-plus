import { TestBed } from '@angular/core/testing';

import { PatientFormService } from './patient-form.service';

describe('PatientFormService', () => {
  let service: PatientFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
