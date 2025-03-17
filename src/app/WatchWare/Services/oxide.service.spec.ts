import { TestBed } from '@angular/core/testing';

import { OxideService } from './oxide.service';

describe('OxideService', () => {
  let service: OxideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OxideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
