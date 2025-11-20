import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPullComponent } from './add-pull.component';

describe('AddPullComponent', () => {
  let component: AddPullComponent;
  let fixture: ComponentFixture<AddPullComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPullComponent]
    });
    fixture = TestBed.createComponent(AddPullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
