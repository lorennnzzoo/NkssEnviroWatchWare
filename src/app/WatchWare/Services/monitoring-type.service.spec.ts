import { TestBed } from '@angular/core/testing';

import { MonitoringTypeService } from './monitoring-type.service';

describe('MonitoringTypeService', () => {
  let service: MonitoringTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonitoringTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
