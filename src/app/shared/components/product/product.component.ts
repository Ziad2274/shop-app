import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../../core/services/products.service';
import { CategoryService } from '../../../core/services/category.service';
import { SearchService } from '../../../core/services/search.service';
import { ICategory, IProduct, WishlistProduct } from '../../../core/interfaces/iproduct';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TrimPipe } from '../../pipes/trim.pipe';
import { SearchPipe } from '../../pipes/search.pipe';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink,TrimPipe,SearchPipe,], 
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {

 allProductsSubscriber: Subscription;
 categororiesSubscriber: Subscription;
 productSubscriber: Subscription;
 searchSubscriber:Subscription;
  private readonly _productService = inject(ProductsService);
  private readonly _categoriesService = inject(CategoryService);
  private readonly _searchService = inject(SearchService);
  private readonly _wishlistService = inject(WishlistService);
  

  productsList: IProduct[] = [];
  categoriesList :ICategory[] = [];
  searchedWord:string='';
  wishlistAdded:boolean=false;
      wishlist: WishlistProduct[] = [];
      loading = true;
      error: string | null = null;
  ngOnInit(): void {
    this.searchSubscriber=this._searchService.getSearchTerm().subscribe(
      term=>{this.searchedWord=term}
    )

     this.allProductsSubscriber =this._productService.getAllProducts().subscribe({
      next: (response) => {
        console.log(response);
        this.productsList = response.data;
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
    this.allProductsSubscriber?.unsubscribe();
    this.categororiesSubscriber?.unsubscribe();
    this.productSubscriber?.unsubscribe();
    this.searchSubscriber?.unsubscribe();
  }
}
