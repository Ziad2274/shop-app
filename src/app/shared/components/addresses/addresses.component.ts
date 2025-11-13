import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AddressesService } from '../../../core/services/addresses.service';
import { IAddess } from '../../../core/interfaces/iproduct';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.scss'
})
export class AddressesComponent implements OnInit {
  private readonly _addressesService = inject(AddressesService);
  private readonly fb = inject(FormBuilder);

  addressesList: IAddess[] = [];
  isLoading:boolean=false;


   addressForm = this.fb.group({
    name: ['', Validators.required],
    details: ['', Validators.required],
    phone: [
      '',
      [Validators.required, Validators.pattern(/^01[0-9]{9}$/)] // Egyptian phone format
    ],
    city: ['', Validators.required]
  });

  ngOnInit() {
    this.getAdresses();
  }

  getAdresses() {
    this._addressesService.getAllAdresses().subscribe({
      next: (response) => {
        this.addressesList = response.data;
        this.isLoading=true;
      },
      error: (e) => console.error('Error fetching addresses:', e)
    });
  }

  onSubmit() {
    if (this.addressForm.invalid) return;

    const { name, details, phone, city } = this.addressForm.value;

    this._addressesService.addAddress(name!, details!, phone!, city!).subscribe({
      next: () => {
        this.getAdresses();
        this.addressForm.reset();
      },
      error: (e) => console.error('Error adding address:', e)
    });
  }

  removeAdresses(id: string) {
    this._addressesService.removeAddress(id).subscribe({
      next: () => this.getAdresses(),
      error: (e) => console.error('Error removing address:', e)
    });
  }
}