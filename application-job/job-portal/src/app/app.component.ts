import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  isRecruiter(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === 'company';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
