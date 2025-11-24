import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableArtifactsComponent } from './table-artifact.component';

describe('TableArtifactsComponent', () => {
  let component: TableArtifactsComponent;
  let fixture: ComponentFixture<TableArtifactsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableArtifactsComponent]
    });
    fixture = TestBed.createComponent(TableArtifactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
