import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AddressService } from '../../../core/services/address.service';
import { CouponService } from '../../../core/services/coupon.service';
import { CheckoutService } from '../../../core/services/checkout.service';
import { CartService } from '../../../core/services/cart.service';
import { IAddress, IApplyCouponResult } from '../../../core/interfaces/iproduct';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  private readonly _addressService = inject(AddressService);
  private readonly _couponService = inject(CouponService);
  private readonly _checkoutService = inject(CheckoutService);
  private readonly _cartService = inject(CartService);
  private readonly _router = inject(Router);

  addresses: IAddress[] = [];
  loadingAddresses = true;
  selectedAddressId: string | null = null;

  couponForm = new FormGroup({
    code: new FormControl(''),
  });
  couponResult: IApplyCouponResult | null = null;
  couponError = '';
  applyingCoupon = false;

  subTotal = 0;
  placingOrder = false;
  placeOrderError = '';
  placedOrderId: string | null = null;

  ngOnInit(): void {
    this.loadAddresses();

    this._cartService.GetCartItems().subscribe({
      next: (cart) => {
        this.subTotal = cart.data.totalCartPrice;
        if (cart.data.products.length === 0 && !this.placedOrderId) {
          // nothing to check out
        }
      }
    });
  }

  loadAddresses() {
    this.loadingAddresses = true;
    this._addressService.getMyAddresses().subscribe({
      next: (res) => {
        this.addresses = res.data;
        this.selectedAddressId = res.data[0]?._id ?? null;
        this.loadingAddresses = false;
      },
      error: () => {
        this.loadingAddresses = false;
      }
    });
  }

  applyCoupon() {
    const code = this.couponForm.value.code?.trim();
    if (!code) return;

    this.applyingCoupon = true;
    this.couponError = '';
    this._couponService.applyCoupon(code).subscribe({
      next: (res) => {
        this.couponResult = res;
        this.applyingCoupon = false;
      },
      error: (err) => {
        this.couponError = err.error?.message || 'Invalid or expired coupon.';
        this.couponResult = null;
        this.applyingCoupon = false;
      }
    });
  }

  placeOrder() {
    if (!this.selectedAddressId) {
      this.placeOrderError = 'Please select or add an address first.';
      return;
    }

    this.placingOrder = true;
    this.placeOrderError = '';
    const couponCode = this.couponResult?.code;

    this._checkoutService.checkout(this.selectedAddressId, couponCode).subscribe({
      next: (res) => {
        this.placingOrder = false;
        this.placedOrderId = res.orderId;
        this._cartService.currentCartNumber.next(0);
        setTimeout(() => this._router.navigate(['/allorders']), 2500);
      },
      error: (err) => {
        this.placingOrder = false;
        this.placeOrderError = err.error?.message || 'Failed to place order.';
      }
    });
  }
}
