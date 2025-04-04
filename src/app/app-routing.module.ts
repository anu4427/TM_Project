import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SeekerDashboardComponent } from './components/seeker-dashboard/seeker-dashboard.component';
import { RecruiterDashboardComponent } from './components/recruiter-dashboard/recruiter-dashboard.component';
import { PostJobComponent } from './components/post-job/post-job.component';
import { JobListingsComponent } from './components/job-listings/job-listings.component';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'seeker/dashboard', 
    component: SeekerDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'seeker' }
  },
  { 
    path: 'recruiter/dashboard', 
    component: RecruiterDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'recruiter' }
  },
  {
    path: 'jobs',
    component: JobListingsComponent,
    canActivate: [RoleGuard],
    data: { role: 'seeker' }
  },
  {
    path: 'post-job',
    component: PostJobComponent,
    canActivate: [RoleGuard],
    data: { role: 'recruiter' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
  LoginComponent,
  RegisterComponent,
  SeekerDashboardComponent,
  RecruiterDashboardComponent,
  PostJobComponent,
  JobListingsComponent
];
