import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CharacterSimulator, WeaponSimulator } from '../interfaces/simulator';

@Injectable({
  providedIn: 'root'
})
export class SimulatorService {
  private simulatorUrl = 'http://localhost:8080/api/summon-simulator';

  constructor(private http: HttpClient) { }

  characterSimulator(body: CharacterSimulator): Observable<any> {
    return this.http.post(`${this.simulatorUrl}/character`, body);
  }

  weaponSimulator(body: WeaponSimulator): Observable<any> {
    return this.http.post(`${this.simulatorUrl}/weapon`, body);
  }
}