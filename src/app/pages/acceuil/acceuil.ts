import { Component } from '@angular/core';

@Component({
  selector: 'app-acceuil',
  imports: [],
  templateUrl: './acceuil.html',
  styleUrl: './acceuil.scss'
})
export class Acceuil {
  showParagraph = false;

  toggleParagraph() {
    this.showParagraph = !this.showParagraph;
  }
}
