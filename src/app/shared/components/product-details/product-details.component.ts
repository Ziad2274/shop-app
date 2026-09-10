import { WishlistProduct, IReview } from '../../../core/interfaces/iproduct';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../core/services/products.service';
import { IProduct } from '../../../core/interfaces/iproduct';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [MatIconModule,FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit,OnDestroy {

   private readonly _activatedRoute = inject(ActivatedRoute);
   private readonly _productService = inject(ProductsService);
   private readonly _cartService=inject(CartService);
   private readonly _wishlistService=inject(WishlistService);
   private readonly _reviewService=inject(ReviewService);
   private readonly _authService=inject(AuthService);

   productDetails:IProduct|null=null;
   productSubscriber:Subscription;
   successTimeout:any;
   showSuccessMessage: boolean = false;
   isLoaded: boolean = false;
   loading: boolean = false;
   wishlist: WishlistProduct[] = [];
   error: string | null = null;

   reviews: IReview[] = [];
   reviewsLoaded = false;
   myUserId: string | null = null;
   reviewForm = new FormGroup({
     rating: new FormControl(5, [Validators.required, Validators.min(1), Validators.max(5)]),
     comment: new FormControl('', [Validators.required]),
   });
   submittingReview = false;
   reviewError = '';

  ngOnInit(): void {
    this.myUserId = this._authService.getUserId();
    this.productSubscriber = this._activatedRoute.paramMap.subscribe(
      {next: (params) => {
       let productId=  params.get('id');
        this._productService.getSpecificProduct(productId!).subscribe({
          next: (response) => {
            this.productDetails = response.data ?? null;
            this.isLoaded=true;
            if (this.productDetails) {
              this.loadReviews(this.productDetails.id);
            }
          },
          error: (e) => {
            console.log(e);
            this.isLoaded=true;
          }
        });
      }}
    );
    this.loadWishlist();
  }

  loadReviews(productId: string) {
    this._reviewService.getProductReviews(productId).subscribe({
      next: (res) => {
        this.reviews = res.data;
        this.reviewsLoaded = true;
      },
      error: (err) => console.error(err)
    });
  }

  submitReview() {
    if (this.reviewForm.invalid || !this.productDetails) {
      this.reviewForm.markAllAsTouched();
      return;
    }
    this.submittingReview = true;
    this.reviewError = '';
    const { rating, comment } = this.reviewForm.value;
    this._reviewService.addReview(this.productDetails.id, rating!, comment!).subscribe({
      next: () => {
        this.submittingReview = false;
        this.reviewForm.reset({ rating: 5, comment: '' });
        this.loadReviews(this.productDetails!.id);
      },
      error: (err) => {
        this.submittingReview = false;
        this.reviewError = err.error?.message || 'Failed to submit review.';
      }
    });
  }

  deleteReview(reviewId: string) {
    if (!this.productDetails) return;
    this._reviewService.deleteReview(this.productDetails.id, reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r._id !== reviewId);
      },
      error: (err) => console.error(err)
    });
  }

  discountPercentage():number{
    if (!this.productDetails?.priceAfterDiscount) return 0;
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
    this.productDetails!.imageCover=selectedImage;
  }

  addToCart(id: string) {
    this._cartService.addProductToCart(id, this.selectedQuantity).subscribe({
      next: (cart) => {
        this._cartService.currentCartNumber.next(cart.numOfCartItems);
        this.handleSuccess();
      },
      error: (err) => {
        console.error('Add to cart failed:', err);
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

  toggleWishlist(product: { id: string }, event: MouseEvent): void {
    event.stopPropagation();

    const productId = product.id;
    const isAdded = this.isProductInWishlist(productId);

    if (isAdded) {
      this._wishlistService.removeFromWishList(productId).subscribe({
        next: () => {
          this.wishlist = this.wishlist.filter(item => item.id !== productId);
        },
        error: (err) => console.error('Failed to remove from wishlist:', err)
      });
    } else {
      this._wishlistService.addToWishList(productId).subscribe({
        next: () => {
          this.loadWishlist();
        },
        error: (err) => console.error('Failed to add to wishlist:', err)
      });
    }
  }

  ngOnDestroy(): void {
    this.productSubscriber?.unsubscribe();
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
    }
  }
}
