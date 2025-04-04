import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-job-listings',
  templateUrl: './job-listings.component.html',
  styleUrls: ['./job-listings.component.scss']
})
export class JobListingsComponent implements OnInit {
  filterForm: FormGroup;
  loading = false;
  
  // Mock job listings data
  jobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$120,000 - $150,000',
      posted: '2024-02-20',
      description: 'We are looking for an experienced software engineer to join our team...',
      requirements: '5+ years of experience, Strong JavaScript skills, React expertise',
      applied: false
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Innovation Labs',
      location: 'Remote',
      type: 'Full-time',
      salary: '$100,000 - $130,000',
      posted: '2024-02-19',
      description: 'Seeking a product manager to lead our new initiative...',
      requirements: '3+ years of product management, Agile certification',
      applied: true
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'Creative Solutions',
      location: 'San Francisco, CA',
      type: 'Contract',
      salary: '$90,000 - $110,000',
      posted: '2024-02-18',
      description: 'Join our design team to create beautiful user experiences...',
      requirements: 'Portfolio required, Figma expertise, 2+ years experience',
      applied: false
    }
  ];

  jobTypes = ['All Types', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  locations = ['All Locations', 'New York, NY', 'San Francisco, CA', 'Remote'];

  constructor(private formBuilder: FormBuilder) {
    this.filterForm = this.formBuilder.group({
      search: [''],
      type: ['All Types'],
      location: ['All Locations']
    });
  }

  ngOnInit() {
    this.filterForm.valueChanges.subscribe(() => {
      // In a real app, this would trigger an API call with the filters
      console.log('Filters changed:', this.filterForm.value);
    });
  }

  get filteredJobs() {
    let filtered = [...this.jobs];
    const filters = this.filterForm.value;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(search) ||
        job.company.toLowerCase().includes(search) ||
        job.description.toLowerCase().includes(search)
      );
    }

    if (filters.type !== 'All Types') {
      filtered = filtered.filter(job => job.type === filters.type);
    }

    if (filters.location !== 'All Locations') {
      filtered = filtered.filter(job => job.location === filters.location);
    }

    return filtered;
  }

  applyForJob(jobId: number) {
    // In a real app, this would make an API call
    this.jobs = this.jobs.map(job => 
      job.id === jobId ? { ...job, applied: true } : job
    );
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
} 