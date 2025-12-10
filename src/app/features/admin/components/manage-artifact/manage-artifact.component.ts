import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { ArtifactService } from 'src/app/core/services/artifact.service';
import { ArtifactTable } from 'src/app/core/interfaces/artifact-table';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-artifact',
  templateUrl: './manage-artifact.component.html',
  styleUrls: ['./manage-artifact.component.css'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule,
      MatInputModule, NgIf, ReactiveFormsModule, MatSnackBarModule]
})
export class ManageArtifactComponent implements OnInit {
  imageBase64: string | null = null; 
  imageToUpdate: string | null = null;

  updateButton: boolean = false;
  
  updateData: ArtifactTable | null = null;

  setForm: FormGroup;

  nameSetFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  flowerFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  featherFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  sandsFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  gobletFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  circletFormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  ngOnInit(): void {
    const artifactSetToUpdate = this.artifact.getArtifactSetToUpdate();

    if (artifactSetToUpdate) {
      this.nameSetFormControl.setValue(artifactSetToUpdate.set);

      this.flowerFormControl.setValue(artifactSetToUpdate.flower.pieceName);
      this.featherFormControl.setValue(artifactSetToUpdate.feather.pieceName);
      this.sandsFormControl.setValue(artifactSetToUpdate.sands.pieceName);
      this.gobletFormControl.setValue(artifactSetToUpdate.goblet.pieceName);
      this.circletFormControl.setValue(artifactSetToUpdate.circlet.pieceName);
      
      // get .png file
      this.imageToUpdate = artifactSetToUpdate?.image;
      let fileIndex = String(this.imageToUpdate).lastIndexOf('/');
      let fileName = this.imageToUpdate.slice(fileIndex + 1);
      this.imageToUpdate = fileName;

      // shows the image
      this.imageBase64 = artifactSetToUpdate?.image;   

      this.updateData = artifactSetToUpdate;
      this.artifact.clearArtifactSetToUpdate();

      this.updateButton = true;
    } else {
      this.updateButton = false;
    }
  }

  constructor(private artifact: ArtifactService,
    private router: Router,
    private snackBar: MatSnackBar) { 
      this.setForm = new FormGroup({
        set: this.nameSetFormControl,
        flower: this.flowerFormControl,
        feather: this.featherFormControl,
        sands: this.sandsFormControl,
        goblet: this.gobletFormControl,
        circlet: this.circletFormControl
      });
  }

  addArtifactSet(): void {
    const credentials = this.setForm;

    if (!this.imageBase64) {
      this.openSnackBar('La imagen es obligatoria', 'Aceptar');

      return;
    }

    if (credentials.valid) {
      const artifactSet = {
        setName: String(this.nameSetFormControl.value),
        setImage: String(this.imageBase64)
      };

      const artifactPieces = [
        {
          pieceType: 'flower',
          pieceName: String(this.flowerFormControl.value)
        },
        {
          pieceType: 'feather',
          pieceName: String(this.featherFormControl.value)
        },
        {
          pieceType: 'sands',
          pieceName: String(this.sandsFormControl.value)
        },
        {
          pieceType: 'goblet',
          pieceName: String(this.gobletFormControl.value)
        },
        {
          pieceType: 'circlet',
          pieceName: String(this.circletFormControl.value)
        }
      ];
      
      const body = {
        artifactSet,
        artifactPieces
      };

      this.artifact.addArtifactSet(body).subscribe({
        next: (response) => {
          this.openSnackBar('Set de artefactos agregado con éxito', 'Aceptar');

          this.redirectToTableArtifacts();
        },
        error: (err) => {
          console.error(err);
          
          this.openSnackBar('No se pudo agregar el set de artefactos', 'Aceptar');
        }
      });
    }
  }

  updateArtifactSet(): void {
    const artifactSetToUpdate = this.updateData;
    const credentials = this.setForm;
    let imageToSend: string;
    

    if (!this.imageToUpdate) {
      this.openSnackBar('La imagen es obligatoria', 'Aceptar');

      return;
    }

    if (this.imageBase64?.startsWith('data:image')) {
        imageToSend = this.imageBase64;
      } else {
        imageToSend = this.imageToUpdate;
      }
    
    if (credentials.valid && artifactSetToUpdate) {
      const artifactSet = {
        setName: String(this.nameSetFormControl.value),
        setImage: imageToSend
      };

      const artifactPieces = [
        {
          id: artifactSetToUpdate.flower.id,
          pieceType: 'flower',
          pieceName: String(this.flowerFormControl.value)
        },
        {
          id: artifactSetToUpdate.feather.id,
          pieceType: 'feather',
          pieceName: String(this.featherFormControl.value)
        },
        {
          id: artifactSetToUpdate.sands.id,
          pieceType: 'sands',
          pieceName: String(this.sandsFormControl.value)
        },
        {
          id: artifactSetToUpdate.goblet.id,
          pieceType: 'goblet',
          pieceName: String(this.gobletFormControl.value)
        },
        {
          id: artifactSetToUpdate.circlet.id,
          pieceType: 'circlet',
          pieceName: String(this.circletFormControl.value)
        }
      ];
      
      const body = {
        artifactSet,
        artifactPieces
      };
      

      this.artifact.updateArtifactSet(body, artifactSetToUpdate.id).subscribe({
        next: (response) => {
          this.openSnackBar('Set de artefactos actualizado con éxito', 'Aceptar');

          this.redirectToTableArtifacts();
        },
        error: (err) => {
          console.error(err);
          
          this.openSnackBar('No se pudo actualizar el set de artefactos', 'Aceptar');
        }
      });
    }
  }

  cancel(): void {
    window.location.reload();
  }

  redirectToTableArtifacts(): void {
    this.router.navigate(['/table-artifact']);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (file.size > 1024 * 1024) { 
        console.error('El archivo es demasiado grande (máx 1MB).');
        this.openSnackBar('El archivo es demasiado grande (máx 1MB).', 'Aceptar');
        this.imageBase64 = null;
        return;
      }
      
      this.convertToBase64(file);
    }
  }

  convertToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageBase64 = reader.result as string;
    };

    reader.onerror = (error) => {
      console.error('Error al leer el archivo:', error);
      this.openSnackBar('Error al leer el archivo', 'Aceptar');
      this.imageBase64 = null;
    };

    reader.readAsDataURL(file);
  }

  private openSnackBar(message: string, action: string = 'Cerrar', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}