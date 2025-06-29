import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { Job } from '../../../interfaces/job.interface';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit, OnDestroy {
  jobs: Job[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  isEmployer = false;
  isLoggedIn: boolean = false;
  userName: string = '';
  successMessage: string = '';
  private authSubscription: Subscription;

  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
    });
  }

  ngOnInit(): void {
    this.loadJobs();
    this.checkUserRole();
    this.authService.currentUser$.subscribe(user => {
      this.userName = user ? user.name : '';
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load jobs. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  private checkUserRole(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isEmployer = user?.role === 'company';
    });
  }

  applyForJob(jobId: string): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      alert('You have successfully applied for the job.');
    }, 500);
  }

  viewJobDetails(jobId: string): void {
    this.router.navigate(['/jobs', jobId]);
  }

  createNewJob(): void {
    this.router.navigate(['/jobs/new']);
  }

  onViewJobClick(): void {
    this.authService.redirectUrl = this.router.url;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
