import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isAuthenticated()) {
      // Check if route requires specific user type
      const requiredUserType = route.data['userType'];
      if (requiredUserType) {
        const userType = this.authService.getUserType();
        if (userType !== requiredUserType) {
          // Redirect to appropriate login page
          this.router.navigate(['/login', userType === 'seeker' ? 'emp_login' : 'rec_login']);
          return false;
        }
      }
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login/emp_login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
} 