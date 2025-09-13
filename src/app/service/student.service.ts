import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Student {
  id: string;
  card_id: string;
  identity_id: string;
  name: { khmer: string; english: string };
  gender: string;
  birth_date: string;
  birth_place: any;
  current_address: any;
  phone: string;
  guardian: { name: string; phone: string };
  education_level: string;
  bacII_code: string;
  bacII_year: string;
  bacII_result: string;
  high_school: string;
  faculty: string;
  batch: string;
  major: string;
  study_shift: string;
  scholarship_type: string;
  scholarship_card_id: string;
  scholarship_by: string;
  email: string;
  notes: string;
  photo: string | null;
  issueDate: string;
  expiryDate: string;
}

export interface PaginatedStudents { total: number; skip: number; limit: number; students: Student[]; }
export interface UploadResponse { success: boolean; imported: number; errors?: string[]; }

@Injectable({ providedIn: 'root' })
export class StudentService {
  private apiUrl = environment.apiBaseUrl.replace(/\/+$/, ''); // normalize base URL

  constructor(private http: HttpClient) {}

  getStudents(skip: number, limit: number): Observable<PaginatedStudents> {
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedStudents>(`${this.apiUrl}/students`, { params });
  }

  uploadExcel(formData: FormData): Observable<UploadResponse> {
    return this.http.post<UploadResponse>(`${this.apiUrl}/students/upload_excel`, formData);
  }

  getStudentsByIds(studentIds: string[]): Observable<Student[]> {
    return this.http.post<Student[]>(`${this.apiUrl}/students/by-ids`, { student_ids: studentIds });
  }

  getStudentInfo(studentId: string, identityId: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/students/${studentId}/${identityId}`);
  }
}