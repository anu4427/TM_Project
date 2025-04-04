import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) { }

  // Get all jobs with optional filters
  getJobs(filters?: { title?: string; location?: string; jobType?: string }): Observable<any[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.title) params = params.set('title', filters.title);
      if (filters.location) params = params.set('location', filters.location);
      if (filters.jobType) params = params.set('jobType', filters.jobType);
    }
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  // Get job by ID
  getJobById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Create new job (Recruiter only)
  createJob(jobData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, jobData);
  }

  // Update job (Recruiter only)
  updateJob(id: number, jobData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, jobData);
  }

  // Delete job (Recruiter only)
  deleteJob(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
} 