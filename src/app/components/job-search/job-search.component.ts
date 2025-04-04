import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JobsService, Job, JobFilters } from '../../services/jobs.service';
import { ApplicationsService } from '../../services/applications.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.css']
})
export class JobSearchComponent implements OnInit {
  searchForm: FormGroup;
  jobs: Job[] = [];
  loading = false;
  error = '';
  successMessage = '';
  userType: string | null = null;
  isSeeker = false;
  isRecruiter = false;

  constructor(
    private fb: FormBuilder,
    private jobsService: JobsService,
    private applicationsService: ApplicationsService,
    private authService: AuthService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      title: [''],
      location: [''],
      jobType: ['']
    });
  }

  ngOnInit(): void {
    this.userType = this.authService.getUserType();
    this.isSeeker = this.userType === 'seeker';
    this.isRecruiter = this.userType === 'recruiter';
    this.loadJobs();

    // Subscribe to auth changes
    this.authService.currentUser$.subscribe(user => {
      this.userType = user?.userType || null;
      this.isSeeker = this.userType === 'seeker';
      this.isRecruiter = this.userType === 'recruiter';
    });
  }

  loadJobs(filters?: JobFilters): void {
    this.loading = true;
    this.error = '';
    this.jobs = [];

    this.jobsService.getAllJobs(filters).subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load jobs';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      const filters: JobFilters = {};
      
      if (this.searchForm.get('title')?.value) {
        filters.title = this.searchForm.get('title')?.value;
      }
      
      if (this.searchForm.get('location')?.value) {
        filters.location = this.searchForm.get('location')?.value;
      }
      
      if (this.searchForm.get('jobType')?.value) {
        filters.jobType = this.searchForm.get('jobType')?.value;
      }
      
      this.loadJobs(filters);
    }
  }

  applyForJob(jobId: number): void {
    if (!this.isSeeker) {
      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/login/emp_login'], { queryParams: { returnUrl: '/jobs' } });
      } else {
        this.error = 'Only job seekers can apply for jobs';
      }
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.applicationsService.applyForJob(jobId).subscribe({
      next: () => {
        this.successMessage = 'Application submitted successfully';
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to apply for job';
        this.loading = false;
      }
    });
  }

  viewJobDetails(jobId: number): void {
    this.router.navigate(['/jobs', jobId]);
  }
} 