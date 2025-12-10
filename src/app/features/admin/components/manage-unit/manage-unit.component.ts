import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { UnitType } from 'src/app/core/interfaces/unit-type';
import { NumberOfStars } from 'src/app/core/interfaces/number-of-stars';
import { BannerType } from 'src/app/core/interfaces/banner-type';
import { UnitTable } from 'src/app/core/interfaces/unit-table';
import { UnitService } from 'src/app/core/services/unit.service';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-unit',
  templateUrl: './manage-unit.component.html',
  styleUrls: ['./manage-unit.component.css'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, NgIf, NgFor, ReactiveFormsModule, MatSnackBarModule]
})
export class ManageUnitComponent implements OnInit {
  imageBase64: string | null = null; 
  imageToUpdate: string | null = null;

  updateButton: boolean = false;
  
  updateData:  UnitTable | null = null;

  unitForm: FormGroup;

  unitTypeFormControl = new FormControl<UnitType | null>(null, Validators.required);

  unitType: UnitType[] = [
    {name: 'Personaje 🧑', value: 'character'},
    {name: 'Arma ⚔️', value: 'weapon'}
  ];

  unitNameFormControl = new FormControl('', [Validators.required]);
  
  numberOfStarsFormControl  = new FormControl<NumberOfStars | null>(null, Validators.required);

  numberOfStars: NumberOfStars[] = [
    {name: 'Tres estrellas ⭐⭐⭐', value: '3'},
    {name: 'Cuatro estrellas ⭐⭐⭐⭐', value: '4'},
    {name: 'Cinco  estrellas ⭐⭐⭐⭐⭐', value: '5'}
  ];

  bannerTypeFormControl  = new FormControl<BannerType | null>(null, Validators.required);

  bannerType: BannerType[] = [
    {name: 'Personaje promocional', value: 'character'},
    {name: 'Arma promocional', value: 'weapon'},
    {name: 'Todos', value: 'all'}
  ];

  ngOnInit(): void {
    const unitToUpdate = this.unit.getUnitToUpdate();

    if (unitToUpdate) {
      this.unitNameFormControl.setValue(unitToUpdate.unitName);

      const selectedUnitType = this.unitType.find(
        type => type.value  === unitToUpdate.unitType.toLowerCase()
      );

      if (selectedUnitType) {
        this.unitTypeFormControl.setValue(selectedUnitType);
      }

      let convertNumberOfStars: string | null = null;

      if (unitToUpdate.numberOfStars == 'THREE_STARS') {
        convertNumberOfStars = '3';
      } else if (unitToUpdate.numberOfStars == 'FOUR_STARS') {
        convertNumberOfStars = '4';
      } else if (unitToUpdate.numberOfStars == 'FIVE_STARS') {
        convertNumberOfStars = '5';
      }

      const selectednumberOfStars = this.numberOfStars.find(
        type => type.value  === convertNumberOfStars
      );

      if (selectednumberOfStars) {
        this.numberOfStarsFormControl.setValue(selectednumberOfStars);
      }

      const selectedBannerType = this.bannerType.find(
        type => type.value  === unitToUpdate.unitBanner.toLowerCase()
      );

      if (selectedBannerType) {
        this.bannerTypeFormControl.setValue(selectedBannerType);
      }

      // get .png file
      this.imageToUpdate = unitToUpdate?.unitImage;
      let fileIndex = String(this.imageToUpdate).lastIndexOf('/');
      let fileName = this.imageToUpdate.slice(fileIndex + 1);
      this.imageToUpdate = fileName;

      // shows the image
      this.imageBase64 = unitToUpdate?.unitImage;

      this.updateData = unitToUpdate;

      this.unit.clearUnitToUpdate();

      this.updateButton = true;
    } else {
      this.updateButton = false;
    }
  }

  constructor(private unit: UnitService,
    private router: Router,
    private snackBar: MatSnackBar) { 
    this.unitForm = new FormGroup({
      type: this.unitTypeFormControl,
      name: this.unitNameFormControl,
      numberOfStars: this.numberOfStarsFormControl,
      bannerType: this.bannerTypeFormControl
    });
  }

  addUnit(): void {
    const credentials = this.unitForm;

    if (!this.imageBase64) {
      this.openSnackBar('La imagen es obligatoria', 'Aceptar');

      return;
    }

    if (credentials.valid) {
      const body = {
        unitType: String(this.unitTypeFormControl.value?.value),
        unitName: String(this.unitNameFormControl.value),
        numberOfStars: String(this.numberOfStarsFormControl.value?.value),
        unitBanner: String(this.bannerTypeFormControl.value?.value),
        unitImage: String(this.imageBase64)
      }
        
      this.unit.addUnit(body).subscribe({
        next: (response) => {
          this.openSnackBar('Unidad agregada con éxito', 'Aceptar');

          this.redirectToTableUnit();
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar('No se pudo agregar la unidad', 'Aceptar');
        }
      });
    }
  }

  updateUnit(): void {
    const unitToUpdate = this.updateData;
    const credentials = this.unitForm;
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
      
    if (credentials.valid && unitToUpdate) {
      const body = {
        unitType: String(this.unitTypeFormControl.value?.value),
        unitName: String(this.unitNameFormControl.value),
        numberOfStars: String(this.numberOfStarsFormControl.value?.value),
        unitBanner: String(this.bannerTypeFormControl.value?.value),
        unitImage: imageToSend
      }

      this.unit.updateUnit(body, unitToUpdate.id).subscribe({
        next: (response) => {
          this.openSnackBar('Unidad actualizada con éxito', 'Aceptar');

          this.redirectToTableUnit();
          
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar('No se pudo actualizar la unidad', 'Aceptar');
        }
      });
    }
  }

  cancel(): void {
    window.location.reload();
  }

  redirectToTableUnit(): void {
    this.router.navigate(['/table-unit']);
  }

  compareUnitType = (option: UnitType, value: UnitType | null): boolean => {
    if (!value || !option) {
      return false;
    }
    return option.value === value.value;
  };

  compareNumberOfStars = (option: NumberOfStars, value: NumberOfStars | null): boolean => {
    if (!value || !option) {
      return false;
    }
    return option.value === value.value;
  };

  compareBannerType = (option: BannerType, value: BannerType | null): boolean => {
    if (!value || !option) {
      return false;
    }
    return option.value === value.value;
  };

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
