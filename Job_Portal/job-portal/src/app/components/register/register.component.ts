import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  companyName?: string;
  phoneNumber?: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: RegisterData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'employee',
    companyName: '',
    phoneNumber: ''
  };
  errorMessage: string = '';
  isLoading: boolean = false;
  showCompanyField: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRoleChange(event: any) {
    this.showCompanyField = event.target.value === 'company';
    this.user.role = event.target.value;
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const userData = {
      ...this.user,
      name: `${this.user.firstName} ${this.user.lastName}`
    };

    if (this.user.role !== 'company') {
      delete userData.companyName;
    }

    this.authService.register(userData).subscribe({
      next: () => {
        this.isLoading = false;
        // After successful registration, try to log in automatically
        this.authService.login({
          email: this.user.email,
          password: this.user.password
        }).subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.router.navigate(['/login']);
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Registration failed. Please try again.';
        console.error('Registration failed:', error);
      }
    });
  }

  private validateForm(): boolean {
    if (!this.user.firstName || !this.user.lastName) {
      this.errorMessage = 'Please enter your full name';
      return false;
    }
    if (!this.user.email) {
      this.errorMessage = 'Please enter your email';
      return false;
    }
    if (!this.user.password) {
      this.errorMessage = 'Please enter a password';
      return false;
    }
    if (this.user.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }
    if (this.user.role === 'company' && !this.user.companyName) {
      this.errorMessage = 'Please enter your company name';
      return false;
    }
    return true;
  }
} 