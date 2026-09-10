import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressService } from '../../core/services/address.service';
import { IAddress } from '../../core/interfaces/iproduct';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.scss'
})
export class AddressesComponent implements OnInit {
  private readonly _addressService = inject(AddressService);

  addresses: IAddress[] = [];
  loading = true;
  submitting = false;
  errMsg = '';

  form = new FormGroup({
    city: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses() {
    this.loading = true;
    this._addressService.getMyAddresses().subscribe({
      next: (res) => {
        this.addresses = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  addAddress() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.errMsg = '';
    this._addressService.addAddress(this.form.value as any).subscribe({
      next: () => {
        this.submitting = false;
        this.form.reset();
        this.loadAddresses();
      },
      error: (err) => {
        this.submitting = false;
        this.errMsg = err.error?.message || 'Failed to add address.';
      }
    });
  }

  deleteAddress(id: string) {
    this._addressService.deleteAddress(id).subscribe({
      next: () => {
        this.addresses = this.addresses.filter(a => a._id !== id);
      },
      error: (err) => console.error(err)
    });
  }
}
