import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdminRoutingModule } from "src/app/features/admin/admin-routing.module";
import { RouterLink } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, 
    ReactiveFormsModule, NgIf, AdminRoutingModule, MatSnackBarModule]
})
export class ProfileComponent implements OnInit {
  updateProfile: boolean = false;

  profileForm: FormGroup;

  userFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  uidFormControl = new FormControl('', [
    Validators.required, 
    Validators.maxLength(9),
    Validators.pattern(/^[0-9]+$/)
  ]);

  ngOnInit(): void {
    this.getUser();
    this.updateProfile = false;
    this.userFormControl.disable();
    this.emailFormControl.disable();
    this.uidFormControl.disable();
  }

  constructor(private user: UserService,
      private snackBar: MatSnackBar) {
      this.profileForm = new FormGroup({
        userName: this.userFormControl,
        email: this.emailFormControl,
        uid: this.uidFormControl
    });
  }

  modifyProfile(): void {
    const credentials = this.profileForm;
    const id = this.user.getId();

    if (credentials.valid && id) {
      if (confirm('¿Desea modificar los datos del perfil?')) {
        const body = {
          userName: String(this.userFormControl.value),
          email: String(this.emailFormControl.value),
          uid: String(this.uidFormControl.value)
        };
      
        this.user.updateUserProfile(body,id).subscribe({
          next: (response) => {
            this.openSnackBar('Perfil actualizado con éxito', 'Aceptar');
           
            this.ngOnInit();
           
            window.location.reload();
          },
          error: (err) => {
            console.error(err);
            this.openSnackBar('No se pudo actualizar el perfil', 'Aceptar');
          }
        });
      }
    }
  }

  enableInputs(): void {
    this.updateProfile = true;
    this.userFormControl.enable();
    this.emailFormControl.enable();
    this.uidFormControl.enable();
  }

  getUser(): void {
    let id = this.user.getId();
    if (id) {
      this.user.getUserProfile(id).subscribe({
        next: (response) => {
          this.userFormControl.setValue(response.userName);
          this.emailFormControl.setValue(response.email);
          this.uidFormControl.setValue(response.uid);
        },
        error: (err) => {
          console.error(err);
        }
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