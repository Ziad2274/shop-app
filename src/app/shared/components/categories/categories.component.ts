import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ICategory } from '../../../core/interfaces/iproduct';
import {MatGridListModule} from '@angular/material/grid-list';
import { CategoryService } from '../../../core/services/category.service';


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
}