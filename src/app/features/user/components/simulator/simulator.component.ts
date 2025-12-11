import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NgIf, NgFor, NgSwitch, CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { map, Observable } from 'rxjs';
import { SimulatorService } from 'src/app/core/services/simulator.service';
import { ResponseCharacterSimulator, ResponseWeaponSimulator } from 'src/app/core/interfaces/simulator';
import { UnitResponse } from 'src/app/core/interfaces/unit';
import { BannerType } from 'src/app/core/interfaces/banner-type';
import { Banner } from 'src/app/core/interfaces/banner';
import { CharacterBannerService } from 'src/app/core/services/character-banner.service';
import { WeaponBannerService } from 'src/app/core/services/weapon-banner.service';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css'],
    standalone: true,
    imports: [FormsModule, MatFormFieldModule, MatSelectModule,
      MatInputModule, CommonModule, NgIf, NgFor, NgSwitch, ReactiveFormsModule, 
      MatSnackBarModule, MatTableModule ]
})
export class SimulatorComponent implements OnInit {
  showForm: boolean = true;

  bannerType: string = '';

  SIMUALTOR_DATA: any = [];
    
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource(this.SIMUALTOR_DATA);

  units: UnitResponse[] = [];

  responseCharacterSimulator: ResponseCharacterSimulator = {
    units: this.units,
    pityCount: 0,
    primoCount: 0,
    winFiftyFiftyCount: 0,
    winCapturingRadianceCount: 0,
    lostFiftyFifty: false,
    fourStarPityCount: 0
  };

  responseWeaponSimulator: ResponseWeaponSimulator = {
    units: this.units,
    pityCount: 0,
    primoCount: 0,
    divinePathCount: 0,
    fourStarPityCount: 0
  };

  simulatorForm: FormGroup;

  bannerTypeFormControl = new FormControl<BannerType | null>(null, Validators.required);
  
  type: BannerType[] = [
   {
     name: 'Personaje',
     value: 'limited_character'
   },
   {
     name: 'Arma',
     value: 'weapon'
   }
  ];

  bannerFormControl = new FormControl<Banner | null>(null, Validators.required);
   
  banner: Banner[] = [];

  weaponFormControl = new FormControl<UnitResponse | null>(null, Validators.required);
   
  weapons: UnitResponse[] = [];

  ngOnInit(): void {
    this.bannerFormControl.disable();

    this.showForm = true;
  }

  constructor(private simulator: SimulatorService,
   private characterBanner: CharacterBannerService,
   private weaponBanner: WeaponBannerService,
   private snackBar: MatSnackBar
  ) {
   this.simulatorForm = new FormGroup({
     bannerType: this.bannerTypeFormControl,
     banner: this.bannerFormControl
   });
  }

  showSimulator(): void {
    const credentials = this.simulatorForm;
    if (credentials.valid && (this.bannerType === 'weapon' && this.weaponFormControl.valid)) {
      this.units = [];
      this.listSimulatorData();
      this.showForm = false;
    } else if (credentials.valid && this.bannerType === '') {
      this.units = [];
      this.listSimulatorData();
      this.showForm = false;
    }
  }

  getSimulator(summonAmount: number): void {
    if (this.bannerType === 'weapon') {
      const body = {
        bannerId: Number(this.bannerFormControl.value?.bannerId),
        summonAmount: Number(summonAmount),
        pityCount: Number(this.responseWeaponSimulator.pityCount),
        primoCount: Number(this.responseWeaponSimulator.primoCount),
        divinePathCount: Number(this.responseWeaponSimulator.divinePathCount),
        weaponSelected: Number(this.weaponFormControl.value?.id),
        fourStarPityCount: Number(this.responseWeaponSimulator.fourStarPityCount)
      }

      this.simulator.weaponSimulator(body).subscribe({
        next: (response) => {
          this.units = [];
          for (let i = 0; i < response.units.length; i++) {
            const rawItem = response.units[i];
  
            this.units.push(
              {
                id: rawItem.id,
                unitType: rawItem.unitType,
                unitName: rawItem.unitName,
                numberOfStars: rawItem.numberOfStars,
                unitBanner: rawItem.unitBanner,
                unitImage: rawItem.unitImage
              }
            )
          }
          
          this.responseWeaponSimulator = {
            units: this.units,
            pityCount: response.pityCount,
            primoCount: response.primoCount,
            divinePathCount: response.divinePathCount,
            fourStarPityCount: response.winFourStarCount
          };
          this.listSimulatorData();
          
        },
        error: (err) => {
          console.error(err);
          
        }
      });
    } else {
      const body = {
        bannerId: Number(this.bannerFormControl.value?.bannerId),
        summonAmount: Number(summonAmount),
        pityCount: Number(this.responseCharacterSimulator.pityCount),
        primoCount: Number(this.responseCharacterSimulator.primoCount),
        winFiftyFiftyCount: Number(this.responseCharacterSimulator.winFiftyFiftyCount),
        winCapturingRadianceCount: Number(this.responseCharacterSimulator.winCapturingRadianceCount),
        isLostFiftyFifty: Boolean(this.responseCharacterSimulator.lostFiftyFifty),
        fourStarPityCount: Number(this.responseCharacterSimulator.fourStarPityCount)
      }
  
      this.simulator.characterSimulator(body).subscribe({
        next: (response) => {
          this.units = [];
          for (let i = 0; i < response.units.length; i++) {
            const rawItem = response.units[i];
  
            this.units.push(
              {
                id: rawItem.id,
                unitType: rawItem.unitType,
                unitName: rawItem.unitName,
                numberOfStars: rawItem.numberOfStars,
                unitBanner: rawItem.unitBanner,
                unitImage: rawItem.unitImage
              }
            )
          }
  
          this.responseCharacterSimulator = {
            units: this.units,
            pityCount: response.pityCount,
            primoCount: response.primoCount,
            winFiftyFiftyCount: response.winFiftyFiftyCount,
            winCapturingRadianceCount: response.winCapturingRadianceCount,
            lostFiftyFifty: response.lostFiftyFifty,
            fourStarPityCount: response.winFourStarCount
          };
          this.listSimulatorData();
          
        },
        error: (err) => {
          console.error(err);
          
        }
      });
    }
  }

  getWeapon(event: any): void {
    if (event.value.bannerName === 'Epitome Invocation') {
      this.bannerType = 'weapon';
    } else {
      this.bannerType = '';
    }
    
    this.weaponBanner.listWeaponBanner().subscribe({
      next: (response) => {
        this.weapons = [];
        for (let i = 0; i < response.length; i++) {
          const rawItem = response[i];

          if (rawItem.id === event.value.bannerId) {
            for (let i = 0; i < rawItem.fiveStarWeapons.length; i++) {
              const fiveStarWeapons = rawItem.fiveStarWeapons[i];

              this.weapons.push({
                id: fiveStarWeapons.id,
                unitType: fiveStarWeapons.unitType,
                unitName: fiveStarWeapons.unitName,
                numberOfStars: fiveStarWeapons.numberOfStars,
                unitBanner: fiveStarWeapons.unitBanner,
                unitImage: fiveStarWeapons.unitImage
              });
            }
          }
        }
      },
      error: (err) => {
        console.error(err);
        
      }
    });
  }

  listSimulatorData(): void {
    if (this.bannerType === 'weapon') {
      this.displayedColumns = ['pityCount', 'primoCount', 'divinePathCount']

      this.SIMUALTOR_DATA = [{
        pityCount: this.responseWeaponSimulator.pityCount,
        primoCount: this.responseWeaponSimulator.primoCount,
        divinePathCount: this.responseWeaponSimulator.divinePathCount
      }]
  
      this.dataSource = new MatTableDataSource(this.SIMUALTOR_DATA);
    } else {
      this.displayedColumns = ['pityCount', 'primoCount', 'winFiftyFiftyCount', 'winCapturingRadianceCount']
      this.SIMUALTOR_DATA = [{
        pityCount: this.responseCharacterSimulator.pityCount,
        primoCount: this.responseCharacterSimulator.primoCount,
        winFiftyFiftyCount: this.responseCharacterSimulator.winFiftyFiftyCount,
        winCapturingRadianceCount: this.responseCharacterSimulator.winCapturingRadianceCount,
      }]
  
      this.dataSource = new MatTableDataSource(this.SIMUALTOR_DATA);
    }
  }

  cancel(): void {
   window.location.reload();
  }

  getBanner(event: any): Observable<any> {
    this.banner = []
    this.bannerFormControl.enable();
    
  if (event.value === 'weapon') {
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

  private openSnackBar(message: string, action: string = 'Cerrar', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
