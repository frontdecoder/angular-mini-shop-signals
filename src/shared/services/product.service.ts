import { Injectable } from "@angular/core";
import { enviroment } from "../../env/enviroment";
import { HttpClient } from "@angular/common/http";
import { Root } from "../product.model";


@Injectable({ providedIn: 'root' })

export class ProductService {
    private baseUrl = enviroment.apiBaseUrl;
    constructor(private http: HttpClient) { }

    getProducts(limit: number) {
        return this.http.get<Root>(`${this.baseUrl}/products?limit=${limit}`)
    }
    searchProduct(q: string) {
        return this.http.get<Root>(`${this.baseUrl}/products/search?q=${q}`)
    }
}