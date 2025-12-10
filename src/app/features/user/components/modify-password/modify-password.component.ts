import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdminRoutingModule } from "src/app/features/admin/admin-routing.module";
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-modify-password',
  templateUrl: './modify-password.component.html',
  styleUrls: ['./modify-password.component.css'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, 
    ReactiveFormsModule, NgIf, AdminRoutingModule, MatSnackBarModule]
})
export class ModifyPasswordComponent {
  passwordForm: FormGroup;

  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

  newPasswordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

  newRePasswordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

  constructor(private user: UserService,
    private router: Router,
      private snackBar: MatSnackBar) {
      this.passwordForm = new FormGroup({
        currentPassword: this.passwordFormControl,
        newPassword: this.newPasswordFormControl
    });
  }

  modifyPassword(): void {
    const credentials = this.passwordForm;
    const id = this.user.getId();
    

    if (this.newPasswordFormControl.value !== this.newRePasswordFormControl.value) {
      this.openSnackBar('Las contraseñas no coinciden', 'Aceptar');
      return;
    }

    if (credentials.valid && id) {
      if (confirm('¿Está seguro de modificar la contraseña?')) {
        const body = {
          currentPassword: String(this.passwordFormControl.value),
          newPassword: String(this.newPasswordFormControl.value)
        };

        console.log(body);
        console.log(id);
        

        this.user.updateUserPassword(body, id).subscribe({
          next: (response) => {
            this.openSnackBar('Constraseña actualizada con éxito', 'Aceptar');

            this.redirectToProfile();
          },
          error: (err) => {
            console.error(err);
            this.openSnackBar('No se pudo actualizar la contraseña', 'Aceptar');
          }
        });
      }
    }
  }

  cancel(): void {
    if (confirm('¿Desea volver al perfil?\nLos datos que no se guarden se perderán')) {
      this.redirectToProfile();
    }
  }

  redirectToProfile(): void {
    this.router.navigate(['/profile']);
  }

  private openSnackBar(message: string, action: string = 'Cerrar', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}