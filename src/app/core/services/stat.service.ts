import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatService {
  private statUrl = 'http://localhost:8080/api/stat';

  constructor(private http: HttpClient) { }

  listStats(): Observable<any> {
    return this.http.get(this.statUrl);
  }
}
