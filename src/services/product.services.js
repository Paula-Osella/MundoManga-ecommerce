import Services from "./service.manager.js";
import { productDao } from "../daos/mongodb/product.dao.js";

class ProductService extends Services {
    constructor(){
        super(productDao);
    }
}

export const prodService = new ProductService();
