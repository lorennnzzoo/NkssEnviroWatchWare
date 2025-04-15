import { TestBed } from '@angular/core/testing';

import { PCBService } from './pcb.service';

describe('PCBService', () => {
  let service: PCBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PCBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
