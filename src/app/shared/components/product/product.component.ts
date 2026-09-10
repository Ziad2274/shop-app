import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription, debounceTime } from 'rxjs';
import { ProductsService } from '../../../core/services/products.service';
import { SearchService } from '../../../core/services/search.service';
import { CategoriesService } from '../../../core/services/categories.service';
import { BrandsService } from '../../../core/services/brands.service';
import { IProduct, WishlistProduct, ICategory, IBrand } from '../../../core/interfaces/iproduct';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TrimPipe } from '../../pipes/trim.pipe';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink,TrimPipe,FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit, OnDestroy {

  searchSubscriber:Subscription;
  private readonly _productService = inject(ProductsService);
  private readonly _searchService = inject(SearchService);
  private readonly _wishlistService = inject(WishlistService);
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _brandsService = inject(BrandsService);

  productsList: IProduct[] = [];
  categories: ICategory[] = [];
  brands: IBrand[] = [];
  wishlist: WishlistProduct[] = [];
  loading = true;
  error: string | null = null;

  searchedWord:string='';
  selectedCategoryId: string = '';
  selectedBrandId: string = '';
  sortBy: string = '';

  pageNumber = 1;
  pageSize = 12;
  totalPages = 1;

  ngOnInit(): void {
    this.searchSubscriber = this._searchService.getSearchTerm().pipe(debounceTime(300)).subscribe(
      term => {
        this.searchedWord = term;
        this.pageNumber = 1;
        this.fetchProducts();
      }
    );

    this._categoriesService.getAllCategories().subscribe({
      next: (res) => this.categories = res.data,
      error: (e) => console.error(e)
    });
    this._brandsService.getAllBrands().subscribe({
      next: (res) => this.brands = res.data,
      error: (e) => console.error(e)
    });

    this.fetchProducts();
    this.loadWishlist();
  }

  fetchProducts() {
    this.loading = true;
    this._productService.getAllProducts({
      search: this.searchedWord || undefined,
      categoryId: this.selectedCategoryId || undefined,
      brandId: this.selectedBrandId || undefined,
      sortBy: (this.sortBy as any) || undefined,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    }).subscribe({
      next: (page) => {
        this.productsList = page.data;
        this.totalPages = page.totalPages;
        this.loading = false;
      },
      error: (e) => {
        console.log(e);
        this.loading = false;
      }
    });
  }

  onFilterChange() {
    this.pageNumber = 1;
    this.fetchProducts();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.pageNumber = page;
    this.fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadWishlist() {
    this._wishlistService.getUserWishList().subscribe({
      next: (res) => {
        this.wishlist = res.data || [];
      },
      error: (err) => console.error(err)
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
    this.searchSubscriber?.unsubscribe();
  }
}
