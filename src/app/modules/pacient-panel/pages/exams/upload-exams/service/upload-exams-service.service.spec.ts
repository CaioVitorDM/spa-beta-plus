import { TestBed } from '@angular/core/testing';

import { UploadExamsServiceService } from './upload-exams-service.service';

describe('UploadExamsServiceService', () => {
  let service: UploadExamsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadExamsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
