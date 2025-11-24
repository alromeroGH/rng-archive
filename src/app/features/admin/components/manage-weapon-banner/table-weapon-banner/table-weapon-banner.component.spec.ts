import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWeaponBannerComponent } from './table-weapon-banner.component';

describe('TableWeaponBannerComponent', () => {
  let component: TableWeaponBannerComponent;
  let fixture: ComponentFixture<TableWeaponBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableWeaponBannerComponent]
    });
    fixture = TestBed.createComponent(TableWeaponBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
