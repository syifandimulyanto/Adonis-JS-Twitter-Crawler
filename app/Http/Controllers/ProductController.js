'use strict'
const Product = use('App/Models/Product')

class ProductController {
 
  * index (request, response) {
    const products = yield Product.query(request.getQuery()).fetch()
    return response.json(products)
  }
  
}

module.exports = ProductController
