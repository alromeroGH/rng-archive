import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { ModifyPasswordComponent } from './components/modify-password/modify-password.component';
import { AddArtifactComponent } from './components/add-artifact/add-artifact.component';
import { ArtifactHistoryComponent } from './components/artifact-history/artifact-history.component';
import { ArtifactStatisticsComponent } from './components/artifact-statistics/artifact-statistics.component';
import { AddPullComponent } from './components/add-pull/add-pull.component';
import { PullHistoryComponent } from './components/pull-history/pull-history.component';
import { PullStatisticsComponent } from './components/pull-statistics/pull-statistics.component';
import { SimulatorComponent } from './components/simulator/simulator.component';


@NgModule({
  declarations: [
    ProfileComponent,
    ModifyPasswordComponent,
    AddArtifactComponent,
    ArtifactHistoryComponent,
    ArtifactStatisticsComponent,
    AddPullComponent,
    PullHistoryComponent,
    PullStatisticsComponent,
    SimulatorComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
