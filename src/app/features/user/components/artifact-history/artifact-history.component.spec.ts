import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtifactHistoryComponent } from './artifact-history.component';

describe('ArtifactHistoryComponent', () => {
  let component: ArtifactHistoryComponent;
  let fixture: ComponentFixture<ArtifactHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArtifactHistoryComponent]
    });
    fixture = TestBed.createComponent(ArtifactHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
