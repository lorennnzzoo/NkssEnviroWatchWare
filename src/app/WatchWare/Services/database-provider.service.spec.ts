import { TestBed } from '@angular/core/testing';

import { DatabaseProviderService } from './database-provider.service';

describe('DatabaseProviderService', () => {
  let service: DatabaseProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
