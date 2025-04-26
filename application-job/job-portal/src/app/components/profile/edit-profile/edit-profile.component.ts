import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { EmployeeRegister } from '../../../interfaces/register.interface';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup = this.fb.group({});
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  readonly interestOptions = ['IOT', 'AI', 'ML', 'Web Development', 'UI/UX', 'Mobile Development', 'Cloud Computing', 'Data Science', 'Big Data'];
  readonly departmentOptions = ['IT', 'Services', 'Others'];
  readonly maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
  readonly genderOptions = ['Male', 'Female', 'Other'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      hometown: ['', Validators.required],
      interests: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      experience: [0, [Validators.required, Validators.min(0)]],
      maritalStatus: ['', Validators.required],
      nationality: ['', Validators.required],
      languagesKnown: ['', Validators.required],
      currentLocation: ['', Validators.required],
      lastJobExperience: [''],
      lastDesignation: [''],
      department: ['', Validators.required],
      reasonForLeaving: ['']
    });
  }

  private loadProfile(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.errorMessage = 'User not authenticated';
      return;
    }

    this.isLoading = true;
    this.authService.getEmployeeProfile(userId).subscribe({
      next: (profile) => {
        // Convert arrays to strings for form controls
        const formData = {
          ...profile,
          languagesKnown: profile.languagesKnown.join(', '),
          interests: profile.interests
        };
        this.profileForm.patchValue(formData);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load profile';
        this.isLoading = false;
      }
    });
  }

  get interestsArray() {
    return this.profileForm.get('interests') as FormArray;
  }

  onInterestChange(checked: boolean, interest: string): void {
    if (checked) {
      this.interestsArray.push(this.fb.control(interest));
    } else {
      const index = this.interestsArray.value.indexOf(interest);
      if (index > -1) {
        this.interestsArray.removeAt(index);
      }
    }
  }

  isInterestSelected(interest: string): boolean {
    return this.interestsArray.value.includes(interest);
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const userId = this.authService.getCurrentUserId();
      if (!userId) {
        this.errorMessage = 'User not authenticated';
        this.isLoading = false;
        return;
      }

      const formData = this.profileForm.value;
      // Convert languages string back to array
      formData.languagesKnown = formData.languagesKnown
        .split(',')
        .map((lang: string) => lang.trim())
        .filter((lang: string) => lang);

      this.authService.updateEmployeeProfile(userId, formData).subscribe({
        next: () => {
          this.successMessage = 'Profile updated successfully';
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to update profile';
          this.isLoading = false;
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.profileForm.get(controlName);
    return control?.errors?.[errorType] && control.touched;
  }
} 