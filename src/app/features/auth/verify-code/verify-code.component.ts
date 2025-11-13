import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss']
})
export class VerifyCodeComponent implements OnDestroy{
  verified = false;
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly _authService = inject(AuthService);

  private verifyCodeSubscriber!:Subscription;

  verifyForm: FormGroup = new FormGroup({
    resetCode:new FormControl( '', [Validators.required, Validators.pattern(/^\d{5,6}$/)]),


  });

  onSubmit() {
    if (this.verifyForm.valid) {
    this.verifyCodeSubscriber=  this._authService.verifyResetCode(this.verifyForm.value).subscribe({
        next: (response) => {
          console.log('Verify code response:', response);
          if (response.status==="Success") {
            this.verified = true;
            setTimeout(() => this.router.navigate(['/reset-password']), 1000);
            
          }
        },
        error: (error) => {
          console.error('Error during code verification:', error);
        }
      });
    }
  }
  ngOnDestroy(): void {
    this.verifyCodeSubscriber?.unsubscribe();
  }
}
