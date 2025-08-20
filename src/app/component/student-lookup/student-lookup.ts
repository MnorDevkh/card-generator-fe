import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student, StudentService } from '../../service/student.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-student-lookup',
  imports: [CommonModule, FormsModule, NzCardModule, NzInputModule, NzButtonModule, NzSpinModule],
  templateUrl: './student-lookup.html',
  styleUrl: './student-lookup.scss'
  
})
export class StudentLookup {
  studentId!: string;
  identityId = '';
  student?: Student;
  loading = false;
  error?: string;

  constructor(private route: ActivatedRoute, private studentService: StudentService, private router: Router) {
    this.studentId = this.route.snapshot.paramMap.get('id') ?? '';
  }

  async lookupStudent() {
  this.error = undefined;

  if (!this.identityId) {
    this.error = 'Please enter your Identity ID';
    return;
  }

  try {
    // Verify student
    const student = await firstValueFrom(
      this.studentService.getStudentInfo(this.studentId, this.identityId)
    );

    // Navigate to student-info/:id, pass identityId in navigation state
    this.router.navigate([`student-info/${this.studentId}`], {
      state: { identityId: this.identityId, student },
    });
  } catch (err) {
    this.error = 'Invalid Identity ID or student not found.';
    console.error(err);
  }
}
}
