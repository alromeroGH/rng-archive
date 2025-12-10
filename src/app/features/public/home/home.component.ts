import { Component } from '@angular/core';
import { NgIf, NgFor, NgClass, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { NewsService } from 'src/app/core/services/news.service';
import { NewsTable } from 'src/app/core/interfaces/news-table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, CommonModule, RouterLink, FormsModule]
})
export class HomeComponent {
  logged = this.auth.getToken();

  CARD_INFO: NewsTable[] = [];

  filterType: string = '';
  filterDate: string = '';

  newsTypes: string[] = ['event', 'code', 'banner'];

  showFiler: boolean = false;

  constructor(private auth: AuthService,
    private news: NewsService,
    private router: Router
  ) { 
    this.getNews();
  }

  getNews(): void {
    this.news.listNews().subscribe({
      next: (response) => {
        for (let i = 0; i < response.length; i++) {
          const rawItem = response[i];
          
          this.CARD_INFO.push({
            id: rawItem.id,
            newsType: rawItem.newsType,
            date: rawItem.dateOfPublication,
            title: rawItem.title,
            description: rawItem.description,
            link: rawItem.link
          });
        }
        this.CARD_INFO.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);

          return dateB.getTime() - dateA.getTime();
        });
      },
      error: (err) => {
        console.error(err);
        
      }
    });
  }

  filter(): void {
    if (this.showFiler) {
      this.showFiler = false;
    } else {
      this.showFiler = true;
    }
  }

  get filteredNews(): NewsTable[] {
    let filteredList = this.CARD_INFO;

    if (this.filterType) {
      filteredList = filteredList.filter(info => 
        info.newsType.toLowerCase() === this.filterType.toLowerCase()
      );
    }

    if (this.filterDate) {
      const filterDateStr = this.filterDate; 

      filteredList = filteredList.filter(info => {
        const newsDate = new Date(info.date);
        const newsDateStr = newsDate.toISOString().substring(0, 10); // Obtener YYYY-MM-DD
        
        return newsDateStr >= filterDateStr;
      });
    }

    return filteredList;
  }
}