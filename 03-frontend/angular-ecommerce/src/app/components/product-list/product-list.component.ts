import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Product} from 'src/app/common/product';
import {ProductService} from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId = 1;
  previousCategoryId = 1;
  currentCategoryName: string;
  searchMode = false;
  thePageNumber = 1;
  thePageSize = 5;
  theTotalElements = 0;
  previousKeyWord: string = null;

  constructor(private productService: ProductService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(): void {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts(): void {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    if (this.previousKeyWord !== theKeyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyWord = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    this.productService.searchProductPaginate(this.thePageNumber - 1,
      this.thePageSize,
      theKeyword).subscribe(this.processResult());
  }

  handleListProducts(): void {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    } else {
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    if (this.previousCategoryId !== this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize, this.currentCategoryId).subscribe(this.processResult());
  }

  private processResult(): any {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: number): void {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }
}
