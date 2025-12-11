import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Chart, ChartType } from 'chart.js/auto';
import { PullStatisticsData } from 'src/app/core/interfaces/pull-statistics';
import { BannerType } from 'src/app/core/interfaces/banner-type';
import { StatisticsService } from 'src/app/core/services/statistics.service';
import { UserService } from 'src/app/core/services/user.service';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pull-statistics',
  templateUrl: './pull-statistics.component.html',
  styleUrls: ['./pull-statistics.component.css'],
    standalone: true,
    imports: [FormsModule, MatFormFieldModule, MatSelectModule,
      MatInputModule, NgIf, NgFor, ReactiveFormsModule, MatSnackBarModule]
})
export class PullStatisticsComponent implements OnInit, AfterViewChecked {
  @ViewChild('fiftyFiftyCanvas') fiftyFiftyCanvasRef!: ElementRef;
  @ViewChild('capturingRadianceCanvas') capturingRadianceCanvasRef!: ElementRef;

  public fiftyFiftyChart: Chart | null = null;
  public capturingRadianceChart: Chart | null = null;

  private chartCreated: boolean = false;

  showForm: boolean = true;
  
  statisticsData: PullStatisticsData | null = null;

  pullStatisticForm: FormGroup;

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

  ngAfterViewChecked(): void {
    if (!this.chartCreated && this.fiftyFiftyCanvasRef
      && this.capturingRadianceCanvasRef && this.statisticsData) {
        
        this.fiftyFiftyGraphic();
        this.capturingRadianceGraphic();
        this.chartCreated = true;
    }
  }

  ngOnInit(): void {
    this.showForm = true;
  }

  constructor(private statistics: StatisticsService,
    private user: UserService,
    private snackBar: MatSnackBar
  ) {
    this.pullStatisticForm = new FormGroup({
      bannerType: this.bannerTypeFormControl
    });
  }

  getPullStatistics(): void {
    const credentials = this.pullStatisticForm;

    if (credentials.valid) {
      const body = {
        userId: Number(this.user.getId()),
        bannerType: String(this.bannerTypeFormControl.value?.value)
      }

      this.statistics.getPullStatistics(body).subscribe({
        next: (response) => {
          this.statisticsData = {
            totalPull: response.totalPull,
            totalFiveUnit: response.totalFiveUnit,
            totalLimitedUnit: response.totalLimitedUnit,
            fiftyFiftyGraphic: {
              win: response.fiftyFiftyGraphic.win,
              lost: response.fiftyFiftyGraphic.lost
            },
            capturingRadianceGraphic: {
              activate: response.capturingRadianceGraphic.activate,
              notActivate: response.capturingRadianceGraphic.notActivate
            }
          }
          this.showForm = false;
          this.fiftyFiftyGraphic();
          this.capturingRadianceGraphic();
        },
        error: (err) => {
          if (err.error === 'There is not enough data for the selected banner type') {
            this.openSnackBar('No hay suficientes datos para el tipo de banner seleccionado', 'Aceptar');
            return;
          }
          console.log(err);
          
        }
      });
    }
  }

  cancel(): void {
    window.location.reload();
  }

  fiftyFiftyGraphic(): void {
    this.fiftyFiftyChart?.destroy();

    const data = {
      labels: [
        'Ganó',
        'Perdió'
      ],
      datasets: [{
        label: '50/50 data',
        data: [Number(this.statisticsData?.fiftyFiftyGraphic.win), 
          Number(this.statisticsData?.fiftyFiftyGraphic.lost)
        ],
        backgroundColor: [
          '#8B5CF6',
          '#FFD700'
        ],
        hoverOffset: 4
      }]
    };

    this.fiftyFiftyChart = new Chart("fiftyFiftyChart", {
      type: 'pie' as ChartType,
      data: data
    })
  }

  capturingRadianceGraphic(): void {
    this.capturingRadianceChart?.destroy();

    const data = {
      labels: [
        'Activó',
        'No activó'
      ],
      datasets: [{
        label: 'capturing radiance data',
        data: [Number(this.statisticsData?.capturingRadianceGraphic.activate), 
          Number(this.statisticsData?.capturingRadianceGraphic.notActivate)
        ],
        backgroundColor: [
          '#8B5CF6',
          '#FFD700'
        ],
        hoverOffset: 4
      }]
    };

    this.capturingRadianceChart = new Chart("capturingRadianceChart", {
      type: 'pie' as ChartType,
      data: data
    })
  }

  private openSnackBar(message: string, action: string = 'Cerrar', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
