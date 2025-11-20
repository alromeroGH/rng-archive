import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWeaponBannerComponent } from './manage-weapon-banner.component';

describe('ManageWeaponBannerComponent', () => {
  let component: ManageWeaponBannerComponent;
  let fixture: ComponentFixture<ManageWeaponBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageWeaponBannerComponent]
    });
    fixture = TestBed.createComponent(ManageWeaponBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
