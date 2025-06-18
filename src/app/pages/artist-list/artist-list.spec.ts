import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtistList } from './artist-list';
import { ArtistComponent } from '../../components/artist/artist';
import { ArtistFormComponent } from '../../components/artist-form-component/artist-form-component';
import { ReactiveFormsModule } from '@angular/forms';
import { Artist } from '../../models/artist';

describe('ArtistList', () => {
  let component: ArtistList;
  let fixture: ComponentFixture<ArtistList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistList, ArtistComponent, ArtistFormComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 1: Vérifier que la liste des artistes est initialisée correctement
  it('should initialize artists list correctly', () => {
    expect(component.artists).toBeDefined();
    expect(component.artists.length).toBe(4);
    expect(component.artists[0].name).toBe('Beyoncé');
    expect(component.artists[0].genre).toBe('Pop/R&B');
    expect(component.artists[0].id).toBe(1);
  });

  // Test 2: Vérifier l'affichage des artistes dans le template
  it('should display all artists in the template', () => {
    const compiled = fixture.nativeElement;
    const artistElements = compiled.querySelectorAll('app-artist');
    expect(artistElements.length).toBe(4);
  });

  it('should display the correct title', () => {
    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('h1');
    expect(title.textContent).toContain('Liste des Artistes');
  });

  // Test 3: Vérifier l'ajout d'un artiste
  it('should add a new artist when onAddArtist is called', () => {
    const newArtist: Artist = {
      id: 5,
      name: 'Test Artist',
      genre: 'Test Genre',
      photo: 'test-photo.jpg'
    };

    const initialLength = component.artists.length;
    component.onAddArtist(newArtist);

    expect(component.artists.length).toBe(initialLength + 1);
    expect(component.artists[component.artists.length - 1]).toEqual(newArtist);
  });

  it('should add artist with generated timestamp ID', () => {
    const newArtist: Artist = {
      id: Date.now(),
      name: 'New Artist',
      genre: 'New Genre',
      photo: 'new-photo.jpg'
    };

    component.onAddArtist(newArtist);
    const addedArtist = component.artists[component.artists.length - 1];
    
    expect(addedArtist.name).toBe('New Artist');
    expect(addedArtist.genre).toBe('New Genre');
    expect(typeof addedArtist.id).toBe('number');
  });

  // Test 4: Vérifier la suppression d'un artiste
  it('should delete an artist when onDeleteArtist is called with valid ID', () => {
    const initialLength = component.artists.length;
    const artistToDelete = component.artists[0];
    
    component.onDeleteArtist(artistToDelete.id);

    expect(component.artists.length).toBe(initialLength - 1);
    expect(component.artists.find(artist => artist.id === artistToDelete.id)).toBeUndefined();
  });

  it('should not delete anything when onDeleteArtist is called with invalid ID', () => {
    const initialLength = component.artists.length;
    const invalidId = 999;
    
    component.onDeleteArtist(invalidId);

    expect(component.artists.length).toBe(initialLength);
  });

  it('should handle deletion of non-existing artist gracefully', () => {
    const initialArtists = [...component.artists];
    
    component.onDeleteArtist(-1);

    expect(component.artists).toEqual(initialArtists);
  });

  // Test edge case: Liste vide
  it('should handle empty artists list', () => {
    component.artists = [];
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const artistElements = compiled.querySelectorAll('app-artist');
    expect(artistElements.length).toBe(0);
  });
});