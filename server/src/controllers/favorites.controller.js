import * as favoritesService from '../services/favorites.service.js';

export async function listFavorites(req, res) {
  const productIds = await favoritesService.listFavoriteProductIds(req.user.id);
  res.json({ data: productIds });
}

export async function addFavorite(req, res) {
  await favoritesService.addFavorite(req.user.id, req.body.product_id);
  res.status(201).json({ product_id: req.body.product_id });
}

export async function removeFavorite(req, res) {
  await favoritesService.removeFavorite(req.user.id, req.params.productId);
  res.status(204).send();
}
