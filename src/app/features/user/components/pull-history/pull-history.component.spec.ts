import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullHistoryComponent } from './pull-history.component';

describe('PullHistoryComponent', () => {
  let component: PullHistoryComponent;
  let fixture: ComponentFixture<PullHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PullHistoryComponent]
    });
    fixture = TestBed.createComponent(PullHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
