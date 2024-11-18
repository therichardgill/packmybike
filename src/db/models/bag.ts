import { z } from 'zod';
import db from '../schema';

export const bagSchema = z.object({
  id: z.number().optional(),
  brandId: z.number(),
  model: z.string(),
  protectionLevel: z.number().min(1).max(5),
  transportRating: z.number().min(1).max(5),
  wheelSizeMin: z.number(),
  wheelSizeMax: z.number(),
  weightEmpty: z.number(),
  weightMaxLoad: z.number(),
  dimensionLength: z.number(),
  dimensionWidth: z.number(),
  dimensionHeight: z.number(),
  volume: z.number().min(0, 'Volume must be positive'),
  tsaCompliant: z.enum(['Yes', 'No', 'Unknown']),
  manualUrl: z.string().url().optional(),
  packingGuideUrl: z.string().url().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
  compatibility: z.array(z.enum(['mountainBike', 'roadBike', 'hybridBike', 'ebike'])),
  securityFeatures: z.array(z.string()),
});

export type Bag = z.infer<typeof bagSchema>;

export const BagModel = {
  create: db.prepare(`
    INSERT INTO bags (
      brandId, model, protectionLevel, transportRating,
      wheelSizeMin, wheelSizeMax, weightEmpty, weightMaxLoad,
      dimensionLength, dimensionWidth, dimensionHeight,
      volume, tsaCompliant, manualUrl, packingGuideUrl,
      createdAt, updatedAt
    ) VALUES (
      @brandId, @model, @protectionLevel, @transportRating,
      @wheelSizeMin, @wheelSizeMax, @weightEmpty, @weightMaxLoad,
      @dimensionLength, @dimensionWidth, @dimensionHeight,
      @volume, @tsaCompliant, @manualUrl, @packingGuideUrl,
      @createdAt, @updatedAt
    )
  `),

  addCompatibility: db.prepare(`
    INSERT INTO bag_compatibility (bagId, bikeType)
    VALUES (@bagId, @bikeType)
  `),

  addSecurityFeature: db.prepare(`
    INSERT INTO bag_security_features (bagId, feature)
    VALUES (@bagId, @feature)
  `),

  findById: db.prepare(`
    SELECT 
      b.*,
      GROUP_CONCAT(DISTINCT bc.bikeType) as compatibility,
      GROUP_CONCAT(DISTINCT bsf.feature) as securityFeatures
    FROM bags b
    LEFT JOIN bag_compatibility bc ON b.id = bc.bagId
    LEFT JOIN bag_security_features bsf ON b.id = bsf.bagId
    WHERE b.id = ?
    GROUP BY b.id
  `),

  updateById: db.prepare(`
    UPDATE bags SET
      brandId = @brandId,
      model = @model,
      protectionLevel = @protectionLevel,
      transportRating = @transportRating,
      wheelSizeMin = @wheelSizeMin,
      wheelSizeMax = @wheelSizeMax,
      weightEmpty = @weightEmpty,
      weightMaxLoad = @weightMaxLoad,
      dimensionLength = @dimensionLength,
      dimensionWidth = @dimensionWidth,
      dimensionHeight = @dimensionHeight,
      volume = @volume,
      tsaCompliant = @tsaCompliant,
      manualUrl = @manualUrl,
      packingGuideUrl = @packingGuideUrl,
      updatedAt = @updatedAt
    WHERE id = @id
  `),

  deleteById: db.prepare('DELETE FROM bags WHERE id = ?'),

  deleteCompatibility: db.prepare('DELETE FROM bag_compatibility WHERE bagId = ?'),

  deleteSecurityFeatures: db.prepare('DELETE FROM bag_security_features WHERE bagId = ?'),

  listAll: db.prepare(`
    SELECT 
      b.*,
      GROUP_CONCAT(DISTINCT bc.bikeType) as compatibility,
      GROUP_CONCAT(DISTINCT bsf.feature) as securityFeatures
    FROM bags b
    LEFT JOIN bag_compatibility bc ON b.id = bc.bagId
    LEFT JOIN bag_security_features bsf ON b.id = bsf.bagId
    GROUP BY b.id
    ORDER BY b.brandId, b.model ASC
  `),

  listByBrand: db.prepare(`
    SELECT 
      b.*,
      GROUP_CONCAT(DISTINCT bc.bikeType) as compatibility,
      GROUP_CONCAT(DISTINCT bsf.feature) as securityFeatures
    FROM bags b
    LEFT JOIN bag_compatibility bc ON b.id = bc.bagId
    LEFT JOIN bag_security_features bsf ON b.id = bsf.bagId
    WHERE b.brandId = ?
    GROUP BY b.id
    ORDER BY b.model ASC
  `),
};