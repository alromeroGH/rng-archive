import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Login } from '../interfaces/login';
import { Register } from '../interfaces/register';
import { UserData } from '../interfaces/user-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:8080/api/auth/login';
  private registerUrl = 'http://localhost:8080/api/auth/register';

  constructor(private http: HttpClient,
    private router: Router
  ) { }

  login(body: Login): Observable<any> {
    return this.http.post(this.loginUrl, body);
  }

  register(body: Register): Observable<any> {
    return this.http.post(this.registerUrl, body, { responseType: 'text' } );
  }

  saveUserData(data: UserData): void {
    localStorage.setItem('id', String(data.id));
    localStorage.setItem('jwt', data.token);
    localStorage.setItem('user-name', data.userName);
    
    if (data.isAdmin) {
      localStorage.setItem('rol', 'admin')
    } else {
      localStorage.setItem('rol', 'user')
    }
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  logout(): void {
    localStorage.removeItem('id');
    localStorage.removeItem('jwt');
    localStorage.removeItem('user-name');
    localStorage.removeItem('rol');

    this.redirectToHome();
  }

  redirectToHome() {
    this.router.navigate(['/']);
  }
}
