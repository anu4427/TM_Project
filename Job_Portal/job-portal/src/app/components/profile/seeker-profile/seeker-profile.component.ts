import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { EmployeeRegister } from '../../../interfaces/register.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seeker-profile',
  templateUrl: './seeker-profile.component.html',
  styleUrls: ['./seeker-profile.component.scss']
})
export class SeekerProfileComponent implements OnInit {
  profile: EmployeeRegister | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Get the current user's ID from the auth service
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.errorMessage = 'User not authenticated';
      this.isLoading = false;
      return;
    }

    // Fetch profile data from the API
    this.authService.getEmployeeProfile(userId).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load profile';
        this.isLoading = false;
      }
    });
  }

  editProfile(): void {
    this.router.navigate(['/profile/edit']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
