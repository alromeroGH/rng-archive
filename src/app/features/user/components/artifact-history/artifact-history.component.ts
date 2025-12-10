import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { UserArtifactTable } from 'src/app/core/interfaces/user-artifact-table';
import { UserArtifactService } from 'src/app/core/services/user-artifact.service';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-artifact-history',
  templateUrl: './artifact-history.component.html',
  styleUrls: ['./artifact-history.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule,
    MatSnackBarModule]
})
export class ArtifactHistoryComponent {
  USER_ARTIFACT_DATA: UserArtifactTable[] = [];
  
  displayedColumns: string[] = ['set', 'piece', 'mainStat', 'secondaryStats', 'modify', 'delete'];
  dataSource = new MatTableDataSource(this.USER_ARTIFACT_DATA);

  constructor(private userArtifact: UserArtifactService,
    private router: Router,
    private snackBar: MatSnackBar) { 
    this.listUserArtifacts();
  }

  listUserArtifacts(): void {
    this.userArtifact.listUserArtifact().subscribe({
      next: (response) => {
        this.USER_ARTIFACT_DATA = [];
        for (let i = 0; i < response.length; i++) {
          const rawItem = response[i];
          
          this.USER_ARTIFACT_DATA.push({
            id: rawItem.id,
            set: {
              id: rawItem.artifactPiece.artifactSet.id,
              setName: rawItem.artifactPiece.artifactSet.setName,
              setImage: rawItem.artifactPiece.artifactSet.setImage
            },
            piece: {
              id: rawItem.artifactPiece.id,
              pieceType: rawItem.artifactPiece.pieceType,
              pieceName: rawItem.artifactPiece.pieceName
            },
            mainStat: {
              id: rawItem.mainStat.id,
              statName: rawItem.mainStat.statName,
              statType: rawItem.mainStat.statType
            },
            secondaryStats: [
              {
                id: rawItem.secondaryStats[0].stat.id,
                statName: rawItem.secondaryStats[0].stat.statName,
                statType: rawItem.secondaryStats[0].stat.statType
              },
              {
                id: rawItem.secondaryStats[1].stat.id,
                statName: rawItem.secondaryStats[1].stat.statName,
                statType: rawItem.secondaryStats[1].stat.statType
              },
              {
                id: rawItem.secondaryStats[2].stat.id,
                statName: rawItem.secondaryStats[2].stat.statName,
                statType: rawItem.secondaryStats[2].stat.statType
              },
              {
                id: rawItem.secondaryStats.length === 4? rawItem.secondaryStats[3].stat.id : '',
                statName: rawItem.secondaryStats.length === 4? rawItem.secondaryStats[3].stat.statName : '',
                statType: rawItem.secondaryStats.length === 4? rawItem.secondaryStats[3].stat.statType : ''
              }
            ]
          });
        }

        this.dataSource = new MatTableDataSource(this.USER_ARTIFACT_DATA);

        this.dataSource.filterPredicate = this.getCustomFilterPredicate();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  updateUserArtifacts(data: UserArtifactTable): void {
    this.userArtifact.setUserArtifactToUpdate(data);

    this.redirectToAddArtifact();
  }

  deleteUserArtifacts(id: number): void {
    if (confirm('¿Desea eliminar el artefacto?')) {
      this.userArtifact.deleteUserArtifact(id).subscribe({
        next: (response) => {
          this.openSnackBar('Artefacto eliminado con éxito', 'Aceptar');
  
          this.listUserArtifacts();
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar('Error al eliminar el artefacto', 'Aceptar');
        }
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCustomFilterPredicate() {
    const myFilterPredicate = (data: UserArtifactTable, filter: string): boolean => {
      const normalizedFilter = filter.trim().toLowerCase();

      const dataStr = (
        data.set.setName + 
        data.piece.pieceType + ' ' + data.piece.pieceName + 
        data.mainStat.statName + 
        data.secondaryStats.map(s => s.statName).join(' ')
      ).toLowerCase();

      return dataStr.includes(normalizedFilter);
    }
    return myFilterPredicate;
  }

  redirectToAddArtifact(): void {
    this.router.navigate(['/add-artifact']);
  }

  private openSnackBar(message: string, action: string = 'Cerrar', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}