import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profiles`;

  constructor(private http: HttpClient) { }

  // Get current user's profile
  getProfile(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Update profile
  updateProfile(profileData: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, profileData);
  }

  // Update password
  updatePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/password`, {
      currentPassword,
      newPassword
    });
  }
} 