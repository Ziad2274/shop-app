import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';
import { IOrderProduct } from '../../../core/interfaces/iproduct';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss'
})
export class AllordersComponent implements OnInit {

  private readonly _authService = inject(AuthService)
  private readonly _orderSrvice = inject(OrderService)

  userId: string | null = null;
  isLoaded:boolean=false;
   ordersList: IOrderProduct[] = [];

  ngOnInit(): void {
    this.userId = this._authService.getUserId();

    if (this.userId) {
      this._orderSrvice.getUserOrders(this.userId).subscribe(
        {
          next: (response: any) => { 
             this.isLoaded=true;                     
            console.log(response);

                  this.ordersList = response; 
            
         
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

}