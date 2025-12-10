import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserUpdate } from '../interfaces/user-update';
import { UserPasswordUpdate } from '../interfaces/user-password-update';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) { }

  getUserProfile(id: number): Observable<any> {
    return this.http.get(`${this.userUrl}/${id}`);
  }

  updateUserProfile(body: UserUpdate, id: number): Observable<any> {
    return this.http.post(`${this.userUrl}/update/${id}`, body);
  }

  updateUserPassword(body: UserPasswordUpdate, id: number): Observable<any> {
    return this.http.post(`${this.userUrl}/update/password/${id}`, body);
  }

  getId(): number | null {
    return Number(localStorage.getItem('id'));
  }

  getUsername(): string | null {
    return localStorage.getItem('user-name');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }
}
