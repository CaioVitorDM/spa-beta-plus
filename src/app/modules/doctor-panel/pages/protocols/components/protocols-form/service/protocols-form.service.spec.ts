import { TestBed } from '@angular/core/testing';

import { ProtocolsFormService } from './protocols-form.service';

describe('ProtocolsFormService', () => {
  let service: ProtocolsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProtocolsFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
