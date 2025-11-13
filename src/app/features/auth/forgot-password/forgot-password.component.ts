import { Observable, Subscription } from 'rxjs';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnDestroy{
  sent = false;
  private readonly fb: FormBuilder=inject(FormBuilder);
  private readonly router: Router=inject(Router);
  private readonly _authService=inject(AuthService);

  private  forgotPasswordSubscriber!:Subscription;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  get email() {
    return this.form.get('email')!;
  }

  onSubmit() {
    if (this.form.valid) {
     this.forgotPasswordSubscriber= this._authService.forgotPassword(this.form.value).subscribe(
        {next: (response) => {
          console.log('Forgot password response:', response);
          if (response.statusMsg==="success") {
            this.sent = true;
            setTimeout(() => this.router.navigate(['/verify-code']), 1500);

          }
        },
        error: (error) => {
          console.error('Error during forgot password Check if E-mail Exists', error);
        }

      }
      );

    }
  }
  ngOnDestroy(): void {
    this.forgotPasswordSubscriber?.unsubscribe();
  }
}
