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

export interface PaginatedStudents {
  total: number;
  skip: number;
  limit: number;
  students: Student[];
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient) {}
  private apiUrl = environment.apiBaseUrl;

  getStudents(skip: number, limit: number): Observable<{ students: Student[]; total: number }> {
    const params = new HttpParams().set('skip', skip.toString()).set('limit', limit.toString());
    return this.http.get<{ students: Student[]; total: number }>(
      this.apiUrl + 'students/',
      { params }
    );
  }

  uploadExcel(formData: FormData): Observable<any> {
    // POST the Excel file to the backend
    return this.http.post<any>(this.apiUrl + 'students/upload_excel', formData);
  }

  getStudentsByIds(studentIds: string[]): Observable<Student[]> {
    return this.http.post<Student[]>(`${this.apiUrl}student/by-ids`, {
      student_ids: studentIds,
    });
  }
  getStudentInfo(studentId: string, identityId: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}students/${studentId}/${identityId}`);
  }
}
