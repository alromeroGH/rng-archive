import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNewsComponent } from './manage-news.component';

describe('ManageNewsComponent', () => {
  let component: ManageNewsComponent;
  let fixture: ComponentFixture<ManageNewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageNewsComponent]
    });
    fixture = TestBed.createComponent(ManageNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
