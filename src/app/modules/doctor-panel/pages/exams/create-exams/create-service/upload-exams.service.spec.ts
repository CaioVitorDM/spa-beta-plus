import { TestBed } from '@angular/core/testing';

import { UploadExamsService } from './upload-exams.service';

describe('UploadExamsService', () => {
  let service: UploadExamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadExamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
