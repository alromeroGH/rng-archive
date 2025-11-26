import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CharacterBanner } from '../interfaces/character-banner';
import { CharacterBannerTable } from '../interfaces/character-banner-table';

@Injectable({
  providedIn: 'root'
})
export class CharacterBannerService {
  private characterBannerToEdit: CharacterBannerTable | null = null;
  
  private characterBannerUrl = 'http://localhost:8080/api/admin/characterBanner';

  constructor(private http: HttpClient) { }

  addCharacterBanner(body: CharacterBanner): Observable<any> {
    return this.http.post(`${this.characterBannerUrl}/create`, body);
  }

  listCharacterBanner(): Observable<any> {
    return this.http.get(this.characterBannerUrl);
  }

  updateCharacteBanner(body: CharacterBanner, id: number): Observable<any> {
    return this.http.post(`${this.characterBannerUrl}/update/${id}`, body);
  }

  deleteCharacterBanner(id: number): Observable<any> {
    return this.http.post(`${this.characterBannerUrl}/delete/${id}`, null);
  }

  setCharacterBannerToUpdate(characterBanner: CharacterBannerTable): void {
    this.characterBannerToEdit = characterBanner;
  }
  
  getCharacterBannerToUpdate(): CharacterBannerTable | null {
    return this.characterBannerToEdit;
  }
  
  clearCharacterBannerToUpdate(): void {
    this.characterBannerToEdit = null;
  }
}