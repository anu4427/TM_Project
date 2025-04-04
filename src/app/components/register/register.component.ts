import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  error = '';
  userType: 'seeker' | 'recruiter' = 'seeker';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
      company_name: [''],
      experience: [''],
      skills: [''],
      education: ['']
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
    this.updateValidators();
  }

  updateValidators() {
    const companyNameControl = this.registerForm.get('company_name');
    const experienceControl = this.registerForm.get('experience');
    const skillsControl = this.registerForm.get('skills');
    const educationControl = this.registerForm.get('education');

    if (this.userType === 'recruiter') {
      companyNameControl?.setValidators(Validators.required);
      experienceControl?.clearValidators();
      skillsControl?.clearValidators();
      educationControl?.clearValidators();
    } else {
      companyNameControl?.clearValidators();
      experienceControl?.setValidators(Validators.required);
      skillsControl?.setValidators(Validators.required);
      educationControl?.setValidators(Validators.required);
    }

    companyNameControl?.updateValueAndValidity();
    experienceControl?.updateValueAndValidity();
    skillsControl?.updateValueAndValidity();
    educationControl?.updateValueAndValidity();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? (field.invalid && field.touched) : false;
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? (field.errors && field.errors[errorType]) : false;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const formData = {
      ...this.registerForm.value,
      userType: this.userType
    };

    this.authService.register(formData)
      .then(user => {
        if (user.userType === 'seeker') {
          this.router.navigate(['/seeker/dashboard']);
        } else {
          this.router.navigate(['/recruiter/dashboard']);
        }
      })
      .catch(error => {
        this.error = error.message || 'Registration failed. Please try again.';
        this.loading = false;
      });
  }
} 