import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { UnitTable } from 'src/app/core/interfaces/unit-table';
import { UnitService } from 'src/app/core/services/unit.service';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-table-unit',
  templateUrl: './table-unit.component.html',
  styleUrls: ['./table-unit.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSnackBarModule]
})
export class TableUnitComponent {
  UNIT_DATA: UnitTable[] = [];
  
  displayedColumns: string[] = ['unitType', 'unitName', 'numberOfStars', 'unitBanner', 'unitImage', 'modify', 'delete'];
  dataSource = new MatTableDataSource(this.UNIT_DATA);

  constructor(private unit: UnitService,
    private router: Router,
    private snackBar: MatSnackBar) { 
      this.listUnits();
  }

  listUnits(): void {
    this.unit.listUnits().subscribe({
      next: (response) => {
        this.UNIT_DATA = [];
        for (let i = 0; i < response.length; i++) {

          const rawItem = response[i];

          this.UNIT_DATA.push({
            id: Number(rawItem.id),
            unitType: String(rawItem.unitType),
            unitName: String(rawItem.unitName),
            numberOfStars: String(rawItem.numberOfStars),
            unitBanner: String(rawItem.unitBanner),
            unitImage: String(rawItem.unitImage)
          });
        }

        this.dataSource = new MatTableDataSource(this.UNIT_DATA);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  updateUnit(data: UnitTable): void {
    this.unit.setUnitToUpdate(data);

    this.redirectToManageUnit();
  }

  deleteUnit(id: number): void {
    if (confirm('Desea eliminar la unidad?')) {
      this.unit.deleteUnit(id).subscribe({
        next: (response) => {
          this.openSnackBar('Unidad eliminada con éxito', 'Aceptar');
  
          this.listUnits();
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar('Error al eliminar la unidad', 'Aceptar');
        }
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  redirectToManageUnit(): void {
    this.router.navigate(['/manage-unit']);
  }

  private openSnackBar(message: string, action: string = 'Cerrar', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}