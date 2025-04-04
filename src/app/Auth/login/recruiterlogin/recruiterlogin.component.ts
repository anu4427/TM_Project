import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-recruiterlogin',
  templateUrl: './recruiterlogin.component.html',
  styleUrls: ['./recruiterlogin.component.css']
})
export class RecruiterloginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    // Redirect if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/rdashboard/postedjobs']);
    }
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });

    // Get return url from route parameters or default to '/rdashboard/postedjobs'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/rdashboard/postedjobs';
  }

  moveToRegister() {
    this.router.navigate(['register/rec_register']);
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.loginRecruiter(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: (data) => {
          console.log('Login successful:', data);
          // Navigate to the recruiter dashboard
          this.router.navigate(['/rdashboard/postedjobs']).then(() => {
            // Reload the page to ensure all auth state is updated
            window.location.reload();
          });
        },
        error: (error) => {
          console.error('Login error:', error);
          this.error = error.error?.message || 'Login failed. Please check your credentials.';
          this.loading = false;
        }
      });
  }

  get f() {
    return this.loginForm.controls;
  }
}
