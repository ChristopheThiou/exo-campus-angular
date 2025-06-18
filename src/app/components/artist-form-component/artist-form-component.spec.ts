import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ArtistFormComponent } from './artist-form-component';
import { Artist } from '../../models/artist';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

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

  it('should initialize form with empty values', () => {
    expect(component.artistForm.get('name')?.value).toBe('');
    expect(component.artistForm.get('genre')?.value).toBe('');
    expect(component.artistForm.get('photo')?.value).toBe('');
  });

  // Test validation du formulaire
  it('should be invalid when form is empty', () => {
    expect(component.artistForm.valid).toBeFalsy();
  });

  it('should be invalid with name less than 2 characters', () => {
    component.artistForm.patchValue({
      name: 'A',
      genre: 'Test Genre',
      photo: 'test.jpg'
    });

    expect(component.artistForm.get('name')?.valid).toBeFalsy();
    expect(component.artistForm.valid).toBeFalsy();
  });

  it('should be valid with correct input', () => {
    component.artistForm.patchValue({
      name: 'Test Artist',
      genre: 'Test Genre',
      photo: 'http://test.jpg'
    });

    expect(component.artistForm.valid).toBeTruthy();
  });

  // Test ajout d'un artiste
  it('should emit addArtist event when form is submitted with valid data', () => {
    spyOn(component.addArtist, 'emit');
    
    component.artistForm.patchValue({
      name: 'New Artist',
      genre: 'New Genre',
      photo: 'new-photo.jpg'
    });

    component.onSubmit();

    expect(component.addArtist.emit).toHaveBeenCalled();
    
    const emittedArtist = (component.addArtist.emit as jasmine.Spy).calls.argsFor(0)[0] as Artist;
    expect(emittedArtist.name).toBe('New Artist');
    expect(emittedArtist.genre).toBe('New Genre');
    expect(emittedArtist.photo).toBe('new-photo.jpg');
    expect(typeof emittedArtist.id).toBe('number');
  });

  it('should not emit addArtist event when form is invalid', () => {
    spyOn(component.addArtist, 'emit');
    
    component.artistForm.patchValue({
      name: '', // Invalid: required
      genre: 'Test Genre',
      photo: 'test.jpg'
    });

    component.onSubmit();

    expect(component.addArtist.emit).not.toHaveBeenCalled();
  });

  it('should reset form after successful submission', () => {
    component.artistForm.patchValue({
      name: 'Test Artist',
      genre: 'Test Genre',
      photo: 'test.jpg'
    });

    component.onSubmit();

    expect(component.artistForm.get('name')?.value).toBe(null);
    expect(component.artistForm.get('genre')?.value).toBe(null);
    expect(component.artistForm.get('photo')?.value).toBe(null);
  });

  // Test UI interactions
  it('should disable submit button when form is invalid', () => {
    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector('button[type="submit"]');
    
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should enable submit button when form is valid', () => {
    component.artistForm.patchValue({
      name: 'Valid Artist',
      genre: 'Valid Genre',
      photo: 'valid.jpg'
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector('button[type="submit"]');
    
    expect(submitButton.disabled).toBeFalsy();
  });

  it('should show error messages for invalid fields', async () => {
    const nameInput = component.artistForm.get('name');
    nameInput?.markAsTouched();
    nameInput?.setValue('A'); // Trop court
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const errorMessage = compiled.querySelector('.error');
    
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('Le nom est requis');
  });

  // Test edge cases
  it('should handle form submission with special characters', () => {
    spyOn(component.addArtist, 'emit');
    
    component.artistForm.patchValue({
      name: 'Cœur & âme',
      genre: 'Français/Électro',
      photo: 'http://special-chars.jpg'
    });

    component.onSubmit();

    expect(component.addArtist.emit).toHaveBeenCalled();
  });
});