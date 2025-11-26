import { TestBed } from '@angular/core/testing';

import { WeaponBannerService } from './weapon-banner.service';

describe('WeaponBannerService', () => {
  let service: WeaponBannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeaponBannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
