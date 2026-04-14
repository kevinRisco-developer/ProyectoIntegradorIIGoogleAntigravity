import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Product, Category } from '../models/product.model';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  productForm: FormGroup;
  
  showForm: boolean = false;
  editingId: number | null = null;
  loading: boolean = false;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      id_categoria: [1, Validators.required],
      imagen_url: ['', Validators.required],
      estado: [1]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.productService.getProducts().subscribe(prods => {
      this.products = prods;
      this.cdr.detectChanges();
    });
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
      this.cdr.detectChanges();
    });
  }

  openCreateForm() {
    this.editingId = null;
    this.productForm.reset({ id_categoria: 1, estado: 1, precio: 0, stock: 0 });
    this.showForm = true;
  }

  openEditForm(product: Product) {
    this.editingId = product.id_producto || null;
    this.productForm.patchValue(product);
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingId = null;
  }

  onSubmit() {
    if (this.productForm.invalid) return;
    this.loading = true;
    const productData = this.productForm.value;

    if (this.editingId) {
      this.productService.updateProduct(this.editingId, productData).subscribe({
        next: () => {
          this.loadData();
          this.closeForm();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.loadData();
          this.closeForm();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteProduct(id: number | undefined) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadData());
    }
  }

  getCategoryName(id: number): string {
    return this.categories.find(c => c.id_categoria === id)?.nombre || 'Unknown';
  }
}
