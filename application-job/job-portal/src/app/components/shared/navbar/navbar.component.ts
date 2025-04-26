import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  currentUser: any = null;
  isMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
      this.currentUser = this.authService.getCurrentUser();
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    // Close mobile menu if open
    this.isMenuOpen = false;
    
    // Call auth service logout
    this.authService.logout();
    
    // Navigate to login page
    this.router.navigate(['/login'])
      .then(() => {
        // Optional: Scroll to top of page
        window.scrollTo(0, 0);
      });
  }
}
