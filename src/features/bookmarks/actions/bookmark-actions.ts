'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { BookmarkRepository } from '@/lib/repositories/bookmark-repository'
import { BookmarkService } from '@/lib/services/bookmark-service'
import { CreateLinkSchema, UpdateLinkSchema } from '@/features/bookmarks/schemas/bookmark-schemas'

const repository = new BookmarkRepository(prisma)
const service = new BookmarkService(repository)

export async function createBookmark(formData: FormData) {
  try {
    const rawData = {
      title: formData.get('title'),
      url: formData.get('url'),
      description: formData.get('description'),
      isFavorite: formData.get('isFavorite') === 'on',
    }

    const validatedData = CreateLinkSchema.parse(rawData)
    const result = await service.createLink(validatedData)
    
    revalidatePath('/')
    return { success: true, data: result }
  } catch (error) {
    console.error('Error creating bookmark:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create bookmark' 
    }
  }
}

export async function updateBookmark(id: string, formData: FormData) {
  try {
    const rawData = {
      title: formData.get('title'),
      url: formData.get('url'),
      description: formData.get('description'),
      isFavorite: formData.get('isFavorite') === 'on',
    }

    const validatedData = UpdateLinkSchema.parse({ ...rawData, id })
    const result = await service.updateLink(id, validatedData)
    
    revalidatePath('/')
    return { success: true, data: result }
  } catch (error) {
    console.error('Error updating bookmark:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update bookmark' 
    }
  }
}

export async function deleteBookmark(id: string) {
  try {
    await service.deleteLink(id)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error deleting bookmark:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete bookmark' 
    }
  }
}

export async function toggleFavorite(id: string) {
  try {
    const result = await service.toggleFavorite(id)
    revalidatePath('/')
    return { success: true, data: result }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to toggle favorite' 
    }
  }
}
