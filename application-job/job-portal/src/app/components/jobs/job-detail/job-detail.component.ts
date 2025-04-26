import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { Job } from '../../../interfaces/job.interface';
import { AuthService } from '../../../services/auth.service';
import { MockDataService } from '../../../services/mock-data.service';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {
  job: Job | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  isEmployer = false;

  constructor(
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private mockDataService: MockDataService
  ) {}

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      this.isLoading = true;
      this.jobService.getJobById(jobId).subscribe({
        next: (job) => {
          this.job = job || null;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load job details';
          this.isLoading = false;
        }
      });
    }
    this.checkUserRole();
  }

  private checkUserRole(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isEmployer = user?.role === 'company';
    });
  }

  applyForJob(): void {
    if (!this.job) return;
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('token');
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    // TODO: Implement job application logic
    console.log('Applying for job:', this.job.id);
  }

  goBack(): void {
    this.router.navigate(['/jobs']);
  }
}
