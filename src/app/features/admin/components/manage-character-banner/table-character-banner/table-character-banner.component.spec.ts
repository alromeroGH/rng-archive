import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCharacterBannerComponent } from './table-character-banner.component';

describe('TableCharacterBannerComponent', () => {
  let component: TableCharacterBannerComponent;
  let fixture: ComponentFixture<TableCharacterBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableCharacterBannerComponent]
    });
    fixture = TestBed.createComponent(TableCharacterBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
