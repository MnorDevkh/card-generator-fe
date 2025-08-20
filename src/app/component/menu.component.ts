import { Component } from '@angular/core';
import { CardEditorComponent } from './card-editor.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CardEditorComponent],  // import the card component here
  template: `
    <h1>Menu</h1>
    <app-card-editor></app-card-editor> 
  `
})
export class MenuComponent {}
