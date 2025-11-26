import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Unit } from '../interfaces/unit';
import { UnitTable } from '../interfaces/unit-table';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  private unitToEdit: UnitTable | null = null;

  private unitUrl = 'http://localhost:8080/api/admin/unit';

  constructor(private http: HttpClient) { }

  addUnit(body: Unit): Observable<any> {
    return this.http.post(`${this.unitUrl}/create`, body);
  }

  listUnits(): Observable<any> {
    return this.http.get(this.unitUrl);
  }

  updateUnit(body: Unit, id: number): Observable<any> {
    return this.http.post(`${this.unitUrl}/update/${id}`, body);
  }

  deleteUnit(id: number): Observable<any> {
    return this.http.post(`${this.unitUrl}/delete/${id}`, null);
  }

  setUnitToUpdate(unit: UnitTable): void {
    this.unitToEdit = unit;
  }

  getUnitToUpdate(): UnitTable | null {
    return this.unitToEdit;
  }

  clearUnitToUpdate(): void {
    this.unitToEdit = null;
  }
}