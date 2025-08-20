// src/app/card.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CardService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiBaseUrl;
  getBackground(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl+'upload_image/byId/'} ${id}`)
  }
  getCardTemplateData(): Observable<any> {
    // Static sample data
    const sampleData = {
      name: 'John Doe', //
      role: 'Teacher', //
      idNumber: 'TCH-2025-001', //
      issuedDate: '2025-08-10', //
      expiryDate: '2026-08-10', //
      schoolName: 'Sunrise International School', //
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', //
    };
    return of(sampleData);
  }
}