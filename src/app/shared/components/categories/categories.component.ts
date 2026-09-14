import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ICategory } from '../../../core/interfaces/iproduct';
import {MatGridListModule} from '@angular/material/grid-list';
import { CategoryService } from '../../../core/services/category.service';

const CATEGORY_IMG_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23e9ecef'/%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='%236c757d' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";


@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule,MatGridListModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  
  private readonly _categoryService = inject(CategoryService);

  categories: ICategory[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.isLoading = true;
    this._categoryService.getAllCategories().subscribe({ 
      next: (response: any) => {
        this.categories = response.data || response; 
        this.isLoading = false;
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.errorMessage = 'Failed to load categories. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = CATEGORY_IMG_PLACEHOLDER;
  }
}