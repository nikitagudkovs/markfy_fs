'use server'

import { revalidatePath } from 'next/cache'
import { getBookmarkService } from '@/lib/services/service-container'
import { CreateLinkSchema, UpdateLinkSchema } from '@/features/bookmarks/schemas/bookmark-schemas'

const service = getBookmarkService()

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
    
    // Only revalidate in production/development, not in test environment
    if (process.env.NODE_ENV !== 'test') {
      revalidatePath('/')
    }
    
    return { success: true, data: result }
  } catch (error) {
    console.error('Error creating bookmark:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create bookmark' 
    }
  }
}

export async function updateBookmark(formData: FormData) {
  try {
    const id = formData.get('id') as string
    if (!id) {
      throw new Error('Bookmark ID is required')
    }

    const rawData = {
      title: formData.get('title'),
      url: formData.get('url'),
      description: formData.get('description'),
      isFavorite: formData.get('isFavorite') === 'on',
    }

    const validatedData = UpdateLinkSchema.parse({ ...rawData, id })
    const result = await service.updateLink(id, validatedData)
    
    // Only revalidate in production/development, not in test environment
    if (process.env.NODE_ENV !== 'test') {
      revalidatePath('/')
    }
    
    return { success: true, data: result }
  } catch (error) {
    console.error('Error updating bookmark:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update bookmark' 
    }
  }
}

export async function deleteBookmark(formData: FormData) {
  try {
    const id = formData.get('id') as string
    if (!id) {
      throw new Error('Bookmark ID is required')
    }

    await service.deleteLink(id)
    
    // Only revalidate in production/development, not in test environment
    if (process.env.NODE_ENV !== 'test') {
      revalidatePath('/')
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting bookmark:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete bookmark' 
    }
  }
}

export async function toggleFavorite(formData: FormData) {
  try {
    const id = formData.get('id') as string
    if (!id) {
      throw new Error('Bookmark ID is required')
    }

    const result = await service.toggleFavorite(id)
    
    // Only revalidate in production/development, not in test environment
    if (process.env.NODE_ENV !== 'test') {
      revalidatePath('/')
    }
    
    return { success: true, data: result }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to toggle favorite' 
    }
  }
}
