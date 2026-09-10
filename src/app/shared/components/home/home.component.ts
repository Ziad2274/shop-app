import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { ProductsService } from '../../../core/services/products.service';
import { IProduct, WishlistProduct } from '../../../core/interfaces/iproduct';
import { Subscription } from 'rxjs';
import { RouterLink } from "@angular/router";
import { TrimPipe } from '../../pipes/trim.pipe';
import { SearchPipe } from '../../pipes/search.pipe';
import { SearchService } from '../../../core/services/search.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink,TrimPipe,SearchPipe,NgClass],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,OnDestroy {

  allProductsSubscriber: Subscription;
  searchSubscriber:Subscription;
  private readonly _productService = inject(ProductsService);
  private readonly _searchService = inject(SearchService);
  private readonly _wishlistService = inject(WishlistService);
  private readonly _ngxSpinnerService = inject(NgxSpinnerService);

  productsList: IProduct[] = [];
  // "Best Deals" is the one ranking zizo-shop's data can actually support,
  // since it has a real DiscountPrice per product. There's no "sold" count
  // or product creation date exposed by the API, so Best Sellers / New
  // Arrivals sections were removed rather than faked.
  bestDealsList: IProduct[] = [];
  searchedWord:string='';
  wishlist: WishlistProduct[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this._ngxSpinnerService.show("climbing");
    this.searchSubscriber=this._searchService.getSearchTerm().subscribe(
      term=>{this.searchedWord=term}
    );

    this.allProductsSubscriber = this._productService.getAllProducts({ pageSize: 40 }).subscribe({
      next: (response) => {
        this._ngxSpinnerService.hide("climbing");
        this.productsList = response.data;
        this.bestDealsList = [...this.productsList]
          .filter(p => p.priceAfterDiscount !== null && p.priceAfterDiscount < p.price)
          .sort((a, b) => (b.price - b.priceAfterDiscount!) - (a.price - a.priceAfterDiscount!));
      },
      error: (e) => {
        this._ngxSpinnerService.hide("climbing");
        console.log(e);
      }
    });

    this.loadWishlist();
  }

  isProductInWishlist(productId: string): boolean {
    return this.wishlist.some(item => item.id === productId);
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

  onSearchChange(){
    this._searchService.setSearchTerm(this.searchedWord);
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
    this.allProductsSubscriber?.unsubscribe();
    this.searchSubscriber?.unsubscribe();
  }
}
