import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { UserArtifactTable } from 'src/app/core/interfaces/user-artifact-table';
import { GetArtifactPiece, GetArtifactSet } from 'src/app/core/interfaces/artifact';
import { Stat } from 'src/app/core/interfaces/stat';
import { ArtifactService } from 'src/app/core/services/artifact.service';
import { StatService } from 'src/app/core/services/stat.service';
import { UserArtifactService } from 'src/app/core/services/user-artifact.service';
import { UserService } from 'src/app/core/services/user.service';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-artifact',
  templateUrl: './add-artifact.component.html',
  styleUrls: ['./add-artifact.component.css'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, NgIf, NgFor, ReactiveFormsModule, MatSnackBarModule]
})
export class AddArtifactComponent implements OnInit {
  updateButton: boolean = false;
    
  updateData:  UserArtifactTable | null = null;

  ngOnInit(): void {
    this.pieceFormControl.disable();
    this.mainStatFormControl.disable();
    this.secondaryStatOneFormControl.disable();
    this.secondaryStatTwoFormControl.disable();
    this.secondaryStatThreeFormControl.disable();
    this.secondaryStatFourFormControl.disable();

    this.getSets().subscribe({
      next: (response) => {
        this.listUserArtifactToUpdate();
      },
      error: (err) => {
        console.error(err);
        
      }
    });
  }

  userArtifactForm: FormGroup;

  setFormControl = new FormControl<GetArtifactSet | null>(null, Validators.required);

  set: GetArtifactSet[] =[];

  pieceFormControl = new FormControl<GetArtifactPiece | null>(null, Validators.required);

  piece: GetArtifactPiece[] = [];

  mainStatFormControl = new FormControl<Stat | null>(null, Validators.required);

  mainStat: Stat[] = [];

  secondaryStatOneFormControl = new FormControl<Stat | null>(null, Validators.required);
  secondaryStatTwoFormControl = new FormControl<Stat | null>(null, Validators.required);
  secondaryStatThreeFormControl = new FormControl<Stat | null>(null, Validators.required);
  secondaryStatFourFormControl = new FormControl<Stat | null>(null, Validators.required);

  secondaryStats: Stat[] = [];

  constructor(private stat: StatService,
    private artifact: ArtifactService,
    private userArtifact: UserArtifactService,
    private user: UserService,
    private router: Router,
    private snackBar: MatSnackBar) {
    this.userArtifactForm = new FormGroup({
      set: this.setFormControl,
      piece: this.pieceFormControl,
      mainStat: this.mainStatFormControl,
      secondaryStatOne: this.secondaryStatOneFormControl,
      secondaryStatTwo: this.secondaryStatTwoFormControl,
      secondaryStatThree: this.secondaryStatThreeFormControl,
      secondaryStatFour: this.secondaryStatFourFormControl
    });
  }

  addUserArtifact(): void {
    const credentials = this.userArtifactForm;

    const secondaryStatSet = new Set([
      this.secondaryStatOneFormControl.value?.id,
      this.secondaryStatTwoFormControl.value?.id,
      this.secondaryStatThreeFormControl.value?.id,
      this.secondaryStatFourFormControl.value?.id
    ]);

    if (secondaryStatSet.size !== 4) {
      this.openSnackBar('Estadísticas secundarias repetidas', 'Aceptar');

      return;
    }

    if (credentials.valid) {
      const body = {
        userId: Number(this.user.getId()),
        mainStatId: Number(this.mainStatFormControl.value?.id),
        artifactPieceId: Number(this.pieceFormControl.value?.id),
        secondaryStatIds: [
          Number(this.secondaryStatOneFormControl.value?.id),
          Number(this.secondaryStatTwoFormControl.value?.id),
          Number(this.secondaryStatThreeFormControl.value?.id),
          Number(this.secondaryStatFourFormControl.value?.id)
        ]
      }

      this.userArtifact.addUserArtifact(body).subscribe({
        next: (response) => {
          this.openSnackBar('Artefacto agregado con éxito', 'Aceptar');
          
          this.redirectToArtifactHistory();
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar('No se pudo agregar el artefacto', 'Aceptar');
        }
      });
    }
  }

  updateUserArtifact(): void {
    const userArtifactToUpdate = this.updateData;
    const credentials = this.userArtifactForm;

    const secondaryStatSet = new Set([
      this.secondaryStatOneFormControl.value?.id,
      this.secondaryStatTwoFormControl.value?.id,
      this.secondaryStatThreeFormControl.value?.id,
      this.secondaryStatFourFormControl.value?.id
    ]);

    if (secondaryStatSet.size !== 4) {
      this.openSnackBar('Estadísticas secundarias repetidas', 'Aceptar');

      return;
    }

    if (credentials.valid && userArtifactToUpdate) {
       const body = {
        userId: Number(this.user.getId()),
        mainStatId: Number(this.mainStatFormControl.value?.id),
        artifactPieceId: Number(this.pieceFormControl.value?.id),
        secondaryStatIds: [
          Number(this.secondaryStatOneFormControl.value?.id),
          Number(this.secondaryStatTwoFormControl.value?.id),
          Number(this.secondaryStatThreeFormControl.value?.id),
          Number(this.secondaryStatFourFormControl.value?.id)
        ]
      }

      this.userArtifact.updateUserArtifact(body, userArtifactToUpdate.id).subscribe({
        next: (response) => {
          this.openSnackBar('Artefacto actualizado con éxito', 'Aceptar');

          this.redirectToArtifactHistory();
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar('No se pudo actualizar el artefacto', 'Aceptar');
        }
      });
    }
  }

  cancel(): void {
    window.location.reload();
  }

  redirectToArtifactHistory(): void {
    this.router.navigate(['/history-artifact']);
  }

  getSets(): Observable<any> {
    return this.artifact.listArtifactSets().pipe(
      map(response => {
        this.set = [];
        for (let i = 0; i < response.length; i++) {
          const rawItem = response[i];
          
          this.set.push({
            id: Number(rawItem.artifactSet.id),
            setName: String(rawItem.artifactSet.setName),
            setImage: String(rawItem.artifactSet.setImage)
          });
        }
      })
    );
  }

  getPieces(event: any): Observable<any> {    
    return this.artifact.listArtifactSets().pipe(
      map(response => {
        if (event !== undefined) {
          this.piece = [];
          this.pieceFormControl.enable();

          for (let i = 0; i < response.length; i++) {
            const rawItem = response[i];
            
            if (rawItem.artifactSet.id === event.id) {
              for (let i = 0; i < 5; i++) {
                this.piece.push({
                  id: Number(rawItem.artifactPieces[i].id),
                  pieceName: String(rawItem.artifactPieces[i].pieceName),
                  pieceType: String(rawItem.artifactPieces[i].pieceType)
                });
              }
            }
          }
        } else {
          this.pieceFormControl.disable();
        }
      })
    );
  }

  getMainStats(event: any): Observable<any> {
    return this.stat.listStats().pipe(
      map(response => {
        if (event !== undefined) {
          
          this.mainStat = [];
          this.mainStatFormControl.enable();

          for (let i = 0; i < response.length; i++) {
            const rawItem = response[i];
          
          
            if (event.pieceType === 'CIRCLET') {
              if (!String(rawItem.statName).endsWith('Bonus')
                  && (String(rawItem.statName).endsWith('%')
                  || String(rawItem.statName) === 'Energy Recharge'
                  || String(rawItem.statName) === 'Elemental Mastery')
                  || String(rawItem.statName) === 'Healing Bonus'
                  || String(rawItem.statName).startsWith('Crit')) {
                this.mainStat.push({
                  id: Number(rawItem.id),
                  statName: String(rawItem.statName),
                  statType: String(rawItem.statType)
                });
              }
            } else if (event.pieceType === 'GOBLET') { 
              if (!String(rawItem.statName).startsWith('Crit')
                  && (String(rawItem.statName).endsWith('%')
                  || String(rawItem.statName) === 'Energy Recharge'
                  || String(rawItem.statName) === 'Elemental Mastery')
                  || String(rawItem.statName).endsWith('Bonus')
                  && String(rawItem.statName) !== 'Healing Bonus') {
                this.mainStat.push({
                  id: Number(rawItem.id),
                  statName: String(rawItem.statName),
                  statType: String(rawItem.statType)
                });
              }
            } else if (event.pieceType === 'FEATHER') { 
              if (String(rawItem.statName) === 'ATK') {
                this.mainStat.push({
                  id: Number(rawItem.id),
                  statName: String(rawItem.statName),
                  statType: String(rawItem.statType)
                });
              }
            } else if (event.pieceType === 'FLOWER') { 
              if (String(rawItem.statName) === 'HP') {
                this.mainStat.push({
                  id: Number(rawItem.id),
                  statName: String(rawItem.statName),
                  statType: String(rawItem.statType)
                });
              }
            } else {
              if (!String(rawItem.statName).endsWith('Bonus')
                  && !String(rawItem.statName).startsWith('Crit')
                  && (String(rawItem.statName).endsWith('%')
                  || String(rawItem.statName) === 'Energy Recharge'
                  || String(rawItem.statName) === 'Elemental Mastery')) {
                this.mainStat.push({
                  id: Number(rawItem.id),
                  statName: String(rawItem.statName),
                  statType: String(rawItem.statType)
                });
              }
            }
          }
        } else {
          this.mainStatFormControl.disable();
        }
      })
    );
  }

  getSecondaryStats(event: any): Observable<any> {
    return this.stat.listStats().pipe(
      map(response => {
        
        if (event !== undefined) {
          this.secondaryStats = [];
  
          this.secondaryStatOneFormControl.enable();
          this.secondaryStatTwoFormControl.enable();
          this.secondaryStatThreeFormControl.enable();
          this.secondaryStatFourFormControl.enable();
  
          for (let i = 0; i < response.length; i++) {
            const rawItem = response[i];
            if (event.id !== rawItem.id && rawItem.statType !== 'MAIN') {
              this.secondaryStats.push({
                id: Number(rawItem.id),
                statName: String(rawItem.statName),
                statType: String(rawItem.statType)
              });
            }
          }
        } else {
          this.secondaryStatOneFormControl.disable();
          this.secondaryStatTwoFormControl.disable();
          this.secondaryStatThreeFormControl.disable();
          this.secondaryStatFourFormControl.disable();
        }
        
      })
    );
  }

  listUserArtifactToUpdate(): void {
  const userArtifactToUpdate = this.userArtifact.getUserArtifactToUpdate();

  if (userArtifactToUpdate) {
    this.setFormControl.setValue(userArtifactToUpdate.set);

    this.getPieces(userArtifactToUpdate.set).subscribe(() => {
      
      this.pieceFormControl.setValue(userArtifactToUpdate.piece);

      this.getMainStats(userArtifactToUpdate.piece).subscribe(() => {
        
        this.mainStatFormControl.setValue(userArtifactToUpdate.mainStat);

        this.getSecondaryStats(userArtifactToUpdate.mainStat).subscribe(() => {
          
          this.secondaryStatOneFormControl.setValue(userArtifactToUpdate.secondaryStats[0]);
          this.secondaryStatTwoFormControl.setValue(userArtifactToUpdate.secondaryStats[1]);
          this.secondaryStatThreeFormControl.setValue(userArtifactToUpdate.secondaryStats[2]);
          
          if (userArtifactToUpdate.secondaryStats.length > 3 && userArtifactToUpdate.secondaryStats[3].statName !== '') {
            this.secondaryStatFourFormControl.setValue(userArtifactToUpdate.secondaryStats[3]);
          }
        });
      });
    });

    this.updateData = userArtifactToUpdate;

    this.userArtifact.clearUserArtifactToUpdate();

    this.updateButton = true;
  } else {
    this.updateButton = false;
  }
}

  compareSet = (option: GetArtifactSet, value: GetArtifactSet | null): boolean => {
    if (!value || !option) {
      return false;
    }
    return option.id === value.id;
  };

  comparePiece = (option: GetArtifactPiece, value: GetArtifactPiece | null): boolean => {
    if (!value || !option) {
      return false;
    }
    return option.id === value.id;
  };

  compareStat = (option: Stat, value: Stat | null): boolean => {
    if (!value || !option) {
      return false;
    }
    
    return option.statName === value.statName;
  };

  private openSnackBar(message: string, action: string = 'Cerrar', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}