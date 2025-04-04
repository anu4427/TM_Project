import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRole = route.data['role'];
    const userType = this.authService.getUserType();

    if (userType === requiredRole) {
      return true;
    }

    // If user type doesn't match, redirect to appropriate dashboard
    if (userType === 'seeker') {
      this.router.navigate(['/seeker/dashboard']);
    } else if (userType === 'recruiter') {
      this.router.navigate(['/recruiter/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }

    return false;
  }
} 