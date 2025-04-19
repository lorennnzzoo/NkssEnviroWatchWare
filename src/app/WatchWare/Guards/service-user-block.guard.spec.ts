import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { serviceUserBlockGuard } from './service-user-block.guard';

describe('serviceUserBlockGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => serviceUserBlockGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
