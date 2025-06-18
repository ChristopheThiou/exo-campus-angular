import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtistComponent } from './artist';
import { Artist } from '../../models/artist';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ArtistComponent', () => {
  let component: ArtistComponent;
  let fixture: ComponentFixture<ArtistComponent>;
  let mockArtist: Artist;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistComponent);
    component = fixture.componentInstance;

    // Mock artist data
    mockArtist = {
      id: 1,
      name: 'Test Artist',
      genre: 'Test Genre',
      photo: 'test-photo.jpg'
    };

    component.artist = mockArtist;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test affichage correct d'un artiste
  it('should display artist information correctly', () => {
    const compiled = fixture.nativeElement;
    
    expect(compiled.querySelector('h3').textContent).toContain('Test Artist');
    expect(compiled.querySelector('.genre').textContent).toContain('Test Genre');
    
    const image = compiled.querySelector('.artist-photo');
    expect(image.src).toContain('test-photo.jpg');
    expect(image.alt).toBe('Test Artist');
  });

  it('should not display genre if artist has no genre', () => {
    component.artist = { ...mockArtist, genre: '' };
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const genreElement = compiled.querySelector('.genre');
    expect(genreElement).toBeNull();
  });

  it('should display delete button', () => {
    const compiled = fixture.nativeElement;
    const deleteButton = compiled.querySelector('.delete-btn');
    
    expect(deleteButton).toBeTruthy();
    expect(deleteButton.textContent).toContain('Supprimer');
  });

  // Test suppression d'un artiste
  it('should emit deleteArtist event when delete button is clicked', () => {
    spyOn(component.deleteArtist, 'emit');
    
    const deleteButton = fixture.debugElement.query(By.css('.delete-btn'));
    deleteButton.triggerEventHandler('click', null);

    expect(component.deleteArtist.emit).toHaveBeenCalledWith(mockArtist.id);
  });

  it('should call onDelete method when delete button is clicked', () => {
    spyOn(component, 'onDelete');
    
    const compiled = fixture.nativeElement;
    const deleteButton = compiled.querySelector('.delete-btn');
    deleteButton.click();

    expect(component.onDelete).toHaveBeenCalled();
  });

  // Test edge cases
  it('should handle artist with undefined properties gracefully', () => {
    const incompleteArtist: Artist = {
      id: 2,
      name: 'Incomplete Artist',
      genre: undefined as any,
      photo: undefined as any
    };

    component.artist = incompleteArtist;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('Incomplete Artist');
  });
});