import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup ,ReactiveFormsModule, Validators} from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-shipping-details',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './shipping-details.component.html',
  styleUrl: './shipping-details.component.scss'
})
export class ShippingDetailsComponent implements OnInit{
 
  private readonly _activatedRpute =inject(ActivatedRoute);
  private readonly _orderService=inject(OrderService);
  isSumbited:boolean=false;

  private cartId:string|null;
  private selectedMethod:string|null;
orders:FormGroup=new FormGroup({
details: new FormControl(null, [Validators.required]), 
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    city: new FormControl(null, [Validators.required]),
});
 ngOnInit(): void {
  this._activatedRpute.paramMap.subscribe(
    {
      next:(params)=>{
        this.cartId =params.get("id");

        console.log('Cart ID:',this.cartId);
      },
      error:(error)=>{
        console.log("error",error);
        
      }
        
    }
  );
}


payCash(){
  if (this.orders.valid && this.cartId) {

this._orderService.createCashOrder(this.cartId,this.orders.value).subscribe({
  next:(response)=>{
    console.log("Checkout Response : ",response);
    if (response.status==='success') {
      this.isSumbited=true;
    }
    
  },
  error: (err) => {
            console.error('Checkout failed:', err);
          }

});
}
}
payOnline(){
if (this.orders.valid && this.cartId) {

this._orderService.createCheckoutSession(this.cartId,this.orders.value).subscribe({
  next:(response)=>{
    console.log("Checkout Response : ",response);
    if (response.status==='success') {
      this.isSumbited=true;
      window.open(response.session.url,'_self');
    }
    
  },
  error: (err) => {
            console.error('Checkout failed:', err);
          }

});
}
else{
  this.orders.markAllAsTouched(); 
      console.warn('Form is invalid or Cart ID is missing. Cannot submit.');
}
}
}
