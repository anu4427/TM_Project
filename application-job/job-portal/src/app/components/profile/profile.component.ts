import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface UserProfile {
  id: number;   
  email: string;
  role: string;
  name?: string;
  company?: string;
  phone?: string;
  location?: string;
  bio?: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile = {
    id: 0,
    email: '',
    role: ''
  };

  isEditing: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.profile = { ...currentUser };
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    this.authService.updateProfile(this.profile).subscribe({
      next: (response: any) => {
        this.isEditing = false;
        this.error = '';
      },
      error: (error: any) => {
        this.error = 'Failed to update profile. Please try again.';
      }
    });
  }

  cancelEdit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.profile = { ...currentUser };
    }
    this.isEditing = false;
    this.error = '';
  }
} 