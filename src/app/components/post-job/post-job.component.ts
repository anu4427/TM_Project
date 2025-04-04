import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.scss']
})
export class PostJobComponent implements OnInit {
  jobForm: FormGroup;
  loading = false;
  error = '';

  jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.jobForm = this.formBuilder.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      location: ['', Validators.required],
      type: ['', Validators.required],
      experience: ['', Validators.required],
      salary: ['', Validators.required],
      description: ['', Validators.required],
      requirements: ['', Validators.required],
      benefits: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Check if user is authenticated and is a recruiter
    if (!this.authService.isAuthenticated() || this.authService.getUserType() !== 'recruiter') {
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (this.jobForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    // TODO: Implement job posting service
    // For now, just mock the submission
    setTimeout(() => {
      console.log('Job Posted:', this.jobForm.value);
      this.loading = false;
      this.router.navigate(['/recruiter/dashboard']);
    }, 1000);
  }
} 