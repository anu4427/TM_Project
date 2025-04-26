import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { tap, catchError, map, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LoginCredentials, AuthResponse, User, AuthState } from '../interfaces/auth.interface';
import { EmployeeRegister, EmployerRegister } from '../interfaces/register.interface';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'auth_state';
  private authState = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  redirectUrl: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private mockDataService: MockDataService
  ) {
    this.loadAuthState();
    this.initializeMockUsers();
  }

  private initializeMockUsers(): void {
    const existingUsers = localStorage.getItem('users');
    if (!existingUsers) {
      const mockUsers = [
        {
          id: '1',
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          role: 'employee',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('users', JSON.stringify(mockUsers));
    }
  }

  get currentUser$(): Observable<User | null> {
    return this.authState.asObservable().pipe(
      map(state => state.user)
    );
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.authState.asObservable().pipe(
      map(state => state.isAuthenticated)
    );
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          console.log('Attempting login with:', credentials.email);
          console.log('Available users:', users);

          const user = users.find((u: any) => 
            u.email.toLowerCase() === credentials.email.toLowerCase() && 
            u.password === credentials.password
          );

          if (user) {
            console.log('User found:', user);
            const response: AuthResponse = {
              token: 'mock-token-' + Date.now(),
              user: {
                id: user.id,
                name: user.name || `${user.firstName} ${user.lastName}`,
                email: user.email,
                role: user.role || 'employee',
                companyName: user.companyName,
                phoneNumber: user.phoneNumber,
                createdAt: user.createdAt || new Date().toISOString(),
                updatedAt: user.updatedAt || new Date().toISOString()
              }
            };

            // Store auth state in localStorage
            const authState: AuthState = {
              isAuthenticated: true,
              user: response.user,
              token: response.token
            };

            try {
              localStorage.setItem(this.AUTH_KEY, JSON.stringify(authState));
              // Update BehaviorSubject
              this.authState.next(authState);
              console.log('Login successful:', response);
              observer.next(response);
              observer.complete();
            } catch (error) {
              console.error('Error saving auth state:', error);
              observer.error({ message: 'Failed to save login state. Please try again.' });
            }
          } else {
            console.log('User not found or invalid credentials');
            observer.error({ message: 'Invalid email or password' });
          }
        } catch (error) {
          console.error('Login error:', error);
          observer.error({ message: 'An error occurred during login. Please try again.' });
        }
      }, 1000);
    });
  }

  registerEmployee(data: EmployeeRegister): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/register/employee`, data)
      .pipe(
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => new Error(error.error?.message || 'Registration failed. Please try again.'));
        })
      );
  }

  registerEmployer(data: EmployerRegister): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/register/employer`, data)
      .pipe(
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => new Error(error.error?.message || 'Registration failed. Please try again.'));
        })
      );
  }

  logout(): void {
    // Clear all auth-related data
    localStorage.removeItem(this.AUTH_KEY);
    sessionStorage.clear(); // Clear any session data
    
    // Reset the auth state
    this.authState.next({
      isAuthenticated: false,
      user: null,
      token: null
    });

    // Clear any cached data
    this.clearCachedData();
    
    console.log('User logged out');
  }

  private clearCachedData(): void {
    // Clear any application-specific cached data
    localStorage.removeItem('jobs');
    localStorage.removeItem('applications');
    localStorage.removeItem('user_preferences');
    // Add any other cached data that needs to be cleared
  }

  getToken(): string | null {
    return this.authState.value.token;
  }

  isAuthenticated(): boolean {
    return this.authState.value.isAuthenticated;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  private handleAuthSuccess(response: AuthResponse): void {
    const authState: AuthState = {
      isAuthenticated: true,
      user: response.user,
      token: response.token
    };
    
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(authState));
    this.authState.next(authState);
    console.log('Auth state updated:', authState);
  }

  loadAuthState(): void {
    const storedState = localStorage.getItem(this.AUTH_KEY);
    console.log('Loading auth state:', storedState);
    
    if (storedState) {
      try {
        const authState: AuthState = JSON.parse(storedState);
        this.authState.next(authState);
        console.log('Auth state loaded:', authState);
      } catch (error) {
        console.error('Error parsing auth state:', error);
        this.logout();
      }
    }
  }

  getCurrentUserId(): string | null {
    return this.authState.value.user?.id?.toString() || null;
  }

  getCurrentUser(): User | null {
    return this.authState.value.user || null;
  }

  updateProfile(profile: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/users/profile`, profile)
      .pipe(
        tap(response => {
          const currentState = this.authState.value;
          this.authState.next({
            ...currentState,
            user: { ...currentState.user, ...profile }
          });
        }),
        catchError(error => {
          console.error('Profile update error:', error);
          return throwError(() => new Error(error.error?.message || 'Failed to update profile'));
        })
      );
  }

  getEmployeeProfile(userId: string): Observable<EmployeeRegister> {
    return this.mockDataService.getEmployeeProfile(userId);
  }

  updateEmployeeProfile(userId: string, data: Partial<EmployeeRegister>): Observable<EmployeeRegister> {
    return this.mockDataService.updateEmployeeProfile(userId, data);
  }

  register(userData: any): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        try {
          const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
          if (existingUsers.some((user: any) => user.email.toLowerCase() === userData.email.toLowerCase())) {
            observer.error({ message: 'Email already exists' });
            return;
          }

          // Create the new user object
          const newUser = {
            id: Date.now().toString(),
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            name: `${userData.firstName} ${userData.lastName}`,
            role: userData.role,
            companyName: userData.companyName,
            phoneNumber: userData.phoneNumber,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          // Add to existing users
          existingUsers.push(newUser);
          localStorage.setItem('users', JSON.stringify(existingUsers));

          console.log('Registered user:', newUser); // Debug log

          // Create auth response
          const response: AuthResponse = {
            token: 'mock-token-' + Date.now(),
            user: {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
              companyName: newUser.companyName,
              phoneNumber: newUser.phoneNumber,
              createdAt: newUser.createdAt,
              updatedAt: newUser.updatedAt
            }
          };

          // Handle successful registration
          this.handleAuthSuccess(response);
          observer.next(response);
          observer.complete();
        } catch (error) {
          console.error('Registration error:', error);
          observer.error({ message: 'An error occurred during registration. Please try again.' });
        }
      }, 1000);
    });
  }

  getUserRole(): string {
    const user = this.getCurrentUser();
    return user ? user.role : '';
  }

  canActivate(): boolean {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
