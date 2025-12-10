import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { CharacterBannerService } from 'src/app/core/services/character-banner.service';
import { CharacterBannerTable } from 'src/app/core/interfaces/character-banner-table';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-table-character-banner',
  templateUrl: './table-character-banner.component.html',
  styleUrls: ['./table-character-banner.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSnackBarModule]
})
export class TableCharacterBannerComponent {
  CHARACTER_BANNER_DATA: CharacterBannerTable[] = [];
    
  displayedColumns: string[] = ['characterBannerName', 'bannerPhase', 'bannerVersion', 'bannerStartDate', 'fiveStars', 'fourStars', 'bannerImage', 'modify', 'delete'];
  dataSource = new MatTableDataSource(this.CHARACTER_BANNER_DATA);

  constructor(private characterBanner: CharacterBannerService,
    private router: Router,
    private snackBar: MatSnackBar) { 
      this.listCharacterBanners();
  }

  listCharacterBanners(): void {
    this.characterBanner.listCharacterBanner().subscribe({
      next: (response) => {
        
        this.CHARACTER_BANNER_DATA = [];
        for (let i = 0; i < response.length; i++) {
          const rawItem = response[i];
          this.CHARACTER_BANNER_DATA.push({
            id: Number(rawItem.id),
            characterBannerName: String(rawItem.bannerName),
            bannerPhase: rawItem.bannerPhase,
            bannerVersion: rawItem.bannerVersion,
            bannerStartDate: rawItem.bannerStartDate,
            fiveStars: {
              id: Number(rawItem.fiveStarCharacter.id), 
              unitName: String(rawItem.fiveStarCharacter.unitName)
            },
            fourStars: [
              {
                id: rawItem.fourStarCharacters[0].id,
                unitName: String(rawItem.fourStarCharacters[0].unitName)
              },
              {
                id: rawItem.fourStarCharacters[1].id,
                unitName: String(rawItem.fourStarCharacters[1].unitName)
              },
              {
                id: rawItem.fourStarCharacters[2].id,
                unitName: String(rawItem.fourStarCharacters[2].unitName)
              }
            ],
            bannerImage: String(rawItem.bannerImage)
          });          
        }


        this.dataSource = new MatTableDataSource(this.CHARACTER_BANNER_DATA);
        
      },
      error: (err) => {
        console.error(err);
        
      }
    });
  }

  updateCharacterBanner(data: CharacterBannerTable): void {
    this.characterBanner.setCharacterBannerToUpdate(data);

    this.redirectToManageCharacterBanner();
  }

  deleteCharacterBanner(id: number): void {
    if (confirm('Desea eliminar el banner de personajes?')) {
      this.characterBanner.deleteCharacterBanner(id).subscribe({
        next: (response) => {
          this.openSnackBar('Banner de personajes eliminado con éxito', 'Aceptar');

          this.listCharacterBanners();
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar('Error al eliminar el banner de personajes', 'Aceptar');
        }
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  redirectToManageCharacterBanner(): void {
    this.router.navigate(['/manage-character-banner']);
  }

  private openSnackBar(message: string, action: string = 'Cerrar', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
