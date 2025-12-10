import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PullTable } from 'src/app/core/interfaces/pull-table';
import { PullService } from 'src/app/core/services/pull.service';
@Component({
  selector: 'app-pull-history',
  templateUrl: './pull-history.component.html',
  styleUrls: ['./pull-history.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule,
    MatSnackBarModule]
})
export class PullHistoryComponent {
  PULL_DATA: PullTable[] = [];
    
  displayedColumns: string[] = ['type', 'name', 'unit', 'pullAmount', 'fiftyFifty', 'capturingRadiance', 'modify', 'delete'];
  dataSource = new MatTableDataSource(this.PULL_DATA);
  
  constructor(private pull: PullService,
    private router: Router,
    private snackBar: MatSnackBar) { 
    this.listPull();
  }

  listPull(): void {
    this.pull.listPull().subscribe({
      next: (response) => {
        this.PULL_DATA = [];
        for (let i = 0; i < response.length; i++) {
          const rawItem = response[i];
          this.PULL_DATA.push({
            id: Number(rawItem.id),
            banner: rawItem.bannerResponseDTO,
            unit: rawItem.unitResponseDTO,
            pullsAmount: rawItem.pullsAmount,
            fiftyFifty: rawItem.won,
            capturingRadiance: rawItem.activatedCapturingRadiance
          });
        }

        this.dataSource = new MatTableDataSource(this.PULL_DATA);

        this.dataSource.filterPredicate = this.getCustomFilterPredicate();
      },
      error: (err) => {
        console.error(err);
        
      }
    });
  }

  updatePull(data: PullTable): void {
    this.pull.setPullToUpdate(data);

    this.redirectToAddPull();
  }

  deletePull(id: number): void {
    if (confirm('¿Desea eliminar la tirada?')) {
      this.pull.deletePull(id).subscribe({
        next: (response) => {
          this.openSnackBar('Tirada eliminada con éxito', 'Aceptar');
  
          this.listPull();
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar('Error al eliminar la tirada', 'Aceptar');
        }
      });
    }
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCustomFilterPredicate() {
    const myFilterPredicate = (data: PullTable, filter: string): boolean => {
      const normalizedFilter = filter.trim().toLowerCase();
        
      const dataStr = (
        data.banner.bannerType + 
        data.banner.bannerName + 
        data.unit.unitName
      ).toLowerCase();

      return dataStr.includes(normalizedFilter);
    }
    return myFilterPredicate;
  }

  redirectToAddPull(): void {
    this.router.navigate(['/add-pull']);
  }

  private openSnackBar(message: string, action: string = 'Cerrar', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}