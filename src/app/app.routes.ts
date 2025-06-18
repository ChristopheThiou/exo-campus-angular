import { Routes } from '@angular/router';
import { Acceuil } from './pages/acceuil/acceuil';
import { ArtistList } from './pages/artist-list/artist-list';

export const routes: Routes = [
  { path: '', component: Acceuil },
  { path: 'artists', component: ArtistList }
];