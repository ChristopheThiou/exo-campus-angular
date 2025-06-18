import { Component, EventEmitter, Output } from '@angular/core';
import { Artist } from '../../models/artist';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artist-form-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './artist-form-component.html',
  styleUrl: './artist-form-component.scss'
})
export class ArtistFormComponent {
  @Output() addArtist = new EventEmitter<Artist>();
  
  artistForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.artistForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      photo: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.artistForm.valid) {
      const newArtist: Artist = {
        id: this.artistForm.value.id,
        name: this.artistForm.value.name,
        photo: this.artistForm.value.photo
      };
      this.addArtist.emit(newArtist);
      this.artistForm.reset();
    }
  }
}
