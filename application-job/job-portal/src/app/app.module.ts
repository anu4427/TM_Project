import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobDetailComponent } from './components/job-detail/job-detail.component';
import { PostJobComponent } from './components/post-job/post-job.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';
import { JobService } from './services/job.service';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'jobs', 
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: JobListComponent },
      { path: ':id', component: JobDetailComponent }
    ]
  },
  { 
    path: 'post-job', 
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: PostJobComponent }
    ]
  },
  // Catch-all route for unmatched paths
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    JobListComponent,
    JobDetailComponent,
    PostJobComponent,
    LayoutComponent,
    ForgotPasswordComponent,
    DashboardComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AuthService, JobService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
