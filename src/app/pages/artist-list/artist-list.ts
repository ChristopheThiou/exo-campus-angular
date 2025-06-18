import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Artist } from '../../models/artist';
import { ArtistComponent } from '../../components/artist/artist';
import { ArtistFormComponent } from '../../components/artist-form-component/artist-form-component';
import { CommonModule } from '@angular/common';
import { ArtistsWebservice } from '../../services/artists-webservice';

@Component({
  selector: 'app-artist-list',
  imports: [CommonModule, ArtistComponent, ArtistFormComponent],
  templateUrl: './artist-list.html',
  styleUrl: './artist-list.scss'
})
export class ArtistList implements OnInit {
  isLoading = false;
  error: string | null = null;
  artists: Artist[] = [];

  constructor(
    private artistsWebservice: ArtistsWebservice,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadArtists();
    }, 0);
  }

  loadArtists(): void {
    this.isLoading = true;
    this.error = null;
    
    this.artistsWebservice.getArtists().subscribe({
      next: (artists) => {
        console.log('Artistes reçus:', artists);
        this.artists = artists || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des artistes:', error);
        this.error = 'Erreur lors du chargement des artistes';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onAddArtist(artistData: { name: string, photo: string }): void {
    this.artistsWebservice.createArtist(artistData).subscribe({
      next: (newArtist) => {
        this.artists = [...this.artists, newArtist];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors de la création de l\'artiste:', error);
        this.error = 'Erreur lors de la création de l\'artiste';
      }
    });
  }

  onDeleteArtist(id: string): void {
    this.artistsWebservice.deleteArtist(id).subscribe({
      next: () => {
        this.artists = this.artists.filter(artist => artist.id !== id);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de l\'artiste:', error);
        this.error = 'Erreur lors de la suppression de l\'artiste';
      }
    });
  }
}