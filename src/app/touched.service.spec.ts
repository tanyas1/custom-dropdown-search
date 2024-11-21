import { TestBed } from '@angular/core/testing';

import { TouchedService } from './touched.service';

describe('TouchedService', () => {
  let service: TouchedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TouchedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
