import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Product, Category } from '../models/product.model';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalog.component.html'
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  
  searchTerm: string = '';
  selectedCategoryId: number = 0;
  loading: boolean = true;

  constructor(
    private productService: ProductService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
    });

    this.productService.getProducts().subscribe(prods => {
      this.products = prods;
      this.filteredProducts = prods;
      this.loading = false;
    });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      const matchesSearch = p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                            p.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategoryId === 0 || p.id_categoria === Number(this.selectedCategoryId);
      return matchesSearch && matchesCategory;
    });
  }

  selectCategory(id: number) {
    this.selectedCategoryId = id;
    this.applyFilters();
  }
}
