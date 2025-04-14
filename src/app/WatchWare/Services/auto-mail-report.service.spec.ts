import { TestBed } from '@angular/core/testing';

import { AutoMailReportService } from './auto-mail-report.service';

describe('AutoMailReportService', () => {
  let service: AutoMailReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoMailReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
