// parent.component.ts
import { Component } from '@angular/core';
import { HomeComponent } from '../home.component';

@Component({
  selector: 'app-parent',
  standalone: true,
  // imports: [HomeComponent],
  templateUrl: './parent.component.html',
})
export class ParentComponent {}
