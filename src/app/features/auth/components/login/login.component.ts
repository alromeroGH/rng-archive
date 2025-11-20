import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdminRoutingModule } from "src/app/features/admin/admin-routing.module";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, 
    ReactiveFormsModule, NgIf, AdminRoutingModule, MatSnackBarModule]
})
export class LoginComponent {
  loginForm: FormGroup;

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  passwordFormControl = new FormControl('', [Validators.required, Validators.min(8)]);

  constructor(private router: Router,
    private auth: AuthService,
    private snackBar: MatSnackBar) {
    this.loginForm = new FormGroup({
      email: this.emailFormControl,
      password: this.passwordFormControl
    });
  }

  login(): void {
    const credentials = this.loginForm;
    
    if (credentials.valid) {
      const body = {
        email: String(this.emailFormControl.value),
        password: String(this.passwordFormControl.value)
      }

      this.auth.login(body).subscribe({
        next: (response) => {
          const userData = {
            id: Number(response.id),
            token: String(response.token),
            userName: String(response.userName),
            isAdmin: Boolean(response.admin)
          }

          this.auth.saveUserData(userData);
          
          this.router.navigate(['/']).then(() => {
            window.location.reload();
          });
          
        },
        error: (err) => {
          console.error('Login fail', err.error);
          this.openSnackBar('Usuario o contraseña incorrectos', 'Aceptar')

        },
      });
    }
  }

  private openSnackBar(message: string, action: string = 'Cerrar', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}