import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any;

  constructor(
    private router: Router,
    private activeroute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    
    // Redirect to login if not authenticated
    if (!this.currentUser) {
      this.router.navigate(['/login/emp_login']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login/emp_login']);
  }

  jobs() {
    this.router.navigate(['jobs'], { relativeTo: this.activeroute });
  }

  appliedjobs() {
    this.router.navigate(['appliedjobs'], { relativeTo: this.activeroute });
  }

  gotoprofilepage() {
    this.router.navigate(['/seeker/eprofile']);
  }
}
