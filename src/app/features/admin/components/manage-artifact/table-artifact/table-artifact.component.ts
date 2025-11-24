import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { ArtifactTable } from 'src/app/core/interfaces/artifact-table';
import { ArtifactService } from 'src/app/core/services/artifact.service';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-table-artifact',
  templateUrl: './table-artifact.component.html',
  styleUrls: ['./table-artifact.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSnackBarModule]
})
export class TableArtifactsComponent {
  ARTIFACT_DATA: ArtifactTable[] = [];

  displayedColumns: string[] = ['set', 'flower', 'feather', 'sands', 'goblet', 'circlet', 'image', 'modify', 'delete'];
  dataSource = new MatTableDataSource(this.ARTIFACT_DATA);

  constructor(private artifact: ArtifactService,
      private router: Router,
      private snackBar: MatSnackBar) { 
      this.listArtifactSets();
  }

  listArtifactSets(): void {
    this.artifact.listArtifactSets().subscribe({
      next: (response) => {
        for (let i = 0; i < response.length; i++) {
          const rawItem = response[i];
          this.ARTIFACT_DATA.push({
            id: Number(rawItem.artifactSet.id),
            set: String(rawItem.artifactSet.setName),
            image: String(rawItem.artifactSet.setImage),
            flower: {id: rawItem.artifactPieces[0].id, pieceName: rawItem.artifactPieces[0].pieceName},
            feather: {id: rawItem.artifactPieces[1].id, pieceName: rawItem.artifactPieces[1].pieceName},
            sands: {id: rawItem.artifactPieces[2].id, pieceName: rawItem.artifactPieces[2].pieceName},
            goblet: {id: rawItem.artifactPieces[3].id, pieceName: rawItem.artifactPieces[3].pieceName},
            circlet: {id: rawItem.artifactPieces[4].id, pieceName: rawItem.artifactPieces[4].pieceName}
          });
        }

        this.dataSource = new MatTableDataSource(this.ARTIFACT_DATA);
        
      },
      error: (err) => {
        console.error(err);

      }
    });
  }

  updateArtifactSet(data: ArtifactTable): void {
    this.artifact.setArtifactSetToUpdate(data);

    this.redirectToManageArtifact();
  }

  deleteArtifactSet(id: number):void {
    if (confirm('Desea eliminar el set de artefactos?')) {
      this.artifact.deleteArtifactSet(id).subscribe({
        next: (response) => {
          this.openSnackBar('Noticia eliminada con éxito', 'Aceptar');

          this.listArtifactSets();
        },
        error: (err) => {
          console.error(err);
          
          this.openSnackBar('Error al eliminar el set de artefactos', 'Aceptar');
        }
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  redirectToManageArtifact(): void {
    this.router.navigate(['/manage-artifact']);
  }

  private openSnackBar(message: string, action: string = 'Cerrar', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}