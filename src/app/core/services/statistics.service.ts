import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArtifactStatistics } from '../interfaces/artifact-statistics';
import { PullStatistics } from '../interfaces/pull-statistics';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private statisticsUrl = 'http://localhost:8080/api/statistics';

  constructor(private http: HttpClient) { }

  getArtifactStatistics(body: ArtifactStatistics): Observable<any> {
    return this.http.post(`${this.statisticsUrl}/artifact`, body);
  }

  getPullStatistics(body: PullStatistics): Observable<any> {
    return this.http.post(`${this.statisticsUrl}/pull`, body);
  }
}
