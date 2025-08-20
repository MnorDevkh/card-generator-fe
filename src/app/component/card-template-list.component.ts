import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UploadService } from '../service/upload.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { forkJoin, map } from 'rxjs';

interface CardTemplate {
  id: number;
  imageUrl: string;
}

@Component({
  selector: 'app-card-template-list',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzCardModule, NzGridModule],
  templateUrl: './card-template-list.component.html',
  providers: [UploadService],
})
export class CardTemplateListComponent implements OnInit {
  cardTemplates: CardTemplate[] = [];
  studentIds: string[] = [];

  constructor(
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUploadedImages();
    const idsParam = this.route.snapshot.queryParamMap.get('studentIds');
    this.studentIds = idsParam ? idsParam.split(',') : [];
    console.log('Selected students:', this.studentIds);
  }

  loadUploadedImages(): void {
    this.uploadService.getListImage('template').subscribe({
      next: (files) => {
        const observables = files.map((file) =>
          this.uploadService
            .getImage(file.filename)
            .pipe(map((imageUrl) => ({ id: file.id, imageUrl })))
        );

        forkJoin(observables).subscribe({
          next: (results) => {
            this.cardTemplates = results; // now fully loaded
            console.log('Card templates loaded:', this.cardTemplates);
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Failed to load images:', err),
        });
      },
      error: (err) => console.error('Failed to load image list:', err),
    });
  }
  selectTemplate(id: number | null | undefined): void {
    if (id == null) {
      alert('Invalid template ID');
      return;
    }

    if (!this.studentIds.length) {
      alert('No students selected');
      return;
    }

    this.router.navigate(['/card-generator', id], {
      queryParams: { studentIds: this.studentIds.join(',') },
    });
  }
  updateTemplate(id: number): void {
    console.log('Update template:', id);
  }

  trackById(index: number, item: CardTemplate): number {
    return item.id;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.uploadService.uploadImage(file, 0, 'template').subscribe({
      next: () => this.loadUploadedImages(),
      error: (error) => console.error('Upload failed:', error),
    });
  }
}
