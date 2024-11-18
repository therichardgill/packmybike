import { z } from 'zod';
import db from '../schema';

export const brandSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  website: z.string().url().optional(),
  description: z.string(),
  logo: z.string().optional(),
  headquarters: z.string(),
  foundedYear: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
  specialties: z.array(z.string()),
});

export type Brand = z.infer<typeof brandSchema>;

export const BrandModel = {
  create: db.prepare(`
    INSERT INTO brands (
      name, website, description, logo, headquarters,
      foundedYear, createdAt, updatedAt
    ) VALUES (
      @name, @website, @description, @logo, @headquarters,
      @foundedYear, @createdAt, @updatedAt
    )
  `),

  addSpecialty: db.prepare(`
    INSERT INTO brand_specialties (brandId, specialty)
    VALUES (@brandId, @specialty)
  `),

  findById: db.prepare(`
    SELECT 
      b.*,
      GROUP_CONCAT(bs.specialty) as specialties
    FROM brands b
    LEFT JOIN brand_specialties bs ON b.id = bs.brandId
    WHERE b.id = ?
    GROUP BY b.id
  `),

  findByName: db.prepare('SELECT * FROM brands WHERE name = ?'),

  updateById: db.prepare(`
    UPDATE brands SET
      name = @name,
      website = @website,
      description = @description,
      logo = @logo,
      headquarters = @headquarters,
      foundedYear = @foundedYear,
      updatedAt = @updatedAt
    WHERE id = @id
  `),

  deleteById: db.prepare('DELETE FROM brands WHERE id = ?'),

  deleteSpecialties: db.prepare('DELETE FROM brand_specialties WHERE brandId = ?'),

  listAll: db.prepare(`
    SELECT 
      b.*,
      GROUP_CONCAT(bs.specialty) as specialties
    FROM brands b
    LEFT JOIN brand_specialties bs ON b.id = bs.brandId
    GROUP BY b.id
    ORDER BY b.name ASC
  `),
};