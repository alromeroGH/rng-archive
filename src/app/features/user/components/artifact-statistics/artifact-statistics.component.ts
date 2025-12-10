import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { map, Observable } from 'rxjs';
import { GetArtifactPiece, GetArtifactSet } from 'src/app/core/interfaces/artifact';
import { Stat } from 'src/app/core/interfaces/stat';
import { ArtifactStatisticsData } from 'src/app/core/interfaces/artifact-statistics';
import { UserService } from 'src/app/core/services/user.service';
import { StatService } from 'src/app/core/services/stat.service';
import { ArtifactService } from 'src/app/core/services/artifact.service';
import { StatisticsService } from 'src/app/core/services/statistics.service';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-artifact-statistics',
  templateUrl: './artifact-statistics.component.html',
  styleUrls: ['./artifact-statistics.component.css'],
    standalone: true,
    imports: [FormsModule, MatFormFieldModule, MatSelectModule,
      MatInputModule, NgIf, NgFor, ReactiveFormsModule, MatSnackBarModule]
  })
export class ArtifactStatisticsComponent implements OnInit {
  showForm: boolean = true;

  statisticsData: ArtifactStatisticsData | null = null;

  artifactStatisticForm: FormGroup;

  setFormControl = new FormControl<GetArtifactSet | null>(null, Validators.required);

  set: GetArtifactSet[] =[];

  pieceFormControl = new FormControl<GetArtifactPiece | null>(null, Validators.required);

  piece: GetArtifactPiece[] = [];

  mainStatFormControl = new FormControl<Stat | null>(null, Validators.required);

  mainStat: Stat[] = [];

  ngOnInit(): void {
    this.pieceFormControl.disable();
    this.mainStatFormControl.disable();

    this.getSets().subscribe();
    this.showForm = true;
  }

  constructor(private stat: StatService,
    private artifact: ArtifactService,
    private user: UserService,
    private statistics: StatisticsService,
    private snackBar: MatSnackBar) {
    this.artifactStatisticForm = new FormGroup({
      set: this.setFormControl,
      piece: this.pieceFormControl,
      mainStat: this.mainStatFormControl
    });
  }

  getArtifactStatistics(): void {
    const credentials = this.artifactStatisticForm;

    if (credentials.valid) {
      const body = {
        userId: Number(this.user.getId()),
        artifactPieceId: Number(this.pieceFormControl.value?.id),
        artifactSetId: Number(this.setFormControl.value?.id),
        mainStatId: Number(this.mainStatFormControl.value?.id)
      }

      this.statistics.getArtifactStatistics(body).subscribe({
        next: (response) => {
          let piece: string = '';

          switch (this.pieceFormControl.value?.pieceType) {
            case 'FLOWER': piece = 'Flor'
              break;
            case 'FEATHER': piece = 'Pluma'
              break;
            case 'SANDS': piece = 'Reloj'
              break;
            case 'GOBLET': piece = 'Caliz'
              break;
            case 'CIRCLET': piece = 'Corona'
              break;
            default:
              break;
          }

          this.statisticsData = {
            probabilityPercentage: response.probabilityPercentage,
            totalPieceArtifacts: response.totalPieceArtifacts,
            totalSetArtifacts: response.totalSetArtifacts,
            setName: String(this.setFormControl.value?.setName),
            pieceType: piece,
            mainStat: String(this.mainStatFormControl.value?.statName)
          };
          this.showForm = false;
          
        },
        error: (err) => {
          if (err.error === 'There is not enough data for the selected artifact') {
            this.openSnackBar('No hay suficientes datos para el artefacto seleccionado', 'Aceptar');
            return;
          }
          console.error(err);
        }
      });
    }
  }

  cancel(): void {
    window.location.reload();
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

  private openSnackBar(message: string, action: string = 'Cerrar', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}