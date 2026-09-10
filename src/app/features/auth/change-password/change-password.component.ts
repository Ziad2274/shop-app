import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  form: FormGroup = new FormGroup({
    currentPassword: new FormControl(null, [Validators.required]),
    newPassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
  });

  private readonly _auth = inject(AuthService);
  private readonly _router = inject(Router);

  errMsg: string = '';
  isLoading: boolean = false;
  isSuccess: boolean = false;

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errMsg = '';
    this.isSuccess = false;

    const { currentPassword, newPassword } = this.form.value;

    this._auth.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
        this.form.reset();
      },
      error: (e: HttpErrorResponse) => {
        this.isLoading = false;
        this.errMsg = e.error?.message || e.error || 'Failed to change password. Check your current password.';
      }
    });
  }
}
