import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { UploadService } from '../../service/upload.service';

interface CardTemplate {
  id: number;
  imageUrl: string;
}

@Component({
  selector: 'app-card-template-modal',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzCardModule, NzGridModule],
  templateUrl: './template-modal.component.html',
  providers: [UploadService],
})
export class TemplateModalComponent implements OnInit {
  @Input() studentIds: string[] = [];
  @Output() templateSelected = new EventEmitter<{ templateId: number; studentIds: string[] }>();

  cardTemplates: CardTemplate[] = [];
  selectedTemplateId?: number;

  constructor(private uploadService: UploadService) {}

  ngOnInit(): void {
    this.loadUploadedImages();
  }

  loadUploadedImages(): void {
    this.uploadService.getListImage('template').subscribe({
      next: (files) => {
        this.cardTemplates = [];
        files.forEach((file) => {
          this.uploadService.getImage(file.filename).subscribe({
            next: (imageUrl) => {
              this.cardTemplates.push({ id: file.id, imageUrl });
            },
            error: (err) => console.error('Failed to load image:', err),
          });
        });
      },
      error: (err) => console.error('Failed to load image list:', err),
    });
  }

  selectTemplate(templateId: number): void {
    this.selectedTemplateId = templateId;
  }

  confirmSelection(): void {
    if (!this.selectedTemplateId) {
      alert('Please select a template!');
      return;
    }
    this.templateSelected.emit({
      templateId: this.selectedTemplateId,
      studentIds: this.studentIds,
    });
  }
}
