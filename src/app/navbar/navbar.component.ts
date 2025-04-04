import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: any;
  isLoggedIn = false;
  isSeeker = false;
  isRecruiter = false;
  userType: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.userType = user?.userType || null;
      this.currentUser = user;
      if (user) {
        this.isSeeker = user.userType === 'seeker';
        this.isRecruiter = user.userType === 'recruiter';
      } else {
        this.isSeeker = false;
        this.isRecruiter = false;
      }
    });
  }

  ngOnInit() {
    // Check if user is already logged in
    this.currentUser = this.authService.currentUserValue;
    this.isLoggedIn = !!this.currentUser;
    if (this.currentUser) {
      this.isSeeker = this.currentUser.userType === 'seeker';
      this.isRecruiter = this.currentUser.userType === 'recruiter';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login/emp_login']);
  }

  goToDashboard() {
    if (this.isSeeker) {
      this.router.navigate(['/dashboard/jobs']);
    } else if (this.isRecruiter) {
      this.router.navigate(['/rdashboard/postedjobs']);
    }
  }

  goToProfile() {
    if (this.isSeeker) {
      this.router.navigate(['/seeker/eprofile']);
    } else if (this.isRecruiter) {
      this.router.navigate(['/recruiter/rprofile']);
    }
  }
}
