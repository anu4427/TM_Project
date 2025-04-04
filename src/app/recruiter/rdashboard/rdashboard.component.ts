import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-rdashboard',
  templateUrl: './rdashboard.component.html',
  styleUrls: ['./rdashboard.component.css']
})
export class RdashboardComponent implements OnInit {
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
      this.router.navigate(['/login/rec_login']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login/rec_login']);
  }

  applied_Employees() {
    this.router.navigate(['applied'], { relativeTo: this.activeroute });
  }

  posted_jobs() {
    this.router.navigate(['postedjobs'], { relativeTo: this.activeroute });
  }

  gotoprofilepage() {
    this.router.navigate(['/recruiter/rprofile']);
  }
}
