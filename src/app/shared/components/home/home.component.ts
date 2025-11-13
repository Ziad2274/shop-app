import { CategoriesComponent } from '../categories/categories.component';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common'; // ✅ add this
import { ProductsService } from '../../../core/services/products.service';
import { ICategory, IProduct, WishlistProduct } from '../../../core/interfaces/iproduct';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../../core/services/category.service';
import {  RouterLink } from "@angular/router";
import { TrimPipe } from '../../pipes/trim.pipe';
import { SearchPipe } from '../../pipes/search.pipe';
import { SearchService } from '../../../core/services/search.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {MatGridListModule} from '@angular/material/grid-list';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink,TrimPipe,SearchPipe,MatGridListModule,NgClass], 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'] 
})
export class HomeComponent implements OnInit,OnDestroy {

 allProductsSubscriber: Subscription;
 categororiesSubscriber: Subscription;
 productSubscriber: Subscription;
 searchSubscriber:Subscription;
  private readonly _productService = inject(ProductsService);
  private readonly _categoriesService = inject(CategoryService);
  private readonly _searchService = inject(SearchService);
  private readonly _wishlistService = inject(WishlistService);
  private readonly _ngxSpinnerService = inject(NgxSpinnerService);


  productsList: IProduct[] = [];
  bestSellersList: IProduct[] = [];
  bestDealsList: IProduct[] = [];
  latestProductsList: IProduct[] = [];
  categoriesList :ICategory[] = [];
  searchedWord:string='';
  wishlistAdded:boolean=false;
    wishlist: WishlistProduct[] = [];
    loading = true;
    error: string | null = null;
      dressStyles = [
    { name: 'Casual', image: 'assets/images/styles/casual.jpg' },
    { name: 'Formal', image: 'assets/images/styles/formal.jpg' },
    { name: 'Party', image: 'assets/images/styles/party.jpg' },
    { name: 'Gym', image: 'assets/images/styles/gym.jpg' }
  ];
  ngOnInit(): void {
   this.searchSubscriber=this._searchService.getSearchTerm().subscribe(
      term=>{this.searchedWord=term}
    );    
    this._ngxSpinnerService.show("climbing");
    this.searchSubscriber=this._searchService.getSearchTerm().subscribe(
      term=>{this.searchedWord=term}
    );

     this.allProductsSubscriber =this._productService.getAllProducts().subscribe({
      next: (response) => {
        console.log(response);
    this._ngxSpinnerService.hide("climbing");

        this.productsList = response.data;
        this.bestSellersList=[...this.productsList].sort((a,b)=>b.sold-a.sold);
        this.bestDealsList=[...this.productsList].sort((a,b)=>{
          const aOriginalPrice=a.price;
          const bOriginalPrice=b.price;
            const x=a.priceAfterDiscount??aOriginalPrice;
            const y=b.priceAfterDiscount??bOriginalPrice;
            const aRate=(x-aOriginalPrice)/aOriginalPrice
            const bRate=(y-bOriginalPrice)/bOriginalPrice
          
          return aRate-bRate;
          
        });
        this.latestProductsList=[...this.productsList].sort((x,y)=>{
          const a=new Date(x?.createdAt).getTime() ;
          const b=new Date(y?.createdAt).getTime();
          return b-a;
        })
      },
      error: (e) => {
        console.log(e);
      }
    });
   this.categororiesSubscriber=this._categoriesService.getAllCategories().subscribe({
      next: (response) => {
        console.log('Categories:', response);
        this.categoriesList = response.data;
        
      },
      error: (e) => {
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

onSearchChange(){
  this._searchService.setSearchTerm(this.searchedWord);
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
}
  ngOnDestroy(): void {
    this.allProductsSubscriber?.unsubscribe();
    this.categororiesSubscriber?.unsubscribe();
    this.productSubscriber?.unsubscribe();
    this.searchSubscriber?.unsubscribe();
  }
}
