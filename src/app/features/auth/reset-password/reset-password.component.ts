import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnDestroy{

  done = false;
    private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly _authService= inject(AuthService);
  private _reserPsswordSubscriber:Subscription

  resetForm: FormGroup = new FormGroup({    
    email: new FormControl(null, [Validators.required, Validators.email]),
      newPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$'),
      ]),  });


  onSubmit() {
    if (this.resetForm.valid ) {
      
        this._reserPsswordSubscriber= this._authService.resetPassword(this.resetForm.value).subscribe({
        next: (response) => {
          console.log('Verify code Success:',);

          console.log('Verify code response:', response.token);
          if (response.token!==null) {
            localStorage.setItem('userToken', response.token);  
            this._authService.saveUserToken();
                this.done = true;
          setTimeout(() => this.router.navigate(['/home']), 2000);
            
          }
          else if (response.statusMsg==='error') {
          console.error('Error during code verification2:');

          }
        },
        error: (error) => {
          console.error('Error during code verification:', error);
        }
      });
    }
  }
  ngOnDestroy(){
    this._reserPsswordSubscriber?.unsubscribe();
  }
}
