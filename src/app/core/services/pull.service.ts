import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PullTable } from '../interfaces/pull-table';
import { Pull } from '../interfaces/pull';

@Injectable({
  providedIn: 'root'
})
export class PullService {
  private pullToEdit: PullTable | null = null;

  private pullUrl = 'http://localhost:8080/api/pull';

  constructor(private http: HttpClient) { }

  addPull(body: Pull): Observable<any> {
    return this.http.post(`${this.pullUrl}/create`, body);
  }

  listPull(): Observable<any> {
    return this.http.get(this.pullUrl);
  }  

  updatePull(body: Pull, id: number): Observable<any> {
    return this.http.post(`${this.pullUrl}/update/${id}`, body);
  }  

  deletePull(id: number): Observable<any> {
    return this.http.post(`${this.pullUrl}/delete/${id}`, null);
  }

  setPullToUpdate(pull: PullTable): void {
    this.pullToEdit = pull;
  }
  
  getPullToUpdate(): PullTable | null {
    return this.pullToEdit;
  }

  clearPullToUpdate(): void {
    this.pullToEdit = null;
  }
}