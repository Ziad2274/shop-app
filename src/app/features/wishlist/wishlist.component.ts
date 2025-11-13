import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { WishlistProduct } from '../../core/interfaces/iproduct';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);

  wishlist: WishlistProduct[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.loading = true;
    this.wishlistService.getUserWishList().subscribe({
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

  removeItem(id: string) {
    this.wishlistService.removeFromWishList(id).subscribe({
      next: () => {
        console.log("Deleted");
        
        this.wishlist = this.wishlist.filter(p => p._id !== id);
      },
      error: (err) => console.error("Errrorrr",err)
    });
  }

  goToProduct(id: string) {
    this.router.navigate(['/product-details', id]);
  }

  
}
