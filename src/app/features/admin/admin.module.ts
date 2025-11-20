import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ManageArtifactComponent } from './components/manage-artifact/manage-artifact.component';
import { ManageUnitComponent } from './components/manage-unit/manage-unit.component';
import { ManageCharacterBannerComponent } from './components/manage-character-banner/manage-character-banner.component';
import { ManageWeaponBannerComponent } from './components/manage-weapon-banner/manage-weapon-banner.component';
import { ManageNewsComponent } from './components/manage-news/manage-news.component';


@NgModule({
  declarations: [
    ManageArtifactComponent,
    ManageUnitComponent,
    ManageCharacterBannerComponent,
    ManageWeaponBannerComponent,
    ManageNewsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
