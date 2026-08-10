import * as kiranasService from '../services/kiranas.service.js';

export async function listKiranas(req, res) {
  const { city } = req.query;
  const kiranas = await kiranasService.listKiranas({ city });
  res.json({ data: kiranas });
}

export async function getKirana(req, res) {
  const kirana = await kiranasService.getKiranaById(req.params.id);

  if (!kirana) {
    return res.status(404).json({ error: 'Kirana not found' });
  }

  res.json(kirana);
}
