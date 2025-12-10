import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserArtifactTable } from '../interfaces/user-artifact-table';
import { UserArtifact } from '../interfaces/user-artifact';


@Injectable({
  providedIn: 'root'
})
export class UserArtifactService {
  private userArtifactToEdit: UserArtifactTable | null = null;

  private userArtifactUrl = 'http://localhost:8080/api/userArtifact';

  constructor(private http: HttpClient) { }

  addUserArtifact(body: UserArtifact): Observable<any> {
    return this.http.post(`${this.userArtifactUrl}/create`, body);
  }

  listUserArtifact(): Observable<any> {
    return this.http.get(this.userArtifactUrl);
  }  

  updateUserArtifact(body: UserArtifact, id: number): Observable<any> {
    return this.http.post(`${this.userArtifactUrl}/update/${id}`, body);
  }  

  deleteUserArtifact(id: number): Observable<any> {
    return this.http.post(`${this.userArtifactUrl}/delete/${id}`, null);
  }

  setUserArtifactToUpdate(userArtifact: UserArtifactTable): void {
    this.userArtifactToEdit = userArtifact;
  }
  
  getUserArtifactToUpdate(): UserArtifactTable | null {
    return this.userArtifactToEdit;
  }

  clearUserArtifactToUpdate(): void {
    this.userArtifactToEdit = null;
  }
}
