import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

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
