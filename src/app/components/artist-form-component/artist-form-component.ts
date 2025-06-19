import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artist-form-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './artist-form-component.html',
  styleUrl: './artist-form-component.scss'
})
export class ArtistFormComponent {
  @Output() addArtist = new EventEmitter<{ name: string, photo: string }>();

  artistForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.artistForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      photo: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]]
    });
  }

  onSubmit(): void {
    if (this.artistForm.valid) {
      const artistData = {
        name: this.artistForm.get('name')?.value,
        photo: this.artistForm.get('photo')?.value
      };
      this.addArtist.emit(artistData);
      this.artistForm.reset();
    }
  }
}