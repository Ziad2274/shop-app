import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy } from '@angular/core';
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
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
  });

  private readonly _auth = inject(AuthService);
  private readonly _router = inject(Router);

  errMsg: string = '';
  isLoading: boolean = false;
  isSuccess: boolean = false;
  slowLoading: boolean = false;
  private slowLoadingTimer: ReturnType<typeof setTimeout> | undefined;

  loginSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errMsg = '';
      this.isSuccess = false;
      this.slowLoading = false;
      clearTimeout(this.slowLoadingTimer);
      this.slowLoadingTimer = setTimeout(() => {
        this.slowLoading = true;
      }, 4000);

      this._auth.setLogin(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.slowLoading = false;
          clearTimeout(this.slowLoadingTimer);
          this.isSuccess = true;

          setTimeout(() => {
            this._router.navigate(['/home']);
          }, 2000);
        },
        error: (e: HttpErrorResponse) => {
          this.isLoading = false;
          this.slowLoading = false;
          clearTimeout(this.slowLoadingTimer);
          if (e.status === 0 || (e.status >= 502 && e.status <= 504)) {
            this.errMsg = "That took too long — the server may still be waking up after being idle. Please wait a moment and try again.";
          } else {
            this.errMsg = e.error?.message || 'Invalid email or password.';
          }
          console.error(this.errMsg);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.loginForm.setErrors({ invalidForm: true });
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.slowLoadingTimer);
  }
}