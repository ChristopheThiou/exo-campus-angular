import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ArtistFormComponent } from './artist-form-component';

describe('ArtistFormComponent', () => {
  let component: ArtistFormComponent;
  let fixture: ComponentFixture<ArtistFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistFormComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display form header', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.form-header h2').textContent).toContain('Ajouter un artiste');
    expect(compiled.querySelector('.form-header p').textContent).toContain('Partagez votre découverte musicale');
  });

  it('should have invalid form initially', () => {
    expect(component.artistForm.valid).toBeFalsy();
  });

  it('should show error messages for invalid fields when touched', () => {
    const nameControl = component.artistForm.get('name');
    const photoControl = component.artistForm.get('photo');
    
    nameControl?.markAsTouched();
    photoControl?.markAsTouched();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const errorMessages = compiled.querySelectorAll('.error-message');
    expect(errorMessages.length).toBe(2);
  });

  it('should validate name field correctly', () => {
    const nameControl = component.artistForm.get('name');
    
    // Test required
    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBeTruthy();
    
    // Test minlength
    nameControl?.setValue('A');
    expect(nameControl?.hasError('minlength')).toBeTruthy();
    
    // Test valid with real artist names
    nameControl?.setValue('Justice');
    expect(nameControl?.valid).toBeTruthy();
    
    nameControl?.setValue('Deadmau5');
    expect(nameControl?.valid).toBeTruthy();
  });

  it('should validate photo URL field correctly with real API URLs', () => {
    const photoControl = component.artistForm.get('photo');
    
    // Test required
    photoControl?.setValue('');
    expect(photoControl?.hasError('required')).toBeTruthy();
    
    // Test pattern
    photoControl?.setValue('invalid-url');
    expect(photoControl?.hasError('pattern')).toBeTruthy();
    
    // Test valid with real API photo URLs
    photoControl?.setValue('https://toutelaculture.com/wp-content/uploads/2012/01/20090212171201_justice4-400x400.jpg');
    expect(photoControl?.valid).toBeTruthy();
    
    photoControl?.setValue('https://images.sk-static.com/images/media/profile_images/artists/244669/huge_avatar');
    expect(photoControl?.valid).toBeTruthy();
  });

  it('should disable submit button when form is invalid', () => {
    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector('.submit-btn');
    
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should enable submit button when form is valid', () => {
    component.artistForm.patchValue({
      name: 'Justice',
      photo: 'https://toutelaculture.com/wp-content/uploads/2012/01/20090212171201_justice4-400x400.jpg'
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector('.submit-btn');
    
    expect(submitButton.disabled).toBeFalsy();
  });

  it('should emit addArtist event on valid form submission with real data format', () => {
    spyOn(component.addArtist, 'emit');
    
    const artistData = {
      name: 'Justice',
      photo: 'https://toutelaculture.com/wp-content/uploads/2012/01/20090212171201_justice4-400x400.jpg'
    };
    
    component.artistForm.patchValue(artistData);
    component.onSubmit();

    expect(component.addArtist.emit).toHaveBeenCalledWith(artistData);
  });

  it('should reset form after successful submission', () => {
    component.artistForm.patchValue({
      name: 'Deadmau5',
      photo: 'https://images.sk-static.com/images/media/profile_images/artists/244669/huge_avatar'
    });
    
    component.onSubmit();

    expect(component.artistForm.get('name')?.value).toBeNull();
    expect(component.artistForm.get('photo')?.value).toBeNull();
  });

  it('should not emit event when form is invalid', () => {
    spyOn(component.addArtist, 'emit');
    
    // Form is invalid by default
    component.onSubmit();

    expect(component.addArtist.emit).not.toHaveBeenCalled();
  });

  it('should display correct input placeholders', () => {
    const compiled = fixture.nativeElement;
    const nameInput = compiled.querySelector('#name');
    const photoInput = compiled.querySelector('#photo');
    
    expect(nameInput.placeholder).toBe('Ex: Daft Punk');
    expect(photoInput.placeholder).toBe('https://exemple.com/photo.jpg');
  });

  it('should handle multiple real artists data correctly', () => {
    const realArtistsData = [
      {
        name: 'Justice',
        photo: 'https://toutelaculture.com/wp-content/uploads/2012/01/20090212171201_justice4-400x400.jpg'
      },
      {
        name: 'Deadmau5',
        photo: 'https://images.sk-static.com/images/media/profile_images/artists/244669/huge_avatar'
      },
      {
        name: 'Savant',
        photo: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/01790311196803.560f3873b675e.jpg'
      }
    ];

    spyOn(component.addArtist, 'emit');

    realArtistsData.forEach(artistData => {
      component.artistForm.reset();
      component.artistForm.patchValue(artistData);
      
      expect(component.artistForm.valid).toBeTruthy();
      
      component.onSubmit();
      expect(component.addArtist.emit).toHaveBeenCalledWith(artistData);
    });

    expect(component.addArtist.emit).toHaveBeenCalledTimes(3);
  });
});