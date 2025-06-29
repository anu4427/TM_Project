import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface ApiResponse {
  message: string;
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  email: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.email) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.forgotPassword(this.email).subscribe(
        (response: ApiResponse) => {
          this.isLoading = false;
          this.successMessage = 'Password reset instructions have been sent to your email.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        (error: any) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to send reset instructions. Please try again.';
        }
      );
    }
  }
} 