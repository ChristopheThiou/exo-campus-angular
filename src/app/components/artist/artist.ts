import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Artist } from '../../models/artist';

@Component({
  selector: 'app-artist',
  imports: [],
  templateUrl: './artist.html',
  styleUrl: './artist.scss'
})
export class ArtistComponent {
  @Input() artist!: Artist;
  @Output() deleteArtist = new EventEmitter<string>();

  onDelete() {
    this.deleteArtist.emit(this.artist.id);
  }
}