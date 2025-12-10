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
import { TableNewsComponent } from './features/admin/components/manage-news/table-news/table-news.component';
import { TableArtifactsComponent } from './features/admin/components/manage-artifact/table-artifact/table-artifact.component';
import { TableUnitComponent } from './features/admin/components/manage-unit/table-unit/table-unit.component';
import { TableWeaponBannerComponent } from './features/admin/components/manage-weapon-banner/table-weapon-banner/table-weapon-banner.component';
import { TableCharacterBannerComponent } from './features/admin/components/manage-character-banner/table-character-banner/table-character-banner.component';
import { authGuard } from './core/guards/auth.guard';
import { ModifyPasswordComponent } from './features/user/components/modify-password/modify-password.component';
import { ArtifactHistoryComponent } from './features/user/components/artifact-history/artifact-history.component';
import { PullHistoryComponent } from './features/user/components/pull-history/pull-history.component';

const routes: Routes = [
  {path: '', component: HomeComponent},

  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},

  {path: 'home', component: HomeComponent},

  {path: 'profile', component: ProfileComponent, canActivate: [authGuard], data: { roles: ['admin', 'user'] }},
  {path: 'modify-password', component: ModifyPasswordComponent, canActivate: [authGuard], data: { roles: ['admin', 'user'] }},

  {path: 'add-artifact', component: AddArtifactComponent, canActivate: [authGuard], data: { roles: ['admin', 'user'] }},
  {path: 'history-artifact', component: ArtifactHistoryComponent, canActivate: [authGuard], data: { roles: ['admin', 'user'] }},
  {path: 'artifact-statistics', component: ArtifactStatisticsComponent, canActivate: [authGuard], data: { roles: ['admin', 'user'] }},

  {path: 'add-pull', component: AddPullComponent, canActivate: [authGuard], data: { roles: ['admin', 'user'] }},
  {path: 'history-pull', component: PullHistoryComponent, canActivate: [authGuard], data: { roles: ['admin', 'user'] }},
  {path: 'pull-statistics', component: PullStatisticsComponent, canActivate: [authGuard], data: { roles: ['admin', 'user'] }},

  {path: 'simulator', component: SimulatorComponent},

  {path: 'manage-news', component: ManageNewsComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  {path: 'manage-artifact', component: ManageArtifactComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  {path: 'manage-unit', component: ManageUnitComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  {path: 'manage-weapon-banner', component: ManageWeaponBannerComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  {path: 'manage-character-banner', component: ManageCharacterBannerComponent, canActivate: [authGuard], data: { roles: ['admin'] }},

  {path: 'table-news', component: TableNewsComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  {path: 'table-artifact', component: TableArtifactsComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  {path: 'table-unit', component: TableUnitComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  {path: 'table-weapon-banner', component: TableWeaponBannerComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  {path: 'table-character-banner', component: TableCharacterBannerComponent, canActivate: [authGuard], data: { roles: ['admin'] }}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
