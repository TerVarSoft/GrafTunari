import { Injectable } from '@angular/core';

import { Product } from '../../models/product';

/**
 * Utility class for products endpoint provider. 
 */
@Injectable()
export class ProductsUtil {  

  packageKey: string = "Paquete";  

  processProductObject(productsObject): Product[] {
    return productsObject.items.map(product => {
        
        product.publicPackagePrice = 
          product.publicPrices
            .filter(product => product.type == this.packageKey)[0] || {};
        
        return product;  
      });    
  } 
}