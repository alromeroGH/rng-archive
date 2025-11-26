import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeaponBannerTable } from '../interfaces/weapon-banner-table';
import { WeaponBanner } from '../interfaces/weapon-banner';

@Injectable({
  providedIn: 'root'
})
export class WeaponBannerService {
  private weaponBannerToEdit: WeaponBannerTable | null = null;
    
  private weaponBannerUrl = 'http://localhost:8080/api/admin/weaponBanner';

  constructor(private http: HttpClient) { }

  addWeaponBanner(body: WeaponBanner): Observable<any> {
    return this.http.post(`${this.weaponBannerUrl}/create`, body);
   }

   listWeaponBanner(): Observable<any> {
    return this.http.get(this.weaponBannerUrl);
   }

   updateWeaponBanner(body: WeaponBanner, id: number): Observable<any> {
    return this.http.post(`${this.weaponBannerUrl}/update/${id}`, body);
   }

   deleteWeaponBanner(id: number): Observable<any> {
    return this.http.post(`${this.weaponBannerUrl}/delete/${id}`, null);
   }

   setWeaponBannerToUpdate(weaponBanner: WeaponBannerTable): void {
    this.weaponBannerToEdit = weaponBanner;
   }
   
   getWeaponBannerToUpdate(): WeaponBannerTable | null {
    return this.weaponBannerToEdit;
   }
   
   clearWeaponBannerToUpdate(): void {
    this.weaponBannerToEdit = null;
   }
}