import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

export interface Job {
  id: number;
  recruiter_id: number;
  title: string;
  description: string;
  requirements: string;
  salary_range: string;
  location: string;
  job_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  company_name?: string;
  recruiter_name?: string;
}

export interface JobFilters {
  title?: string;
  location?: string;
  jobType?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobsService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  getAllJobs(filters?: JobFilters): Observable<Job[]> {
    let endpoint = '/jobs';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.title) params.append('title', filters.title);
      if (filters.location) params.append('location', filters.location);
      if (filters.jobType) params.append('jobType', filters.jobType);
      if (filters.status) params.append('status', filters.status);
      endpoint += `?${params.toString()}`;
    }
    return this.get<Job[]>(endpoint);
  }

  getJobById(id: number): Observable<Job> {
    return this.get<Job>(`/jobs/${id}`);
  }

  createJob(jobData: Partial<Job>): Observable<Job> {
    return this.post<Job>('/jobs', jobData);
  }

  updateJob(id: number, jobData: Partial<Job>): Observable<Job> {
    return this.put<Job>(`/jobs/${id}`, jobData);
  }

  deleteJob(id: number): Observable<void> {
    return this.delete<void>(`/jobs/${id}`);
  }

  getRecruiterJobs(): Observable<Job[]> {
    return this.get<Job[]>('/jobs/recruiter');
  }

  getAppliedJobs(): Observable<Job[]> {
    return this.get<Job[]>('/jobs/applied');
  }

  searchJobs(searchParams: {
    keyword?: string;
    location?: string;
    jobType?: string;
    salary?: string;
    page?: number;
    limit?: number;
  }): Observable<{ jobs: Job[]; total: number }> {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    return this.get<{ jobs: Job[]; total: number }>(`/jobs/search?${params.toString()}`);
  }
} 