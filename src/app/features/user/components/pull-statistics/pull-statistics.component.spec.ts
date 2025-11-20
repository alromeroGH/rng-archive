import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullStatisticsComponent } from './pull-statistics.component';

describe('PullStatisticsComponent', () => {
  let component: PullStatisticsComponent;
  let fixture: ComponentFixture<PullStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PullStatisticsComponent]
    });
    fixture = TestBed.createComponent(PullStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
