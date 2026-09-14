import { Component, inject, OnDestroy } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, ReactiveFormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnDestroy {
  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(20),
      ]), //'intial value backend'
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$'),
      ]),
      rePassword: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(?:\+20|0)?1[0125]\d{8}$/),
      ]),
    },
    this.confirmPassword
  );

  confirmPassword(x: AbstractControl) {
    const password = x.get('password')?.value;
    const rePassword = x.get('rePassword')?.value;
    if (password !== rePassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  private readonly _auth = inject(AuthService);
  private readonly _router = inject(Router);
  errMsg: string = '';
  isloading: boolean = false;
  isSuccess: boolean = false;
  // True once a request has been pending a while — lets the UI hint that the
  // free-tier backend may just be waking up from being idle, instead of
  // looking stuck or silently failing.
  slowLoading: boolean = false;
  private slowLoadingTimer: ReturnType<typeof setTimeout> | undefined;

  registerSubmit() {
    if (this.registerForm.valid) {
      this.isloading = true;
      this.errMsg = '';
      this.isSuccess = false;
      this.slowLoading = false;
      clearTimeout(this.slowLoadingTimer);
      this.slowLoadingTimer = setTimeout(() => {
        this.slowLoading = true;
      }, 4000);

      this._auth.setRegister(this.registerForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.isloading = false;
          this.slowLoading = false;
          clearTimeout(this.slowLoadingTimer);
          this.isSuccess = true;
          setTimeout(() => {
          this._router.navigate(['/login']);
          }, 2000);
        },
        error: (e: HttpErrorResponse) => {
          this.isloading = false;
          this.slowLoading = false;
          clearTimeout(this.slowLoadingTimer);
          if (e.status === 0 || (e.status >= 502 && e.status <= 504)) {
            // Timed out / gateway error — very likely the free-tier backend
            // was just waking up from being idle. The request may well have
            // gone through on the server side despite the timeout.
            this.errMsg = "That took too long — the server may still be waking up after being idle. Please wait a moment, then try signing in instead; your account may already be created.";
          } else {
            this.errMsg = e.error?.message || 'Something went wrong. Please try again.';
          }
          console.log(this.errMsg);
        },
      });
    } else {
      this.registerForm.setErrors({ invalidForm: true });
      this.registerForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.slowLoadingTimer);
  }
}
//ferej91555@fergetic.com