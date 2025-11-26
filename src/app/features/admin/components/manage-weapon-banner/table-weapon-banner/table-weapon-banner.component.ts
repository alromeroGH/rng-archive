import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { WeaponBannerTable } from 'src/app/core/interfaces/weapon-banner-table';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { WeaponBannerService } from 'src/app/core/services/weapon-banner.service';

@Component({
  selector: 'app-table-weapon-banner',
  templateUrl: './table-weapon-banner.component.html',
  styleUrls: ['./table-weapon-banner.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSnackBarModule]
})
export class TableWeaponBannerComponent {
  WEAPON_BANNER_DATA: WeaponBannerTable[] = [];
      
  displayedColumns: string[] = ['weaponBannerName', 'bannerPhase', 'bannerVersion', 'bannerStartDate', 'fiveStars', 'fourStars', 'bannerImage', 'modify', 'delete'];
  dataSource = new MatTableDataSource(this.WEAPON_BANNER_DATA);

  constructor(private weaponBanner: WeaponBannerService,
    private router: Router,
    private snackBar: MatSnackBar) { 
      this.listWeaponBanners();
  }

  listWeaponBanners(): void {
    this.weaponBanner.listWeaponBanner().subscribe({
      next: (response) => {
        this.WEAPON_BANNER_DATA = [];
        for (let i = 0; i < response.length; i++) {
          const rawItem = response[i];
          
          this.WEAPON_BANNER_DATA.push({
            id: Number(rawItem.id),
            weaponBannerName: String(rawItem.bannerName),
            bannerPhase: rawItem.bannerPhase,
            bannerVersion: rawItem.bannerVersion,
            bannerStartDate: rawItem.bannerStartDate,
            fiveStars: [
              {
                id: Number(rawItem.fiveStarWeapons[0].id), 
                unitName: String(rawItem.fiveStarWeapons[0].unitName)
              },
              {
                id: Number(rawItem.fiveStarWeapons[1].id), 
                unitName: String(rawItem.fiveStarWeapons[1].unitName)
              }
            ],
            fourStars: [
              {
                id: rawItem.fourStarWeapons[0].id,
                unitName: String(rawItem.fourStarWeapons[0].unitName)
              },
              {
                id: rawItem.fourStarWeapons[1].id,
                unitName: String(rawItem.fourStarWeapons[1].unitName)
              },
              {
                id: rawItem.fourStarWeapons[2].id,
                unitName: String(rawItem.fourStarWeapons[2].unitName)
              },
              {
                id: rawItem.fourStarWeapons[3].id,
                unitName: String(rawItem.fourStarWeapons[3].unitName)
              },
              {
                id: rawItem.fourStarWeapons[4].id,
                unitName: String(rawItem.fourStarWeapons[4].unitName)
              }
            ],
            bannerImage: String(rawItem.bannerImage)
          });          
        }

        this.dataSource = new MatTableDataSource(this.WEAPON_BANNER_DATA);
        
      },
      error: (err) => {
        console.error(err);
        
      }
    });
  }

  updateWeaponBanner(data: WeaponBannerTable): void {
    this.weaponBanner.setWeaponBannerToUpdate(data);

    this.redirectToManageWeaponBanner();
  }

  deleteWeaponBanner(id: number): void {
    if (confirm('Desea eliminar el banner de armas?')) {
      this.weaponBanner.deleteWeaponBanner(id).subscribe({
        next: (response) => {
          this.openSnackBar('Banner de armas eliminado con éxito', 'Aceptar');

          this.listWeaponBanners();
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar('Error al eliminar el banner de armas', 'Aceptar');
        }
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  redirectToManageWeaponBanner(): void {
    this.router.navigate(['/manage-weapon-banner']);
  }

  private openSnackBar(message: string, action: string = 'Cerrar', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
