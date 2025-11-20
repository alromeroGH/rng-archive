import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtifactStatisticsComponent } from './artifact-statistics.component';

describe('ArtifactStatisticsComponent', () => {
  let component: ArtifactStatisticsComponent;
  let fixture: ComponentFixture<ArtifactStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArtifactStatisticsComponent]
    });
    fixture = TestBed.createComponent(ArtifactStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
