import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
  });

  private readonly _auth = inject(AuthService);
  private readonly _router = inject(Router);

  errMsg: string = '';
  isLoading: boolean = false;
  isSuccess: boolean = false;

  loginSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errMsg = '';
      this.isSuccess = false;

      this._auth.setLogin(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isSuccess = true;

          setTimeout(() => {
            this._router.navigate(['/home']);
          }, 2000);
        },
        error: (e: HttpErrorResponse) => {
          this.errMsg = e.error.message || 'Invalid email or password.';
          console.error(this.errMsg);
          this.isLoading = false;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.loginForm.setErrors({ invalidForm: true });
    }
  }
}