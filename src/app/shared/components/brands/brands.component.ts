import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrandService } from '../../../core/services/brand.service';
import { IBrand } from '../../../core/interfaces/iproduct';


@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit {
  
  private readonly _brandService = inject(BrandService);

  brands: IBrand[] = [];
  brandId: string;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.getAllBrands();
  }

  getAllBrands(): void {
    this._brandService.getAllBrands().subscribe({ 
      next: (response: any) => {
        console.log(response);
        
        this.brands = response.data || response;
      },
      error: (error) => {
        console.error('Error fetching brands:', error);
          console.log(error);
          
      }
    });
  }
}