// login.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuthService, LoginRequest } from '../../service/auth.sevice';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule, // Added CommonModule
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ]
})
export class Login {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router // Inject Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = null;
      const request: LoginRequest = this.loginForm.value;
      this.authService.login(request).subscribe({
        next: (response) => {
          this.loading = false;
          console.log('Login success:', response);
          // Save the token
          this.authService.saveToken(response.access_token);

          // Redirect the user to another page (e.g., dashboard)
          this.router.navigate(['/dashboard']); 
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Login failed. Please check your credentials.';
          console.error('Login error:', err);
        }
      });
    }
  }
}