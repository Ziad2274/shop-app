import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { IOrderDetail } from '../../../core/interfaces/iproduct';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit {
  private readonly _orderService = inject(OrderService);
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);

  order: IOrderDetail | null = null;
  loading = true;
  error: string | null = null;
  cancelling = false;

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (!id) return;
    this._orderService.getOrderDetail(id).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Order not found.';
        this.loading = false;
      }
    });
  }

  cancelOrder() {
    if (!this.order) return;
    this.cancelling = true;
    this._orderService.cancelOrder(this.order._id).subscribe({
      next: () => {
        this.cancelling = false;
        this.order!.status = 'Cancelled';
      },
      error: (err) => {
        this.cancelling = false;
        console.error(err);
      }
    });
  }
}
