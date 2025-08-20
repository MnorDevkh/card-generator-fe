import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [CommonModule],
  template: './upload-image.component.html',
})
export class UploadImageComponent {
  imageUrl: SafeUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
}
