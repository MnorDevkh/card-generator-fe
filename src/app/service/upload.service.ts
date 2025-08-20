import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { log } from 'console';
import { environment } from '../../environments/environment';
interface FileMeta {
  id: number;
  filename: string;
  content_type: string;
  related_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  uploadImage(file: File, related_id: number, type: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('related_id', related_id.toString());
    formData.append('type', type);

    return this.http.post(`${this.baseUrl}upload_image/upload/?type_=${type}&related_id=${related_id}`, formData);
  }

  getListImage(type: string): Observable<FileMeta[]> {
    return this.http.get<FileMeta[]>(
      `${this.baseUrl + 'upload_image/type/'}${type}`
    );
  }
  getImageById(id: string): Observable<any> {
    return this.http.get<FileMeta[]>(`${this.baseUrl + 'upload_image/'}${id}`);
  }

  getImage(filename: string): Observable<string> {
    return of(`${this.baseUrl + 'upload_image/image/'}${filename}`);
  }
}
