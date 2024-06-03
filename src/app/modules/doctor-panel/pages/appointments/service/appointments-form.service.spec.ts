import { TestBed } from '@angular/core/testing';

import { AppointmentsFormService } from './appointments-form.service';

describe('AppointmentsFormService', () => {
  let service: AppointmentsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentsFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
