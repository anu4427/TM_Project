import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';
  userType: 'seeker' | 'recruiter' = 'seeker';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      const userType = this.authService.getUserType();
      if (userType === 'seeker') {
        this.router.navigate(['/seeker/dashboard']);
      } else if (userType === 'recruiter') {
        this.router.navigate(['/recruiter/dashboard']);
      }
    }
  }

  setUserType(type: 'seeker' | 'recruiter') {
    this.userType = type;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? (field.invalid && field.touched) : false;
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? (field.errors && field.errors[errorType]) : false;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password, this.userType)
      .then(user => {
        if (user.userType === 'seeker') {
          this.router.navigate(['/seeker/dashboard']);
        } else {
          this.router.navigate(['/recruiter/dashboard']);
        }
      })
      .catch(error => {
        this.error = error.message || 'Login failed. Please try again.';
        this.loading = false;
      });
  }
} 