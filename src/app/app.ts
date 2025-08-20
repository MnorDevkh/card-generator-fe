import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: '<router-outlet></router-outlet>',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('card-system');
}
