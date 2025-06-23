import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtistComponent } from './artist';
import { Artist } from '../../models/artist';
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

    // Use real API data structure
    mockArtist = {
      id: "134286cbe0fbcc8d6e229b40ea18c0cf",
      name: "Justice",
      photo: "https://toutelaculture.com/wp-content/uploads/2012/01/20090212171201_justice4-400x400.jpg"
    };

    component.artist = mockArtist;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display artist information correctly', () => {
    const compiled = fixture.nativeElement;
    
    expect(compiled.querySelector('.artist-name').textContent).toContain('Justice');
    
    const image = compiled.querySelector('.artist-photo');
    expect(image.src).toBe('https://toutelaculture.com/wp-content/uploads/2012/01/20090212171201_justice4-400x400.jpg');
    expect(image.alt).toBe('Justice');
  });

  it('should display delete button in overlay', () => {
    const compiled = fixture.nativeElement;
    const deleteButton = compiled.querySelector('.delete-btn');
    
    expect(deleteButton).toBeTruthy();
    expect(deleteButton.querySelector('.delete-icon')).toBeTruthy();
  });

  it('should emit deleteArtist event when delete button is clicked', () => {
    spyOn(component.deleteArtist, 'emit');
    
    const deleteButton = fixture.debugElement.query(By.css('.delete-btn'));
    deleteButton.triggerEventHandler('click', null);

    expect(component.deleteArtist.emit).toHaveBeenCalledWith("134286cbe0fbcc8d6e229b40ea18c0cf");
  });

  it('should call onDelete method when delete button is clicked', () => {
    spyOn(component, 'onDelete');
    
    const compiled = fixture.nativeElement;
    const deleteButton = compiled.querySelector('.delete-btn');
    deleteButton.click();

    expect(component.onDelete).toHaveBeenCalled();
  });

  it('should handle all real API artists correctly', () => {
    const realArtists: Artist[] = [
      {
        id: "134286cbe0fbcc8d6e229b40ea18c0cf",
        name: "Justice",
        photo: "https://toutelaculture.com/wp-content/uploads/2012/01/20090212171201_justice4-400x400.jpg"
      },
      {
        id: "aa6e4335aa3488cd6ef33a723566985a",
        name: "Deadmau5",
        photo: "https://images.sk-static.com/images/media/profile_images/artists/244669/huge_avatar"
      },
      {
        id: "e892cbb57f08db5b5c6f0edaccb98fca",
        name: "Savant",
        photo: "https://mir-s3-cdn-cf.behance.net/project_modules/disp/01790311196803.560f3873b675e.jpg"
      }
    ];

    realArtists.forEach(artist => {
      component.artist = artist;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.artist-name').textContent).toContain(artist.name);
      
      const image = compiled.querySelector('.artist-photo');
      expect(image.src).toBe(artist.photo);
      expect(image.alt).toBe(artist.name);
    });
  });

  it('should handle artist with empty properties gracefully', () => {
    const emptyArtist: Artist = {
      id: 'empty-id',
      name: '',
      photo: ''
    };

    component.artist = emptyArtist;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const nameElement = compiled.querySelector('.artist-name');
    const imageElement = compiled.querySelector('.artist-photo');
    
    expect(nameElement.textContent.trim()).toBe('');
    expect(imageElement.getAttribute('src')).toBe('');
  });

  it('should have proper CSS classes for styling', () => {
    const compiled = fixture.nativeElement;
    
    expect(compiled.querySelector('.artist-card')).toBeTruthy();
    expect(compiled.querySelector('.card-image')).toBeTruthy();
    expect(compiled.querySelector('.card-content')).toBeTruthy();
    expect(compiled.querySelector('.image-overlay')).toBeTruthy();
  });

  it('should handle real API photo URLs correctly', () => {
    const compiled = fixture.nativeElement;
    const image = compiled.querySelector('.artist-photo');
    
    // Verify it handles the real API photo URL
    expect(image.src).toContain('toutelaculture.com');
    expect(image.src).toContain('justice4-400x400.jpg');
  });

  it('should emit correct real API ID on delete', () => {
    spyOn(component.deleteArtist, 'emit');
    
    component.onDelete();
    
    expect(component.deleteArtist.emit).toHaveBeenCalledWith("134286cbe0fbcc8d6e229b40ea18c0cf");
  });
});