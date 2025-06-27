import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobService } from '../../services/job.service';
import { Job } from '../../interfaces/job.interface';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  searchTerm: string = '';
  selectedLocation: string = '';
  selectedType: string = '';

  constructor(
    private jobService: JobService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (jobs: Job[]) => {
        this.jobs = jobs;
        this.filterJobs();
      },
      error: (error: any) => {
        console.error('Error loading jobs:', error);
      }
    });
  }

  filterJobs(): void {
    this.filteredJobs = this.jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesLocation = !this.selectedLocation || job.location === this.selectedLocation;
      const matchesType = !this.selectedType || job.type === this.selectedType;
      return matchesSearch && matchesLocation && matchesType;
    });
  }

  onSearch(): void {
    this.filterJobs();
  }

  onLocationChange(): void {
    this.filterJobs();
  }

  onTypeChange(): void {
    this.filterJobs();
  }

  viewJobDetails(jobId: string): void {
    this.router.navigate(['/jobs', jobId]);
  }
} 