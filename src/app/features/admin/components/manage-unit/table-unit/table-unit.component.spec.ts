import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableUnitComponent } from './table-unit.component';

describe('TableUnitComponent', () => {
  let component: TableUnitComponent;
  let fixture: ComponentFixture<TableUnitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableUnitComponent]
    });
    fixture = TestBed.createComponent(TableUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
