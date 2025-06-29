import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../../../services/job.service';
import { Job } from '../../../models/job.model';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent implements OnInit {
  jobForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private router: Router
  ) {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required]],
      company: ['', [Validators.required]],
      location: ['', [Validators.required]],
      type: ['', [Validators.required]],
      description: ['', [Validators.required]],
      requirements: ['', [Validators.required]],
      salary: [''],
      deadline: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.jobForm.valid) {
      this.isLoading = true;
      const jobData = {
        ...this.jobForm.value,
        requirements: this.jobForm.value.requirements.split('\n').filter((req: string) => req.trim())
      };

      this.jobService.createJob(jobData).subscribe({
        next: () => {
          this.successMessage = 'Job posted successfully!';
          setTimeout(() => {
            this.router.navigate(['/jobs']);
          }, 2000);
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to post job. Please try again later.';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
