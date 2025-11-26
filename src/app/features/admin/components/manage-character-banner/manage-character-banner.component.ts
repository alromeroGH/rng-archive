import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Phase } from 'src/app/core/interfaces/phase';
import { Character } from 'src/app/core/interfaces/character';
import { CharacterBannerTable } from 'src/app/core/interfaces/character-banner-table';
import { UnitService } from 'src/app/core/services/unit.service';
import { CharacterBannerService } from 'src/app/core/services/character-banner.service';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-character-banner',
  templateUrl: './manage-character-banner.component.html',
  styleUrls: ['./manage-character-banner.component.css'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, NgIf, NgFor, ReactiveFormsModule, 
    MatSnackBarModule, MatDatepickerModule, MatNativeDateModule]
})
export class ManageCharacterBannerComponent implements OnInit {
  VERSION_REGEX = /^\d\.\d$/; 

  imageBase64: string | null = null; 
  imageToUpdate: string | null = null;

  updateButton: boolean = false;
    
  updateData: CharacterBannerTable | null = null;

  characterBannerForm: FormGroup;

  bannerNameFormControl = new FormControl('', [Validators.required]);

  bannerVersionFormControl = new FormControl('', [Validators.required, Validators.pattern(this.VERSION_REGEX)]);

  bannerPhaseFormControl = new FormControl<Phase | null>(null, Validators.required);
  phase: Phase[] = [
    {
      name: 'Primera fase',
      value: '1'
    },
    {
      name: 'Segunda fase',
      value: '2'
    }
  ]

  bannerStartDateFormControl = new FormControl<Date | null>(null, Validators.required);

  bannerFiveStarFormControl = new FormControl<Character | null>(null, Validators.required);

  bannerFourStarOneFormControl = new FormControl<Character | null>(null, Validators.required);
  bannerFourStarTwoFormControl = new FormControl<Character | null>(null, Validators.required);
  bannerFourStarThreeFormControl = new FormControl<Character | null>(null, Validators.required);

  fiveStars: Character[] = [];

  fourStars: Character[] = [];

  ngOnInit(): void {
    this.getCharacters().subscribe({
        next: () => {
          this.listCharacterBannerToUpdate();
        },
        error: (err) => {
            console.error(err);
        }
    });
  }

  constructor(private unit: UnitService,
    private characterBanner: CharacterBannerService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.characterBannerForm = new FormGroup({
      name: this.bannerNameFormControl ,
      version: this.bannerVersionFormControl,
      phase: this.bannerPhaseFormControl,
      startDate: this.bannerStartDateFormControl,
      fiveStarCharacter: this.bannerFiveStarFormControl,
      fourStarCharacterOne: this.bannerFourStarOneFormControl,
      fourStarCharacterTwo: this.bannerFourStarTwoFormControl,
      fourStarCharacterThree: this.bannerFourStarThreeFormControl,
    });
  }

  addCharacterBanner(): void {
    const credentials = this.characterBannerForm;

    if (this.bannerFourStarOneFormControl.value?.id === this.bannerFourStarTwoFormControl.value?.id
      || this.bannerFourStarOneFormControl.value?.id === this.bannerFourStarThreeFormControl.value?.id
      || this.bannerFourStarTwoFormControl.value?.id === this.bannerFourStarThreeFormControl.value?.id
    ) {
      this.openSnackBar('personajes 4 estrellas repetidos', 'Aceptar');

      return;
    }

    if (!this.imageBase64) {
      this.openSnackBar('La imagen es obligatoria', 'Aceptar');

      return;
    }
    
    if (credentials.valid && this.bannerStartDateFormControl.value) {
      const body = {
        bannerName: String(this.bannerNameFormControl.value),
        bannerVersion: String(this.bannerVersionFormControl.value),
        bannerPhase: String(this.bannerPhaseFormControl.value?.value),
        bannerStartDate: this.bannerStartDateFormControl.value,
        fiveStarCharacterId: Number(this.bannerFiveStarFormControl.value?.id),
        fourStarCharacterIds: [
          Number(this.bannerFourStarOneFormControl.value?.id),
          Number(this.bannerFourStarTwoFormControl.value?.id),
          Number(this.bannerFourStarThreeFormControl.value?.id)
        ],
        bannerImage: this.imageBase64
      };

      this.characterBanner.addCharacterBanner(body).subscribe({
        next: (response) => {
          this.openSnackBar('Banner de personajes agregado con éxito', 'Aceptar');

          this.redirectToTableCharacterBanner();
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar('No se pudo agregar el banner de personajes', 'Aceptar');
        }
      });
    }
  }

  updateCharacterBanner(): void {
    const chracterBannerToUpdate = this.updateData;
    const credentials = this.characterBannerForm;
    let imageToSend;

    if (!this.imageToUpdate) {
      this.openSnackBar('La imagen es obligatoria', 'Aceptar');

      return;
    }

    if (this.imageBase64?.startsWith('data:image')) {
      imageToSend = this.imageBase64;
    } else {
      imageToSend = this.imageToUpdate;
    }

    if (credentials.valid && chracterBannerToUpdate
      && this.bannerStartDateFormControl.value
    ) {
      const body = {
        bannerName: String(this.bannerNameFormControl.value),
        bannerVersion: String(this.bannerVersionFormControl.value),
        bannerPhase: String(this.bannerPhaseFormControl.value?.value),
        bannerStartDate: this.bannerStartDateFormControl.value,
        fiveStarCharacterId: Number(this.bannerFiveStarFormControl.value?.id),
        fourStarCharacterIds: [
          Number(this.bannerFourStarOneFormControl.value?.id),
          Number(this.bannerFourStarTwoFormControl.value?.id),
          Number(this.bannerFourStarThreeFormControl.value?.id)
        ],
        bannerImage: imageToSend
      };
      
      this.characterBanner.updateCharacteBanner(body, chracterBannerToUpdate.id).subscribe({
        next: (response) => {
          this.openSnackBar('Banner de personajes actualizado con éxito', 'Aceptar');

          this.redirectToTableCharacterBanner();
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar('No se pudo actualizar el banner de personajes', 'Aceptar');
        }
       });
    }
  }

  cancel(): void {
    window.location.reload();
  }

  redirectToTableCharacterBanner(): void {
    this.router.navigate(['/table-character-banner']);
  }

  getCharacters(): Observable<any> {
    return this.unit.listUnits().pipe(
      map(response => {
        this.fiveStars = [];
        this.fourStars = [];
        
        for (let i = 0; i < response.length; i++) {
          const rawItem = response[i];
          if (rawItem.unitType === 'CHARACTER' && rawItem.unitBanner === 'CHARACTER'
             && rawItem.numberOfStars === 'FIVE_STARS') {
            this.fiveStars.push({
              id: Number(rawItem.id),
              name: String(rawItem.unitName)
            });
          } else if (rawItem.unitType === 'CHARACTER' && rawItem.numberOfStars === 'FOUR_STARS') {
            this.fourStars.push({
              id: Number(rawItem.id),
              name: String(rawItem.unitName)
            });
          }
        }
        this.fiveStars.sort((a, b) => a.name.localeCompare(b.name));
        this.fourStars.sort((a, b) => a.name.localeCompare(b.name));
      })
    ); 
  }

  listCharacterBannerToUpdate(): void {
    const characterBannerToUpdate = this.characterBanner.getCharacterBannerToUpdate();
    
    if (characterBannerToUpdate) {
      
      this.bannerNameFormControl.setValue(characterBannerToUpdate.characterBannerName);
      this.bannerVersionFormControl.setValue(characterBannerToUpdate.bannerVersion);

      let convertBannerPhase: string | null = null;

      if (characterBannerToUpdate.bannerPhase === 'ONE') {
        convertBannerPhase = '1';
      } else if (characterBannerToUpdate.bannerPhase === 'TWO') {
        convertBannerPhase = '2';
      }

      const selectedPhaseBanner = this.phase.find(
        type => type.value  === convertBannerPhase
      );

      if (selectedPhaseBanner) {
        this.bannerPhaseFormControl.setValue(selectedPhaseBanner);
      }

      this.bannerStartDateFormControl.setValue(characterBannerToUpdate.bannerStartDate);

      const selectedFiveStarsCharacter = this.fiveStars.find(
        type => type.id  === characterBannerToUpdate.fiveStars.id
      );

      if (selectedFiveStarsCharacter) {
        this.bannerFiveStarFormControl.setValue(selectedFiveStarsCharacter);
      }

      const selectedFourStarsOne = this.fourStars.find(
        type => type.id  === characterBannerToUpdate.fourStars[0].id
      );

      if (selectedFourStarsOne) {
        this.bannerFourStarOneFormControl.setValue(selectedFourStarsOne);
      }

      const selectedFourStarsTwo = this.fourStars.find(
        type => type.id  === characterBannerToUpdate.fourStars[1].id
      );

      if (selectedFourStarsTwo) {
        this.bannerFourStarTwoFormControl.setValue(selectedFourStarsTwo);
      }

      const selectedFourStarsThree = this.fourStars.find(
        type => type.id  === characterBannerToUpdate.fourStars[2].id
      );

      if (selectedFourStarsThree) {
        this.bannerFourStarThreeFormControl.setValue(selectedFourStarsThree);
      }

      // get .png file
      this.imageToUpdate = characterBannerToUpdate?.bannerImage;
      let fileIndex = String(this.imageToUpdate).lastIndexOf('/');
      let fileName = this.imageToUpdate.slice(fileIndex + 1);
      this.imageToUpdate = fileName;

      // shows the image
      this.imageBase64 = characterBannerToUpdate?.bannerImage;

      this.updateData = characterBannerToUpdate;

      this.characterBanner.clearCharacterBannerToUpdate();

      this.updateButton = true;
    } else {
      this.updateButton = false;
    }
  }

  comparePhaseBanner = (option: Phase, value: Phase | null): boolean => {
    if (!value || !option) {
      return false;
    }
    
    return option.value === value.value;
  };

  compareCharacterBanner = (option: Character, value: Character | null): boolean => {
    if (!value || !option) {
      return false;
    }
    
    return option.id === value.id;
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