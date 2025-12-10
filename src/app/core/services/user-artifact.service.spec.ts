import { TestBed } from '@angular/core/testing';

import { UserArtifactService } from './user-artifact.service';

describe('UserArtifactService', () => {
  let service: UserArtifactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserArtifactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
