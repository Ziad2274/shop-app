import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service'; 
import { Subscription } from 'rxjs';
import { IUserData } from '../../../core/interfaces/iproduct'; 
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-update-data', 
  templateUrl: './update-data.component.html', 
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
  styleUrls: ['./update-data.component.scss']
})
export class UpdateDataComponent implements OnInit, OnDestroy { 

  done: boolean = false;
  isLoading: boolean = true; 
  isUpdating: boolean = false; 
  errorMessage: string | null = null;

  private readonly router = inject(Router);
  private readonly _authService = inject(AuthService);
  private _dataSubscriber: Subscription | undefined;

  updateForm: FormGroup = new FormGroup({        
        
    name: new FormControl(null, [Validators.required, Validators.minLength(3),]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    phone: new FormControl(null, [
      Validators.required,
        Validators.pattern(/^(?:\+20|0)?1[0125]\d{8}$/),
    ]),
  });

  ngOnInit(): void {
    this.isLoading = true;
    
    this._dataSubscriber = this._authService.getUser(this._authService.userPayload.id).subscribe({
      next: (response) => {
        this.isLoading = false;
        const userData: IUserData = response.data; 
        
        this.updateForm.patchValue({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching user data:', err);
        this.errorMessage = 'Failed to load user data. Please try again.';
      }
    });
  }


  onSubmit() {
    this.errorMessage = null; // Clear previous errors

    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    this.isUpdating = true; // Use separate flag for submission spinner

    const formData = this.updateForm.value;

    // Using the renamed method: updateUserData()
    this._dataSubscriber = this._authService.updateUser(formData).subscribe({
      next: (response) => {
        this.isUpdating = false;
        if (response.message === 'success' || response.data) {
          console.log('User data successfully updated.');
          this.done = true;
          // Refresh the user token payload if necessary (e.g., if name/email changed)
          this._authService.saveUserToken(); 
          
          setTimeout(() => this.router.navigate(['/profile']), 2000);
        } else {
          this.errorMessage = response.message || 'Data update failed. Please check the entered information.';
        }
      },
      error: (err) => {
        this.isUpdating = false;
        console.error('Error during data update:', err);
        this.errorMessage = err.error?.message || 'An unexpected error occurred during update. Please try again.';
      }
    });
  }

  ngOnDestroy(): void {
    this._dataSubscriber?.unsubscribe();
  }
}