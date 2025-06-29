import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { JobListComponent } from './components/jobs/job-list/job-list.component';
import { JobDetailComponent } from './components/jobs/job-detail/job-detail.component';
import { JobFormComponent } from './components/jobs/job-form/job-form.component';
import { CompanyProfileComponent } from './components/profile/company-profile/company-profile.component';
import { SeekerProfileComponent } from './components/profile/seeker-profile/seeker-profile.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { EditProfileComponent } from './components/profile/edit-profile/edit-profile.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['employee', 'employer'] }
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { 
    path: 'jobs', 
    component: JobListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['employee'] }
  },
  { 
    path: 'jobs/:id', 
    component: JobDetailComponent,
    canActivate: [AuthGuard]
  },
  { path: 'jobs/new', component: JobFormComponent },
  { path: 'profile/company', component: CompanyProfileComponent },
  {
    path: 'profile',
    component: SeekerProfileComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['employee'] }
  },
  {
    path: 'profile/edit',
    component: EditProfileComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['employee'] }
  },
  { path: 'navbar', component: NavbarComponent },
  { path: 'footer', component: FooterComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
