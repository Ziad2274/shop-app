import { SearchPipe } from '../../pipes/search.pipe';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../../core/services/search.service';
import { CartService } from '../../../core/services/cart.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { MatTabsModule } from '@angular/material/tabs';


@Component({
  selector: 'app-navbar-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,MatIconModule,FormsModule,MatMenuModule,MatButtonModule,MatTabsModule],
  templateUrl: './navbar-home.component.html',
  styleUrl: './navbar-home.component.scss'
})
export class NavbarHomeComponent implements OnInit {

  private readonly _searchService=inject(SearchService);
  private readonly _cartService=inject(CartService);
  private readonly _authService=inject(AuthService);

  private _cartSubscription!:Subscription;
  searchedWord:string;
  userName:string;
  userEmail:string;
  cartItemsCount:number;

  onSearchChange(){
    this._searchService.setSearchTerm(this.searchedWord);
  }

  ngOnInit(): void {
    this._cartService.currentCartNumber.subscribe({
      next:(data)=>{
        this.cartItemsCount=data;
      },
    });
    this._cartService.GetCartItems().subscribe({
      next:(response)=>{
        this._cartService.currentCartNumber.next(response.numOfCartItems);
      }
    });

    // zizo-shop's orders endpoint doesn't return the user's name/email
    // (it's just a flat list of order totals), so we pull that from the
    // profile endpoint instead.
    this._authService.getProfile().subscribe({
      next: (profile) => {
        this.userName = `${profile.firstName} ${profile.lastName}`.trim();
        this.userEmail = profile.email;
      },
      error: (error) => {
        console.error("Error fetching profile:", error);
      },
    });
  }

  signOut():void{
    this._authService.Logout();
  }

}
