import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/public/home/home.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { ProfileComponent } from './features/user/components/profile/profile.component';
import { AddArtifactComponent } from './features/user/components/add-artifact/add-artifact.component';
import { ArtifactStatisticsComponent } from './features/user/components/artifact-statistics/artifact-statistics.component';
import { AddPullComponent } from './features/user/components/add-pull/add-pull.component';
import { PullStatisticsComponent } from './features/user/components/pull-statistics/pull-statistics.component';
import { SimulatorComponent } from './features/user/components/simulator/simulator.component';
import { ManageNewsComponent } from './features/admin/components/manage-news/manage-news.component';
import { ManageArtifactComponent } from './features/admin/components/manage-artifact/manage-artifact.component';
import { ManageUnitComponent } from './features/admin/components/manage-unit/manage-unit.component';
import { ManageWeaponBannerComponent } from './features/admin/components/manage-weapon-banner/manage-weapon-banner.component';
import { ManageCharacterBannerComponent } from './features/admin/components/manage-character-banner/manage-character-banner.component';

const routes: Routes = [
  {path: '', component: HomeComponent},

  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},

  {path: 'home', component: HomeComponent},

  {path: 'profile', component: ProfileComponent},

  {path: 'add-artifact', component: AddArtifactComponent},
  {path: 'artifact-statistics', component: ArtifactStatisticsComponent},

  {path: 'add-pull', component: AddPullComponent},
  {path: 'pull-statistics', component: PullStatisticsComponent},

  {path: 'simulator', component: SimulatorComponent},

  {path: 'manage-news', component: ManageNewsComponent},
  {path: 'manage-artifact', component: ManageArtifactComponent},
  {path: 'manage-unit', component: ManageUnitComponent},
  {path: 'manage-weapon-banner', component: ManageWeaponBannerComponent},
  {path: 'manage-character-banner', component: ManageCharacterBannerComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
