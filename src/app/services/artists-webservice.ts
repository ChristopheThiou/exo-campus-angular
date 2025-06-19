import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Artist } from '../models/artist';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArtistsWebservice {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // GET /artists - Récupérer tous les artistes
  getArtists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(`${this.apiUrl}/artists`);
  }

  // GET /artists/:id - Récupérer un artiste par ID
  getArtist(id: string): Observable<Artist> {
    return this.http.get<Artist>(`${this.apiUrl}/artists/${id}`);
  }

  // POST /artists - Créer un nouvel artiste
  createArtist(artist: { name: string; photo: string }): Observable<Artist> {
    return this.http.post<Artist>(`${this.apiUrl}/artists`, artist);
  }

  // PUT /artists/:id - Mettre à jour un artiste
  updateArtist(
    id: string,
    artist: { name?: string; photo?: string }
  ): Observable<Artist> {
    return this.http.put<Artist>(`${this.apiUrl}/artists/${id}`, artist);
  }

  // DELETE /artists/:id - Supprimer un artiste
  deleteArtist(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/artists/${id}`);
  }
}