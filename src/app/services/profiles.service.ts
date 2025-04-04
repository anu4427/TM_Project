import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

export interface SeekerProfile {
  id: number;
  email: string;
  name: string;
  phone: string;
  experience: string;
  skills: string;
  education: string;
  resume_url: string;
}

export interface RecruiterProfile {
  id: number;
  email: string;
  name: string;
  company_name: string;
  phone: string;
  company_description?: string;
  company_website?: string;
  company_location?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfilesService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  // Get seeker profile
  getSeekerProfile(): Observable<SeekerProfile> {
    return this.get<SeekerProfile>('/profiles/seeker');
  }

  // Update seeker profile
  updateSeekerProfile(profileData: Partial<SeekerProfile>): Observable<SeekerProfile> {
    return this.put<SeekerProfile>('/profiles/seeker', profileData);
  }

  // Get recruiter profile
  getRecruiterProfile(): Observable<RecruiterProfile> {
    return this.get<RecruiterProfile>('/profiles/recruiter');
  }

  // Update recruiter profile
  updateRecruiterProfile(profileData: Partial<RecruiterProfile>): Observable<RecruiterProfile> {
    return this.put<RecruiterProfile>('/profiles/recruiter', profileData);
  }

  // Upload resume (Seeker only)
  uploadResume(file: File): Observable<{ resume_url: string }> {
    const formData = new FormData();
    formData.append('resume', file);
    return this.post<{ resume_url: string }>('/profiles/seeker/resume', formData);
  }

  // Get seeker profile by ID (Recruiter only)
  getSeekerProfileById(seekerId: number): Observable<SeekerProfile> {
    return this.get<SeekerProfile>(`/profiles/seeker/${seekerId}`);
  }

  // Get recruiter profile by ID
  getRecruiterProfileById(recruiterId: number): Observable<RecruiterProfile> {
    return this.get<RecruiterProfile>(`/profiles/recruiter/${recruiterId}`);
  }

  // Update profile picture
  uploadProfilePicture(file: File): Observable<{ picture_url: string }> {
    const formData = new FormData();
    formData.append('picture', file);
    return this.post<{ picture_url: string }>('/profiles/picture', formData);
  }
} 