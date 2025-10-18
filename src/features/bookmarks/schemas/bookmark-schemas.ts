import { z } from 'zod'

// Base link schema
export const LinkSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  url: z.string().url('Must be a valid URL'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  isFavorite: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Create link schema (without id, timestamps)
export const CreateLinkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  url: z.string().url('Must be a valid URL'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  isFavorite: z.boolean().default(false),
})

// Update link schema (all fields optional except id)
export const UpdateLinkSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters').optional(),
  url: z.string().url('Must be a valid URL').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  isFavorite: z.boolean().optional(),
})

// Query parameters schema
export const LinkQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'title', 'favorites']).default('newest'),
})

// Response schemas
export const LinkResponseSchema = LinkSchema.omit({
  createdAt: true,
  updatedAt: true,
}).extend({
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const PaginatedLinksResponseSchema = z.object({
  data: z.array(LinkResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
})

// Type exports
export type Link = z.infer<typeof LinkSchema>
export type CreateLink = z.infer<typeof CreateLinkSchema>
export type UpdateLink = z.infer<typeof UpdateLinkSchema>
export type LinkQuery = z.infer<typeof LinkQuerySchema>
export type LinkResponse = z.infer<typeof LinkResponseSchema>
export type PaginatedLinksResponse = z.infer<typeof PaginatedLinksResponseSchema>
