import { TestBed } from '@angular/core/testing';

import { PollutantDataService } from './pollutant-data.service';

describe('PollutantDataService', () => {
  let service: PollutantDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PollutantDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
