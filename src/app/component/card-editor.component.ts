import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CardService } from '../service/card.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';


// import * as XLSX from 'xlsx';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
interface CardInfo {
  idNumber: string;
  name: string;
  role: string;
  expiryDate: string;
  photoUrl: string;
}
@Component({
  selector: 'app-card-editor',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzGridModule],
  templateUrl: './card-editor.component.html',
})
export class CardEditorComponent implements OnInit {
  cards: CardInfo[] = [];
  backgroundImageUrl: SafeUrl | null = null;
  private objectUrl?: string;

  constructor(
    private route: ActivatedRoute,
    private cardService: CardService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef
  ) // private router: Router
  {}
  private baseUrl = environment.apiBaseUrl;
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.cardService.getBackground(+id).subscribe((res) => {
          const encodedFilename = encodeURIComponent(res.filename);
          console.log(encodedFilename);

          const imageUrl = `${this.baseUrl}upload_image/images/${encodedFilename}`;
          console.log(imageUrl);
          this.backgroundImageUrl = this.sanitizer.bypassSecurityTrustStyle(
            `url(${imageUrl})`
          );
          console.log(`${this.backgroundImageUrl}`);
          this.cd.detectChanges();
        });
      }
    });
  }

  onBackgroundSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
      }

      this.objectUrl = URL.createObjectURL(file);
      this.backgroundImageUrl = this.sanitizer.bypassSecurityTrustUrl(
        this.objectUrl
      );
    }
  }

  onExcelUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      // const data = new Uint8Array(e.target?.result as ArrayBuffer);
      // const workbook = XLSX.read(data, { type: 'array' });
      // const sheetName = workbook.SheetNames[0];
      // const worksheet = workbook.Sheets[sheetName];
      // const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      // this.cards = jsonData.map((item) => ({
      //   idNumber: item['IDNumber'] || '',
      //   name: item['Name'] || '',
      //   role: item['Role'] || '',
      //   expiryDate: item['ExpiryDate'] || '',
      //   photoUrl: item['PhotoUrl'] || '',
      // }));

      // console.log('Cards loaded:', this.cards);
      // this.cd.detectChanges();
    };

    reader.readAsArrayBuffer(file);
  }
}
