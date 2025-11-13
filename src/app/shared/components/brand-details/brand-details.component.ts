import { BrandService } from './../../../core/services/brand.service';
import { IBrand } from './../../../core/interfaces/iproduct';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; 

@Component({
  selector: 'app-brand-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brand-details.component.html',
  styleUrls: ['./brand-details.component.scss']
})
export class BrandDetailsComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _brandService = inject(BrandService);

  brandData: IBrand | null = null;
  isLoading: boolean = true;
  brandId: string|null ;

ngOnInit(): void {
  this._route.paramMap.subscribe({
    next: (params) => {
      this.brandId = params.get("id");
      if (this.brandId) {
        this.loadBrandData(this.brandId);
      }
    },
    error: (error) => console.error("Route param error", error)
  });
}

loadBrandData(id: string): void {
  this.isLoading = true;
  this._brandService.getSpecificBrand(id).subscribe({
    next: (res) => {
      this.brandData = res.data;
      this.isLoading = false;
    },
    error: (err) => {
      console.error("Error fetching brand:", err);
      this.isLoading = false;
    }
  });
}
}
