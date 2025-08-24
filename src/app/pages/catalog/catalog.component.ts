import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Product } from '../../../shared/product.model';
import { finalize, map, Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../shared/services/product.service';
import { CommonModule } from '@angular/common';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-catalog',
  imports: [CommonModule, NgbRatingModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit, OnDestroy {

  products = signal<Product[]>([]);
  detsroy$ = new Subject<void>();
  isLoading = signal(false);
  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.isLoading.set(true);
    this.productService.getProducts(12)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntil(this.detsroy$),
        map(res => res.products)
      )
      .subscribe({
        next: (v) => {
          this.products.set(v);
        },
        error: (e) => {
          console.error(e)
        }
      })
  }


  ngOnDestroy(): void {
    this.detsroy$.next();
    this.detsroy$.complete();
  }

}
