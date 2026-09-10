import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { IOrder } from '../../../core/interfaces/iproduct';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss'
})
export class AllordersComponent implements OnInit {

  private readonly _orderService = inject(OrderService);

  isLoaded:boolean=false;
  ordersList: IOrder[] = [];

  ngOnInit(): void {
    this._orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.isLoaded = true;
        this.ordersList = orders;
      },
      error: (error) => {
        this.isLoaded = true;
        console.error("Error fetching orders:", error);
      },
    });
  }

}
