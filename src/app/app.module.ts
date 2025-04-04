import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { ForseekerService } from './forseeker.service';
import { ForrecruiterService } from './forrecruiter.service';
import { AuthService } from './services/auth.service';
import { JobsService } from './services/jobs.service';
import { ApplicationsService } from './services/applications.service';
import { ProfilesService } from './services/profiles.service';
import { JobSearchComponent } from './components/job-search/job-search.component';
import { RegisterComponent } from './components/register/register.component';
import { SeekerDashboardComponent } from './components/seeker-dashboard/seeker-dashboard.component';
import { RecruiterDashboardComponent } from './components/recruiter-dashboard/recruiter-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';
import { PostJobComponent } from './components/post-job/post-job.component';

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
  }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    routingComponents,
    LoginComponent,
    JobSearchComponent,
    RegisterComponent,
    SeekerDashboardComponent,
    RecruiterDashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    ForseekerService,
    ForrecruiterService,
    AuthService,
    JobsService,
    ApplicationsService,
    ProfilesService,
    RoleGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
