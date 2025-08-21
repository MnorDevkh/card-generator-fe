import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { Student, StudentService } from '../../service/student.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-student-info',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzDescriptionsModule, NzSpinModule, NzIconModule],
  templateUrl: './student-info.html',
  styleUrls: ['./student-info.scss'],
})
export class StudentInfo implements OnInit, OnDestroy {
  studentId!: string;
  identityId!: string;
  student?: Student;
  loading = true;
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService
  ) {
    this.studentId = this.route.snapshot.paramMap.get('id') ?? '';
    if (typeof window !== 'undefined') {
      this.identityId = sessionStorage.getItem('identityId') ?? '';
    }
    if (!this.identityId && typeof window !== 'undefined') {
      this.router.navigate([`/students/${this.studentId}`]);
    }
  }

  ngOnInit(): void {
    this.loading = true;
    if (this.identityId) {
      this.loadStudentInfo();
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('identityId');
    }
  }

  async loadStudentInfo(): Promise<void> {
    this.loading = true;
    try {
     const students =   this.student = await firstValueFrom(
        this.studentService.getStudentInfo(this.studentId, this.identityId)
      );
      const baseURL = environment.apiBaseUrl;
      this.student = {
        ...students,
        photo: students.photo ? `${baseURL}upload_image/image/${students.photo}` : null,
      };
    } catch (error) {
      console.error('Error fetching student info:', error);
    } finally {
      this.loading = false;
    }
  }
}
