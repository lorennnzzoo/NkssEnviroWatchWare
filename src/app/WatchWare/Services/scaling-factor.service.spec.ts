import { TestBed } from '@angular/core/testing';

import { ScalingFactorService } from './scaling-factor.service';

describe('ScalingFactorService', () => {
  let service: ScalingFactorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScalingFactorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
