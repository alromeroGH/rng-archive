import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
 
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
  standalone: true,
  imports: [MatExpansionModule, BrowserAnimationsModule],
})
export class SideBarComponent implements OnInit {
  panelOpenState = false;
  isAdmin: boolean = false;

  constructor(private router: Router,
    private user: UserService
  ) { }

  ngOnInit(): void {
    if (this.user.getRol() === 'admin') {
      this.isAdmin = true;
    }
  }

  redirectToHome(): void {
    this.router.navigate(['/']);
  }

  redirectoToAddArtifact(): void {
    this.router.navigate(['/add-artifact']);
  }

  redirectoToArtifactStatistics(): void {
    this.router.navigate(['/artifact-statistics']);
  }

  redirectoToAddPull(): void {
    this.router.navigate(['/add-pull']);
  }

  redirectoToPullStatistics(): void {
    this.router.navigate(['/pull-statistics']);
  }

  redirectoToSimulator(): void {
    this.router.navigate(['/simulator']);
  }

  redirectToManageNews(): void {
    this.router.navigate(['/manage-news']);
  }

  redirectToManageArtifact(): void {
    this.router.navigate(['/manage-artifact']);
  }

  redirectToManageUnit(): void {
    this.router.navigate(['/manage-unit']);
  }

  redirectToManageWeaponBanner(): void {
    this.router.navigate(['/manage-weapon-banner']);
  }

  redirectToManageCharacterBanner(): void {
    this.router.navigate(['/manage-character-banner']);
  }
}