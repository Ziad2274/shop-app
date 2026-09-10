import { CartData, CartProduct, CartProductDetails } from '../../../core/interfaces/iproduct';
import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CartService } from '../../../core/services/cart.service';
import { ICart } from '../../../core/interfaces/iproduct';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatIcon,RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cart:ICart;
  cartItemsDetailsList:CartProductDetails[]=[];
  cartId: string | null = null;
  isLoaded:boolean=false;
  cartItemsList:CartProduct[]=[];
  subTotal:number=0;
  currentCount:number=0;
  private readonly _cartService=inject(CartService);
  private  dialog=inject(MatDialog);


  ngOnInit(): void {
    this.reloadCart();
}
 increase(id:string){
  this._cartService.addProductToCart(id).subscribe(
    {
      next: (responsse) => {
        console.log(responsse);    
            this._cartService.currentCartNumber.next(responsse.numOfCartItems);

       this.reloadCart();
      },
      error: (err) => console.error('Failed to increase quantity', err)
    }
  );
 }
decrease(id: string, currentCount: number): void {
  if (currentCount > 1) {
        // Use the PUT endpoint to update the count to currentCount - 1
        this._cartService.UpdateCartProductQuantity(id, currentCount - 1).subscribe({
            next: (response) => {
              this._cartService.currentCartNumber.next(response.numOfCartItems);
              this.reloadCart()},
            error: (err) => console.error('Failed to decrease quantity', err)
        });
    } else {
        // If count is 1, use the delete endpoint to remove the item completely
        this.removeItem(id); // Call the new removeItem method
    }
  }
 removeItem(id: string): void {
    this._cartService.RemoveCartItem(id).subscribe({
        next: (response) =>{ 
              this._cartService.currentCartNumber.next(response.numOfCartItems);
              this.reloadCart();
        },
        error: (err) => console.error('Failed to remove item', err)
    });
}
 reloadCart(): void {
    this._cartService.GetCartItems().subscribe({
        next: (response) => {
            this.cart = response;
            this.cartItemsDetailsList = response.data.products;
            this.isLoaded=true;
            this.subTotal=response.data.totalCartPrice;
            this._cartService.currentCartNumber.next(response.numOfCartItems);
            this.cartId = response.data._id;
        },
        error: (e) => {
            console.error("Error reloading cart:", e);
        }
    });
}

}
