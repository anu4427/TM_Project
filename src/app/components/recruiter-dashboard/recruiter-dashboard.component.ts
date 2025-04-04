import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recruiter-dashboard',
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.scss']
})
export class RecruiterDashboardComponent implements OnInit {
  currentUser: any;
  postedJobs: number = 0;
  totalApplications: number = 0;
  activeJobs: number = 0;
  hasApplications: boolean = false;
  hasActiveJobs: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Check if user is authenticated and is a recruiter
    if (!this.authService.isAuthenticated() || this.authService.getUserType() !== 'recruiter') {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.currentUserValue;
    
    // TODO: Fetch actual data from a service
    // For now using mock data
    this.postedJobs = 0;
    this.totalApplications = 0;
    this.activeJobs = 0;
    this.hasApplications = false;
    this.hasActiveJobs = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 