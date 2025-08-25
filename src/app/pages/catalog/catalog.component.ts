import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Product } from '../../../shared/product.model';
import { debounceTime, distinctUntilChanged, filter, finalize, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ProductService } from '../../../shared/services/product.service';
import { CommonModule } from '@angular/common';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalog',
  imports: [CommonModule, NgbRatingModule, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit, OnDestroy {

  products = signal<Product[]>([]);
  destroy$ = new Subject<void>();
  isLoading = signal(false);
  searchTerm = signal('');
  search$ = new Subject<string>()
  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.getProducts();

    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(term => {
        this.isLoading.set(true);
        if (term.length < 3) {
          this.getProducts();
          this.isLoading.set(false)
        }
      }),
      filter(term => term.length >= 3),
      switchMap(term =>
        this.productService.searchProduct(term).pipe(
          finalize(() => this.isLoading.set(false)))),
      map(res => res.products),
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (v) => {
          this.products.set(v);
        }
      })

  }

  getProducts() {
    this.isLoading.set(true);
    this.productService.getProducts(12)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntil(this.destroy$),
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


  onSearch(value: string) {
    this.search$.next(value);
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
