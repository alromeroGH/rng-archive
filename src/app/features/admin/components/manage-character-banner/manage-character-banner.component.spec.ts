import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCharacterBannerComponent } from './manage-character-banner.component';

describe('ManageCharacterBannerComponent', () => {
  let component: ManageCharacterBannerComponent;
  let fixture: ComponentFixture<ManageCharacterBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageCharacterBannerComponent]
    });
    fixture = TestBed.createComponent(ManageCharacterBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
