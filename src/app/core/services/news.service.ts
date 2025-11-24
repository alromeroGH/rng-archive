import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from '../interfaces/news';
import { NewsTable } from '../interfaces/news-table';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private newsToEdit: NewsTable | null = null;

  private newsUrl = 'http://localhost:8080/api/admin/news';

  constructor(private http: HttpClient) { }

  addNews(body: News): Observable<any> {
    return this.http.post(`${this.newsUrl}/create`, body);
  }

  listNews(): Observable<any> {
    return this.http.get(`${this.newsUrl}`);
  }

  updateNews(body: News, id: number): Observable<any> {
    return this.http.post(`${this.newsUrl}/update/${id}`, body);
  }

  deleteNews(id: number): Observable<any> {
    return this.http.post(`${this.newsUrl}/delete/${id}`, null);
  }

  setNewsToUpdate(news: NewsTable): void {
    this.newsToEdit = news;
  }

  getNewsToUpdate(): NewsTable | null {
    return this.newsToEdit;
  }

  clearNewsToUpdate(): void {
    this.newsToEdit = null;
  }
}