import { Component } from '@angular/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [NgSwitch, NgSwitchCase]
})
export class HeaderComponent implements OnInit {
  rol: string | null = 'guess';

  constructor(private auth: AuthService,
    private user: UserService,
    private router: Router  
  ) { }

  ngOnInit(): void {
    this.verifyRol();
  }

  verifyRol(): void {
    if (this.user.getRol() !== null) {
      this.rol = this.user.getRol();
    }
  }

  logout(): void {
    this.auth.logout();

    window.location.reload();
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  redirectToRegister(): void {
    this.router.navigate(['/register']);
  }

  redirectToProfile(): void {
    this.router.navigate(['/profile']);
  }
}