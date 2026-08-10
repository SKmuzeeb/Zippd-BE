import * as productsService from '../services/products.service.js';

export async function listProducts(req, res) {
  const { kirana_id } = req.query;
  const products = await productsService.listProducts({ kiranaId: kirana_id });
  res.json({ data: products });
}

export async function getProduct(req, res) {
  const product = await productsService.getProductById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
}
