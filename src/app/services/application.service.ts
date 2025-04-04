import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient) { }

  // Get all applications for the current job seeker
  getMyApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/seeker`);
  }

  // Get all applications for a specific job (Recruiter only)
  getJobApplications(jobId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/job/${jobId}`);
  }

  // Apply for a job (Job seeker only)
  applyForJob(jobId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${jobId}`, {});
  }

  // Update application status (Recruiter only)
  updateApplicationStatus(applicationId: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${applicationId}`, { status });
  }
} 