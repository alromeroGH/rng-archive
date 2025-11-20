import { Component } from '@angular/core';
import { UserService } from './core/services/user.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'rng-archive';
  showNavbar: boolean = false;

  constructor(private user: UserService) { }

  ngOnInit(): void {
    if (this.user.getRol() !== null) {
      this.showNavbar = true;
    } else {
      this.showNavbar = false;
    }
  }
}