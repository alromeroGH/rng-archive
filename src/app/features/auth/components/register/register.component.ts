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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, 
    ReactiveFormsModule, NgIf, AdminRoutingModule, MatSnackBarModule]
})
export class RegisterComponent {
  registerForm: FormGroup;

  userFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

  rePasswordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

  uidFormControl = new FormControl('', [
    Validators.required, 
    Validators.maxLength(9),
    Validators.pattern(/^[0-9]+$/)
  ]);

  constructor(private router: Router,
    private auth: AuthService,
    private snackBar: MatSnackBar) {
    this.registerForm = new FormGroup({
      userName: this.userFormControl,
      email: this.emailFormControl,
      password: this.passwordFormControl,
      uid: this.uidFormControl
    });
  }

  register(): void {
    const credentials = this.registerForm;

    if (this.passwordFormControl.value !== this.rePasswordFormControl.value) {
      this.openSnackBar('Las contraseñas no coinciden', 'Aceptar');
      return;

    } else if (credentials.valid) {
      const body = {
        userName: String(this.userFormControl.value),
        email: String(this.emailFormControl.value),
        password: String(this.passwordFormControl.value),
        uid: String(this.uidFormControl.value)
      };

      this.auth.register(body).subscribe({
      next: (response: string) => {
        this.openSnackBar('Usuario creado con éxito', 'Aceptar');
        
        this.router.navigate(['/login']);

      },
      error: (err) => {
        console.error('Error al registrar', err);
        this.openSnackBar('Error al registrar', 'Aceptar');
      }
      });

    } else {
      this.openSnackBar('Error al registrar', 'Aceptar');
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
