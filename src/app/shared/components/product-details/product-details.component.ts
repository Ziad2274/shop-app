import { IBrand, WishlistProduct } from '../../../core/interfaces/iproduct';
import { Component, inject, NgModule, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../core/services/products.service';
import { IProduct } from '../../../core/interfaces/iproduct';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { error } from 'console';
import { WishlistService } from '../../../core/services/wishlist.service';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [MatIconModule,FormsModule,NgClass], // Add necessary Angular Material modules here
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit,OnDestroy {
 
   private readonly _activatedRoute = inject(ActivatedRoute);
   private readonly _productService = inject(ProductsService);
     private readonly _cartService=inject(CartService);
     private readonly _wishlistService=inject(WishlistService);

   productDetails:IProduct|null=null;
   brand:IBrand={}as IBrand;
    productSubscriber:Subscription;
 successTimeout:any;
 showSuccessMessage: boolean = false;
 isLoaded: boolean = false;
 loading: boolean = false;
      wishlist: WishlistProduct[] = [];
      error: string | null = null;

  ngOnInit(): void {
    this.productSubscriber = this._activatedRoute.paramMap.subscribe(
      {next: (params) => {
       let productId=  params.get('id');
        console.log('Product ID:', productId);
        this._productService.getSpecificProduct(productId!).subscribe({
          next: (response) => {
            console.log('Product Details:', response);
            this.productDetails = response.data;
            this.brand=this.productDetails.brand;  
                      this.isLoaded=true;

          },
          error: (e) => {
            console.log(e);
          }
        });
      }}
      
    );
    this.loadWishlist();
  }
    discountPercentage():number{
    let discount = ((this.productDetails.price - this.productDetails.priceAfterDiscount) / this.productDetails.price) * 100;
    return Math.round(discount);
  }
    

selectedQuantity:number = 1;


increaseQuantity() {
  this.selectedQuantity++;
}

decreaseQuantity() {
  if (this.selectedQuantity > 1) this.selectedQuantity--;
}
changeCoverImage(selectedImage:string){
  this.productDetails.imageCover=selectedImage;
}

addToCart(id: string) {
    
    this._cartService.addProductToCart(id).subscribe({
        next: (res) => {
            if (this.selectedQuantity > 1) {
                this.updateCartItemQuantity(id, this.selectedQuantity);
            } else {
                this._cartService.currentCartNumber.next(res.numOfCartItems); 
                this.handleSuccess();
            }
        },
        error: (err) => {
            console.error('Add to cart failed:', err);
        }
    });
}

updateCartItemQuantity(id: string, count: number): void {
    
    this._cartService.UpdateCartProductQuantity(id, count).subscribe({
        next: (response) => { 
            this._cartService.currentCartNumber.next(response.numOfCartItems);
            
            this.handleSuccess();
        },
        error: (err) => {
            console.error('Update quantity failed:', err);
        }
    });
}
handleSuccess(): void {
    this.showSuccessMessage = true;

    this.selectedQuantity = 1;

    this.successTimeout = setTimeout(() => {
        this.showSuccessMessage = false;
    }, 5000);
}
    loadWishlist() {
    this.loading = true;
    this._wishlistService.getUserWishList().subscribe({
      next: (res) => {
        console.log(res);
        
        this.wishlist = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load wishlist';
        this.loading = false;
      }
    });
  }
  isProductInWishlist(productId: string): boolean {
     return this.wishlist.some(item => item.id === productId); 
}

  ///////////////////////////////////////////////
toggleWishlist(product: { id: string }, event: MouseEvent): void {
    event.stopPropagation(); // Prevent navigation on click

    const productId = product.id;
    const isAdded = this.isProductInWishlist(productId);

    if (isAdded) {
        this._wishlistService.removeFromWishList(productId).subscribe({
            next: () => {
                this.wishlist = this.wishlist.filter(item => item.id !== productId);
                console.log(`Removed product ${productId} from wishlist.`);
            },
            error: (err) => console.error('Failed to remove from wishlist:', err)
        });
    } else {
        this._wishlistService.addToWishList(productId).subscribe({
            next: () => {
                this.loadWishlist(); 
                console.log(`Added product ${productId} to wishlist.`);
            },
            error: (err) => console.error('Failed to add to wishlist:', err)
        });
    }
        this.loadWishlist();

}
  ngOnDestroy(): void {
    this.productSubscriber?.unsubscribe();
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
    }
  }
}
