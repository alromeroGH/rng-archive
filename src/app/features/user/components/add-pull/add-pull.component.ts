import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PullTable } from 'src/app/core/interfaces/pull-table';
import { BannerType } from 'src/app/core/interfaces/banner-type';
import { Banner, BannerMechanics } from 'src/app/core/interfaces/banner';
import { UnitBanner } from 'src/app/core/interfaces/unit';
import { PullService } from 'src/app/core/services/pull.service';
import { UserService } from 'src/app/core/services/user.service';
import { CharacterBannerService } from 'src/app/core/services/character-banner.service';
import { WeaponBannerService } from 'src/app/core/services/weapon-banner.service';
import { UnitService } from 'src/app/core/services/unit.service';

@Component({
  selector: 'app-add-pull',
  templateUrl: './add-pull.component.html',
  styleUrls: ['./add-pull.component.css'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, NgIf, NgFor, ReactiveFormsModule, MatSnackBarModule]
})
export class AddPullComponent implements OnInit {
  numberPattern = /^\d*$/;

  updateButton: boolean = false;
      
  updateData: PullTable | null = null;

  bannerType: string = '';

  pullForm: FormGroup;

  bannerTypeFormControl = new FormControl<BannerType | null>(null, Validators.required);

  type: BannerType[] = [
    {
      name: 'Personaje',
      value: 'limited_character'
    },
    {
      name: 'Arma (No forma parte del MVP)',
      value: 'weapon'
    }
  ];

  bannerNameFormControl = new FormControl<Banner | null>(null, Validators.required);

  banner: Banner[] = [];

  unitBannerFormControl = new FormControl<UnitBanner | null>(null, Validators.required);

  unitBanner: UnitBanner[] = [];

  pullAmountFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(this.numberPattern),
    Validators.min(1)]
  );
  
  fiftyFiftyFormControl = new FormControl<BannerMechanics | null>(null, Validators.required);

  capturingRadianceFormControl = new FormControl<BannerMechanics | null>(null, Validators.required);

  bannerMechanics: BannerMechanics[] =[
    {
      name: 'Ganó',
      win: true
    },
    {
      name: 'Perdió',
      win: false
    }
  ];

  ngOnInit(): void {
    this.bannerNameFormControl.disable();
    this.fiftyFiftyFormControl.disable();
    this.capturingRadianceFormControl.disable();
    this.unitBannerFormControl.disable();
    this.pullAmountFormControl.disable();

    this.listPullToUpdate();
  }

  constructor(private pull: PullService,
    private characterBanner: CharacterBannerService,
    private weaponBanner: WeaponBannerService,
    private unit: UnitService,
    private user: UserService,
    private router: Router,
    private snackBar: MatSnackBar) {
    this.pullForm = new FormGroup({
      bannerType: this.bannerTypeFormControl,
      bannerName: this.bannerNameFormControl,
      unitName: this.unitBannerFormControl,
      pullAmount: this.pullAmountFormControl,
      fiftyFifty: this.fiftyFiftyFormControl,
      capturingRadiance: this.capturingRadianceFormControl
    });
  }

   addPull(): void {
    const credentials = this.pullForm;

    if (this.bannerType === 'weapon') {
      this.openSnackBar('De momento no se pueden ingresar banners de armas', 'Aceptar');
      return;
    }

    if (this.bannerType === 'weapon' && Number(this.pullAmountFormControl.value) > 80) {
      this.openSnackBar('El banner de arma tiene un máximo de 80 tiradas', 'Aceptar');
      return;
    } else if (this.bannerType === 'limited_character' && Number(this.pullAmountFormControl.value) > 90) {
       this.openSnackBar('El banner de personajes tiene un máximo de 90 tiradas', 'Aceptar');
      return;
    }

    if (credentials.valid) {
      const body = {
        userId: Number(this.user.getId()),
        pullsAmount: Number(this.pullAmountFormControl.value),
        bannerId: Number(this.bannerNameFormControl.value?.bannerId),
        unitId: Number(this.unitBannerFormControl.value?.unitId),
        won: Boolean(this.fiftyFiftyFormControl.value?.win),
        activatedCapturingRadiance: Boolean(this.capturingRadianceFormControl.value?.win)
      }
      console.log(body);
      
      this.pull.addPull(body).subscribe({
        next: (response) => {
          this.openSnackBar('Tirada agregada con éxito', 'Aceptar');
          
          this.redirectToPullHistory();
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar('No se pudo agregar la tirada', 'Aceptar');
        }
      });
    }
  }

  updatePull(): void {
    const pullToUpdate = this.updateData;
    const credentials = this.pullForm;

    if (credentials.valid && pullToUpdate) {
      console.log(pullToUpdate);
      
       const body = {
          pullsAmount: Number(this.pullAmountFormControl.value),
          bannerId: Number(this.bannerNameFormControl.value?.bannerId),
          unitId: Number(this.unitBannerFormControl.value?.unitId),
          won: Boolean(this.fiftyFiftyFormControl.value?.win),
          activatedCapturingRadiance: Boolean(this.capturingRadianceFormControl.value?.win)
      }

      this.pull.updatePull(body, pullToUpdate.id).subscribe({
        next: (response) => {
          this.openSnackBar('Tirada actualizada con éxito', 'Aceptar');

          this.redirectToPullHistory();
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar('No se pudo actualizar la tirada', 'Aceptar');
        }
      });
    }
  }

  cancel(): void {
    window.location.reload();
  }

  redirectToPullHistory(): void {
    this.router.navigate(['/history-pull']);
  }

  getBanner(event: any): Observable<any> {
    this.banner = []
    this.bannerNameFormControl.enable();
    
    if (event.value === 'weapon') {
      this.bannerType = event.value;
      return this.weaponBanner.listWeaponBanner().pipe(
        map(response => {
          for (let i = 0; i < response.length; i++) {
            const rawItem = response[i];
            this.banner.push({
              bannerId: rawItem.id,
              bannerName: rawItem.bannerName,
              bannerVersion: rawItem.bannerVersion,
              bannerPhase: rawItem.bannerPhase,
              bannerImage: rawItem.bannerImage,
              fiveStar: [{
                id: rawItem.fiveStarWeapons[0].id,
                unitName: rawItem.fiveStarWeapons[0].unitName,
                unitImage: rawItem.fiveStarWeapons[0].unitImage
              },
              {
                id: rawItem.fiveStarWeapons[1].id,
                unitName: rawItem.fiveStarWeapons[1].unitName,
                unitImage: rawItem.fiveStarWeapons[1].unitImage
              }
            ]
            });
          }
        })
      );
    } else {
      this.bannerType = event.value;
      return this.characterBanner.listCharacterBanner().pipe(
        map(response => {
          for (let i = 0; i < response.length; i++) {
            const rawItem = response[i];
            this.banner.push({
              bannerId: rawItem.id,
              bannerName: rawItem.bannerName,
              bannerVersion: rawItem.bannerVersion,
              bannerPhase: rawItem.bannerPhase,
              bannerImage: rawItem.bannerImage,
              fiveStar: [{
                id: rawItem.fiveStarCharacter.id,
                unitName: rawItem.fiveStarCharacter.unitName,
                unitImage: rawItem.fiveStarCharacter.unitImage
              }]
            });
          }
        })
      );
    }
  }

  getUnit(): Observable<any> {
    let fiftyFiftyData = this.fiftyFiftyFormControl.value?.win;
    let capturingRadianceData = this.capturingRadianceFormControl.value?.win;

    this.unitBanner = [];
    this.fiftyFiftyFormControl.enable();
    this.capturingRadianceFormControl.enable();
    this.unitBannerFormControl.enable();
    this.pullAmountFormControl.enable();

    if (fiftyFiftyData === true && capturingRadianceData === true) {
      this.openSnackBar('No puede ganar tanto el 50/50 como Capturing Radiance', 'Aceptar');

      this.unitBannerFormControl.disable();
      this.pullAmountFormControl.disable();
    }

    return this.unit.listUnits().pipe(
      map(response => {
        for (let i = 0; i < response.length; i++) {
          const rawItem = response[i];
          if (this.bannerType === 'weapon' && 
            (fiftyFiftyData === true || capturingRadianceData == true)) {
            if (rawItem.numberOfStars === 'FIVE_STARS' && (rawItem.unitBanner === 'WEAPON')) {
              this.unitBanner.push({
                unitId: rawItem.id,
                unitName: rawItem.unitName
              });
            }
          } else  if (this.bannerType === 'limited_character' && 
            (fiftyFiftyData === true || capturingRadianceData == true)) {
            if (rawItem.numberOfStars === 'FIVE_STARS' && (rawItem.unitBanner === 'CHARACTER')) {
              this.unitBanner.push({
                unitId: rawItem.id,
                unitName: rawItem.unitName
              });
            }
          } else if (fiftyFiftyData === false && capturingRadianceData == false) {
            if (rawItem.numberOfStars === 'FIVE_STARS' && (rawItem.unitBanner === 'ALL')) {
              this.unitBanner.push({
                unitId: rawItem.id,
                unitName: rawItem.unitName
              });
            }
          }
        }
      })
    );
  }

  listPullToUpdate(): void {
    const pullToUpdate = this.pull.getPullToUpdate();

    if (pullToUpdate) {
      let type: BannerType = {name: '', value: ''};

      if (pullToUpdate.banner.bannerType === 'LIMITED_CHARACTER') {
        type = {name: '', value: 'limited_character'};
      }
      
      this.bannerTypeFormControl.setValue(type);

      this.getBanner(type).subscribe(() => {
        this.bannerNameFormControl.setValue(
          {
            bannerId: pullToUpdate.banner.id,
            bannerName: '',
            bannerVersion: '',
            bannerPhase: '',
            bannerImage: '',
            fiveStar: []
          }
        );
      });

      this.fiftyFiftyFormControl.setValue({name: '', win: pullToUpdate.fiftyFifty});
      this.capturingRadianceFormControl.setValue({name: '', win: pullToUpdate.capturingRadiance});

      this.getUnit().subscribe(() => {
        this.unitBannerFormControl.setValue({unitId: pullToUpdate.unit.id, unitName: ''});
      });

      this.pullAmountFormControl.setValue(String(pullToUpdate.pullsAmount))

      this.updateData = pullToUpdate;

      this.pull.clearPullToUpdate();

      this.updateButton = true;
    } else {
      this.updateButton = false;
    }
  }

  compareType = (option: BannerType, value: BannerType | null): boolean => {
    if (!value || !option) {
      return false;
    }
    return option.value === value.value;
  };

  compareBanner = (option: Banner, value: Banner | null): boolean => {
    if (!value || !option) {
      return false;
    }
    return option.bannerId === value.bannerId;
  };

  compareUnit = (option: UnitBanner, value: UnitBanner | null): boolean => {
    if (!value || !option) {
      return false;
    }
    
    return option.unitId === value.unitId;
  };

  compareBannerMechanics = (option: BannerMechanics, value: BannerMechanics | null): boolean => {
    if (!value || !option) {
      return false;
    }
    
    return option.win === value.win;
  };

  private openSnackBar(message: string, action: string = 'Cerrar', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}