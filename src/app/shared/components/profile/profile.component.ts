import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { IProfile } from '../../../core/interfaces/iproduct';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private readonly _authService = inject(AuthService);

  profile: IProfile | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this._authService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load profile';
        this.loading = false;
      }
    });
  }
}
