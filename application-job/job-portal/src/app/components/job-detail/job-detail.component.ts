import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { Job } from '../../interfaces/job.interface';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {
  job: Job | null = null;
  isEmployer: boolean = false;
  hasApplied: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      this.loadJob(parseInt(jobId));
    }

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isEmployer = user.role === 'company';
      }
    });
  }

  loadJob(jobId: number): void {
    this.jobService.getJobById(jobId.toString()).subscribe({
      next: (job: Job | undefined) => {
        this.job = job || null;
        this.checkIfApplied();
      },
      error: (error: any) => {
        console.error('Error loading job:', error);
        this.router.navigate(['/jobs']);
      }
    });
  }

  checkIfApplied(): void {
    if (!this.job) return;

    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      this.hasApplied = appliedJobs.some((application: any) => 
        application.jobId === this.job?.id && application.userId === currentUser.id
      );
    }
  }

  applyForJob(): void {
    if (!this.job) return;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    const newApplication = {
      id: Date.now(),
      userId: currentUser.id,
      jobId: this.job.id,
      jobTitle: this.job.title,
      companyName: this.job.company,
      applicationDate: new Date(),
      status: 'pending'
    };

    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    appliedJobs.push(newApplication);
    localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));

    this.hasApplied = true;
  }
} 