import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArtifactCreationRequest } from '../interfaces/artifact';
import { ArtifactTable } from '../interfaces/artifact-table';

@Injectable({
  providedIn: 'root'
})
export class ArtifactService {
  private artifactToEdit:  ArtifactTable | null = null;
  
  private artifactUrl = 'http://localhost:8080/api/admin/artifactSet';
  
  constructor(private http: HttpClient) { }

  addArtifactSet(body: ArtifactCreationRequest): Observable<any> {
    return this.http.post(`${this.artifactUrl}/create`, body);
  }

  listArtifactSets(): Observable<any> {
    return this.http.get(this.artifactUrl);
  }

  updateArtifactSet(body: ArtifactCreationRequest, id: number): Observable<any> {
    return this.http.post(`${this.artifactUrl}/update/${id}`, body)
  }

  deleteArtifactSet(id: number): Observable<any> {
    return this.http.post(`${this.artifactUrl}/delete/${id}`, null)
  }

  setArtifactSetToUpdate(artifactSet: ArtifactTable): void {
    this.artifactToEdit = artifactSet;
  }
  
  getArtifactSetToUpdate(): ArtifactTable | null {
    return this.artifactToEdit;
  }
  
  clearArtifactSetToUpdate(): void {
    this.artifactToEdit = null;
  }
}