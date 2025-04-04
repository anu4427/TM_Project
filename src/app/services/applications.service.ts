import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

export interface JobApplication {
  id: number;
  job_id: number;
  seeker_id: number;
  status: 'pending' | 'accepted' | 'rejected';
  applied_date: string;
  job?: {
    title: string;
    company_name: string;
    location: string;
    job_type: string;
  };
  seeker?: {
    name: string;
    email: string;
    phone: string;
    resume_url: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  // Get all applications for a job (Recruiter only)
  getJobApplications(jobId: number): Observable<JobApplication[]> {
    return this.get<JobApplication[]>(`/applications/job/${jobId}`);
  }

  // Get all applications by the current seeker
  getSeekerApplications(): Observable<JobApplication[]> {
    return this.get<JobApplication[]>('/applications/seeker');
  }

  // Apply for a job
  applyForJob(jobId: number): Observable<JobApplication> {
    return this.post<JobApplication>('/applications', { job_id: jobId });
  }

  // Update application status (Recruiter only)
  updateApplicationStatus(applicationId: number, status: 'accepted' | 'rejected'): Observable<JobApplication> {
    return this.put<JobApplication>(`/applications/${applicationId}`, { status });
  }

  // Get application details
  getApplicationById(applicationId: number): Observable<JobApplication> {
    return this.get<JobApplication>(`/applications/${applicationId}`);
  }

  // Get applications statistics for a recruiter
  getRecruiterStats(): Observable<{
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
  }> {
    return this.get<any>('/applications/stats/recruiter');
  }

  // Get applications statistics for a seeker
  getSeekerStats(): Observable<{
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
  }> {
    return this.get<any>('/applications/stats/seeker');
  }

  // Withdraw an application (Seeker only)
  withdrawApplication(applicationId: number): Observable<void> {
    return this.delete<void>(`/applications/${applicationId}`);
  }
} 