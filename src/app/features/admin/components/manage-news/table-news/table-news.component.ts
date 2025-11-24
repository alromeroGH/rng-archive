import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { NewsService } from 'src/app/core/services/news.service';
import { NewsTable } from 'src/app/core/interfaces/news-table';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-table-news',
  templateUrl: './table-news.component.html',
  styleUrls: ['./table-news.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSnackBarModule]
})
export class TableNewsComponent {
  NEWS_DATA: NewsTable[] = [];
  
  displayedColumns: string[] = ['newsType', 'title', 'description', 'link', 'date', 'modify', 'delete'];
  dataSource = new MatTableDataSource(this.NEWS_DATA);

  constructor(private news: NewsService,
    private router: Router,
    private snackBar: MatSnackBar) { 
    this.listNews();
  }

  listNews(): void {
    this.news.listNews().subscribe({
      next: (response) => {
        this.NEWS_DATA = []
        for (let i = 0; i < response.length; i++) {

          const rawItem = response[i];

          this.NEWS_DATA.push({
            id: Number(rawItem.id),
            newsType: String(rawItem.newsType),
            title: String(rawItem.title),
            description: String(rawItem.description),
            link: String(rawItem.link),
            date: rawItem.dateOfPublication
          });
        }
        
        this.dataSource = new MatTableDataSource(this.NEWS_DATA);
        
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  updateNews(data: NewsTable): void {
      this.news.setNewsToUpdate(data);
      
      this.redirectToManageNews();
  }

  deleteNews(id: number): void {
    if (confirm('Desea eliminar la noticia?')) {
      this.news.deleteNews(id).subscribe({
        next: (response) => {
          this.openSnackBar('Noticia eliminada con éxito', 'Aceptar');
  
          this.listNews();
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar('Error al eliminar la noticia', 'Aceptar');
        }
      });
    } 
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  redirectToManageNews(): void {
    this.router.navigate(['/manage-news']);
  }
  
  private openSnackBar(message: string, action: string = 'Cerrar', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}