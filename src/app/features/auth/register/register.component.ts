import { Component, inject } from '@angular/core';
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
export class RegisterComponent {
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

  registerSubmit() {
    if (this.registerForm.valid) {
      this.isloading = true;
      this._auth.setRegister(this.registerForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.isloading = false;
          this.isSuccess = true;
          setTimeout(() => {
          this._router.navigate(['/login']);
          }, 2000);
        },
        error: (e: HttpErrorResponse) => {
          this.errMsg = e.error.message;
          console.log(this.errMsg);
          this.isloading = false;
        },
      });
    } else {
      this.registerForm.setErrors({ invalidForm: true });
      this.registerForm.markAllAsTouched();
    }
  }
}
//ferej91555@fergetic.com