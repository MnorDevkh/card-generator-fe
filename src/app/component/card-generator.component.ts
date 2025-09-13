import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Student, StudentService } from '../service/student.service';
import { UploadService } from '../service/upload.service';
import { forkJoin, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-card-generator',
  standalone: true,
  imports: [
    NzQRCodeModule,
    CommonModule,
    NzCardModule,
    NzGridModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
    FormsModule,
  ],
  templateUrl: './card-generator.component.html',
})
export class CardGeneratorComponent implements OnInit {
  studentIds: string[] = [];
  imageId: string = '';
  selectedTemplateId: number | null = null;
  baseUrl = environment.apiBaseUrl;
  url = environment.url;
  issueDate: string = '';
  expiryDate: string = '';

  year: string = '';
  @ViewChildren('cardContainer') cardContainers!: QueryList<ElementRef>;

  cardTemplates: { id: number; imageUrl: string }[] = [];
  loadingTemplates = false;

  students: Student[] = [];
  totalStudents = 0;
  loadingStudents = false;
  pageIndex = 1;
  pageSize = 10;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    // Get route params
    this.route.paramMap.subscribe((params) => {
      const templateId = params.get('id');
      this.imageId = templateId ?? '';
      this.selectedTemplateId = templateId ? +templateId : null;
      console.log('Selected template ID:', templateId);
      this.loadBackgroundTemplates();
    });

    // Get query params (studentIds)
    this.route.queryParamMap.subscribe((queryParams) => {
      const ids = queryParams.get('studentIds');
      this.studentIds = ids ? ids.split(',') : [];
      this.loadStudents();
      console.log('Student IDs in CardGeneratorComponent:', this.studentIds);
    });
  }
  private waitImages(container: HTMLElement): Promise<void> {
    const images = Array.from(container.getElementsByTagName('img'));
    return Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      })
    ).then(() => {});
  }

  exportCards() {
    const cardWidthMM = 54;
    const cardHeightMM = 85;

    const containers = this.cardContainers.toArray();

    // Create a single jsPDF instance outside the loop
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: [cardWidthMM, cardHeightMM] });

    const processCards = async () => {
      for (let i = 0; i < containers.length; i++) {
        const element = containers[i].nativeElement;

        // Wait for images to load before capturing the element
        await this.waitImages(element);

        // Convert the HTML element to a canvas
        const canvas = await html2canvas(element, {
          scale: 4, // Higher scale for better resolution
          useCORS: true,
          allowTaint: true,
        });

        // Convert the canvas to an image data URL
        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        // Add a new page for each card, starting from the second card
        if (i > 0) {
          doc.addPage([cardWidthMM, cardHeightMM], 'p');
        }

        // Add the image to the current page
        doc.addImage(imgData, 'JPEG', 0, 0, cardWidthMM, cardHeightMM);
      }

      // Save the PDF file
      doc.save('cards.pdf');
    };

    processCards();
  }

  loadBackgroundTemplates(): void {
    if (!this.imageId) {
      console.warn('No imageId provided — cannot load templates');
      return;
    }

    this.loadingTemplates = true;
    this.uploadService.getImageById(this.imageId).subscribe({
      next: (fileOrFiles) => {
        const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];

        const imageRequests = files.map((file) =>
          this.uploadService
            .getImage(file.filename)
            .pipe(map((imageUrl) => ({ id: file.id, imageUrl })))
        );

        forkJoin(imageRequests).subscribe({
          next: (templates) => {
            this.cardTemplates = templates;
            this.loadingTemplates = false;
            console.log('Loaded templates:', this.cardTemplates);
          },
          error: (err) => {
            console.error('Failed to load templates:', err);
            this.loadingTemplates = false;
          },
        });
      },
      error: (err) => {
        console.error('Failed to load image list:', err);
        this.loadingTemplates = false;
      },
    });
  }

loadStudents(): void {
  if (!this.studentIds.length) {
    console.warn('No student IDs provided, skipping student load.');
    return;
  }

  this.loadingStudents = true;
  this.studentService.getStudentsByIds(this.studentIds).subscribe({
    next: (students) => {
      this.students = students.map((student) => ({
        ...student,
        photo: student.photo ? `${this.baseUrl}/upload_image/image/${student.photo}` : null,
        issueDate: '',
        expiryDate: '',
      }));
      this.totalStudents = students.length;
      this.loadingStudents = false;
    },
    error: (err) => {
      console.error('Failed to load students', err);
      this.loadingStudents = false;
    },
  });
}

}
