import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
  userType: 'seeker' | 'recruiter';
  company_name?: string;
  phone?: string;
  token?: string;
}

interface MockUser extends Omit<User, 'token'> {
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string, userType: 'seeker' | 'recruiter'): Promise<User> {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        // Mock users for testing
        const mockUsers: Record<'seeker' | 'recruiter', MockUser[]> = {
          seeker: [
            { id: 1, email: 'seeker1@example.com', password: 'password123', name: 'Alice Seeker', userType: 'seeker', phone: '1112223333' },
            { id: 2, email: 'seeker2@example.com', password: 'password123', name: 'Bob Seeker', userType: 'seeker', phone: '4445556666' }
          ],
          recruiter: [
            { id: 1, email: 'recruiter1@example.com', password: 'password123', name: 'John Recruiter', userType: 'recruiter', company_name: 'Tech Corp', phone: '1234567890' },
            { id: 2, email: 'recruiter2@example.com', password: 'password123', name: 'Jane Recruiter', userType: 'recruiter', company_name: 'Innovation Inc', phone: '0987654321' }
          ]
        };

        const users = mockUsers[userType];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
          const { password, ...userWithoutPassword } = user;
          const token = 'mock-jwt-token';
          const userWithToken: User = { ...userWithoutPassword, token };
          
          localStorage.setItem('currentUser', JSON.stringify(userWithToken));
          this.currentUserSubject.next(userWithToken);
          resolve(userWithToken);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }

  register(userData: Partial<User>): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: Math.floor(Math.random() * 1000),
          email: userData.email || '',
          name: userData.name || '',
          userType: userData.userType || 'seeker',
          company_name: userData.company_name,
          phone: userData.phone,
          token: 'mock-jwt-token'
        };
        
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.currentUserSubject.next(newUser);
        resolve(newUser);
      }, 1000);
    });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  getUserType(): 'seeker' | 'recruiter' | null {
    return this.currentUserValue?.userType || null;
  }
} 