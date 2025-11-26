import { TestBed } from '@angular/core/testing';

import { CharacterBannerService } from './character-banner.service';

describe('CharacterBannerService', () => {
  let service: CharacterBannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterBannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
