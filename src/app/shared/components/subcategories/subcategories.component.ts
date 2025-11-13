import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-subcategories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subcategories.component.html',
  styleUrl: './subcategories.component.scss'
})
export class SubcategoriesComponent implements OnInit {
 private readonly _categoryService = inject(CategoryService);
  subcategories: any[] = [];
  isLoaded = false;

  ngOnInit(): void {
    this.loadSubcategories();
  }

  loadSubcategories(): void {
    this._categoryService.getAllSubcategories().subscribe({
      next: (res) => {
        this.subcategories = res.data || res;
        this.isLoaded = true;
      },
      error: (err) => {
        console.error('Error fetching subcategories:', err);
        this.isLoaded = true;
      }
    });
  }

  loadSubcategoriesByCategory(categoryId: string): void {
    this._categoryService.getSubcategoriesOnCategory(categoryId).subscribe({
      next: (res) => (this.subcategories = res.data || res),
      error: (err) => console.error('Error fetching subcategories for category:', err)
    });
  }

  loadSpecificSubcategory(id: string): void {
    this._categoryService.getSpecificSubcategory(id).subscribe({
      next: (res) => console.log('Specific subcategory:', res),
      error: (err) => console.error('Error fetching subcategory:', err)
    });
  }
}