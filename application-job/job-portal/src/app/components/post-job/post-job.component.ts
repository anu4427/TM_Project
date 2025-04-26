import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';

interface JobForm {
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.scss']
})
export class PostJobComponent {
  jobForm: JobForm = {
    title: '',
    company: '',
    location: '',
    type: '',
    description: '',
    requirements: ['']
  };

  error: string = '';

  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'company') {
      this.router.navigate(['/dashboard']);
    }
  }

  addRequirement(): void {
    this.jobForm.requirements.push('');
  }

  removeRequirement(index: number): void {
    if (this.jobForm.requirements.length > 1) {
      this.jobForm.requirements.splice(index, 1);
    }
  }

  onSubmit(): void {
    // Filter out empty requirements
    const requirements = this.jobForm.requirements.filter(req => req.trim() !== '');
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.error = 'You must be logged in to post a job';
      return;
    }

    const jobData = {
      ...this.jobForm,
      requirements,
      companyId: currentUser.id,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };

    this.jobService.createJob(jobData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.error = 'Failed to post job. Please try again.';
        console.error('Error posting job:', error);
      }
    });
  }
} 