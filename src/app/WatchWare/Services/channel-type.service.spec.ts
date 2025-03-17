import { TestBed } from '@angular/core/testing';

import { ChannelTypeService } from './channel-type.service';

describe('ChannelTypeService', () => {
  let service: ChannelTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
