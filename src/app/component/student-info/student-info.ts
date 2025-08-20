import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { Student, StudentService } from '../../service/student.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-student-info',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzDescriptionsModule, NzSpinModule],
  templateUrl: './student-info.html',
  styleUrls: ['./student-info.scss'], // ✅ plural, fixed
})
export class StudentInfo implements OnInit {
  studentId!: string;
  identityId!: string;
  student?: Student;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService
  ) {
    // Get studentId from route
    this.studentId = this.route.snapshot.paramMap.get('id') ?? '';

    // Read navigation state (from lookup page)
    const navState: any = this.router.getCurrentNavigation()?.extras.state;

    if (navState?.identityId) {
      this.identityId = navState.identityId;

      if (navState.student) {
        this.student = navState.student;
        this.loading = false;
      }
    } else {
      // No identityId → redirect back to lookup
      this.router.navigate([`/students/students/${this.studentId}`]);
    }
  }

  ngOnInit(): void {
    if (!this.student) {
      this.loadStudentInfo();
    }
  }

  async loadStudentInfo(): Promise<void> {
    this.loading = true;
    try {
      this.student = await firstValueFrom(
        this.studentService.getStudentInfo(this.studentId, this.identityId)
      );
    } catch (error) {
      console.error('Error fetching student info:', error);
    } finally {
      this.loading = false;
    }
  }
}
