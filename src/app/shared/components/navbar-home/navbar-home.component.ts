import { OrderService } from '../../../core/services/order.service';
import { SearchPipe } from '../../pipes/search.pipe';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatMenuModule } from '@angular/material/menu'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button';import { FormsModule } from '@angular/forms';
import { SearchService } from '../../../core/services/search.service';
import { CartService } from '../../../core/services/cart.service';
import { error } from 'console';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import {MatTabsModule} from '@angular/material/tabs';


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
  private readonly _orderSrvice=inject(OrderService);

  private _cartSubscription!:Subscription;
  searchedWord:string;
  userId:string;
    userName:string;
  userEmail:string;
  cartItemsCount:number;
onSearchChange(){
  this._searchService.setSearchTerm(this.searchedWord);
}
getCartItemsCount(){


}
ngOnInit(): void {
  //this.fetchInitialCartCount(); // gets initial count
  this._cartService.currentCartNumber.subscribe({
    next:(data)=>{
      this.cartItemsCount=data;
    },
    
  });
  this._cartService.GetCartItems().subscribe({
    next:(response)=>{
      this._cartService.currentCartNumber.next(response.numOfCartItems);
    }
  })
  console.log(this._cartService.currentCartNumber);
  
  // this._cartSubscription = this._cartService.getCartCount().subscribe({
  //   next: (count) => this.cartItemsCount = count
  // });

      this.userId = this._authService.getUserId();

    if (this.userId) {
      this._orderSrvice.getUserOrders(this.userId).subscribe(
        {
          next: (response: any) => { 
            console.log(response);
            console.log(this.userId);
            
                  this.userName=response[0].user.name;
                  this.userEmail=response[0].user.email;
            
         
          },
          error: (error) => {
             console.error("Error fetching user orders:", error);
          },
        }
      );
    } else {
        console.warn("User ID not found. Cannot fetch orders.");
    }
  }

// fetchInitialCartCount() {
//   this._cartService.GetCartItems().subscribe({
//     next: () => {
//       this.cartItemsCount = this._cartService.getCurrentCartCount(); 
//     },
//     error: (e) => {
//       console.error('Error fetching cart count:', e);
//       this.cartItemsCount = 0;
//     }
//   });
// }
signOut():void{
this._authService.Logout();
}

}
