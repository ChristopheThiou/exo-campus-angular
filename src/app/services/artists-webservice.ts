import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Artist } from '../models/artist';

@Injectable({
  providedIn: 'root',
})
export class ArtistsWebservice {
  private apiUrl = 'https://artists-api-ndhd.onrender.com';
  private token = 'f3e91f07a577250eb7bda4fccf37adf0';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    }),
  };

  constructor(private http: HttpClient) {}

  // GET /artists - Récupérer tous les artistes
  getArtists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(`${this.apiUrl}/artists`, this.httpOptions);
  }

  // GET /artists/:id - Récupérer un artiste par ID
  getArtist(id: string): Observable<Artist> {
    return this.http.get<Artist>(
      `${this.apiUrl}/artists/${id}`,
      this.httpOptions
    );
  }

  // POST /artists - Créer un nouvel artiste
  createArtist(artist: { name: string; photo: string }): Observable<Artist> {
    return this.http.post<Artist>(
      `${this.apiUrl}/artists`,
      artist,
      this.httpOptions
    );
  }

  // PUT /artists/:id - Mettre à jour un artiste
  updateArtist(
    id: string,
    artist: { name?: string; photo?: string }
  ): Observable<Artist> {
    return this.http.put<Artist>(
      `${this.apiUrl}/artists/${id}`,
      artist,
      this.httpOptions
    );
  }

  // DELETE /artists/:id - Supprimer un artiste
  deleteArtist(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/artists/${id}`,
      this.httpOptions
    );
  }
}
