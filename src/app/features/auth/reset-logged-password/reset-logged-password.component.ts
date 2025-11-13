import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { MatCard } from '@angular/material/card';

export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const rePassword = control.get('rePassword')?.value;

    if (password && rePassword && password !== rePassword) {
        return { passwordsMismatch: true }; 
    }
    return null;
}

@Component({
  selector: 'app-reset-logged-password',
  templateUrl: './reset-logged-password.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCard
  ],
  styleUrls: ['./reset-logged-password.component.scss']
})
export class ResetLoggedPasswordComponent implements OnDestroy {

  done: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  private readonly router = inject(Router);
  private readonly _authService = inject(AuthService);
  private _resetPasswordSubscriber: Subscription | undefined;

  resetLoggedForm: FormGroup = new FormGroup({
    currentPassword: new FormControl(null, [
      Validators.required
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$'), 
    ]),
    rePassword: new FormControl(null, [
      Validators.required
    ])
  }, { validators: passwordsMatchValidator }); 


  onSubmit() {
    this.errorMessage = null; 
    
    if (this.resetLoggedForm.invalid) {
        this.resetLoggedForm.markAllAsTouched();
        return;
    }
    
    this.isLoading = true;

    const formData = this.resetLoggedForm.value;

    this._resetPasswordSubscriber = this._authService.changePassword(formData).subscribe({
        next: (response) => {
            this.isLoading = false;
            if (response.message === 'success' || response.token) {
                console.log('Password successfully updated.');
                this.done = true;
                this.resetLoggedForm.reset(); 
                setTimeout(() => this.router.navigate(['/profile']), 2000); 
            } else {
                this.errorMessage = response.message || 'Password update failed. Please check your current password.';
            }
        },
        error: (err) => {
            this.isLoading = false;
            console.error('Error during password reset:', err);
            this.errorMessage = err.error?.message || 'An unexpected error occurred. Please try again.';
        }
    });
  }

  ngOnDestroy(): void {
    this._resetPasswordSubscriber?.unsubscribe();
  }
}