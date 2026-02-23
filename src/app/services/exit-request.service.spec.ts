import { TestBed } from '@angular/core/testing';

import { ExitRequestService } from './exit-request.service';

describe('ExitRequestService', () => {
  let service: ExitRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExitRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
