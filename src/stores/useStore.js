import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useStore = create((set, get) => ({
  places: [],
  plans: [],
  loading: false,
  
  fetchPlaces: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) set({ places: data || [] })
    set({ loading: false })
  },
  
  addPlace: async (place) => {
    const { data, error } = await supabase
      .from('places')
      .insert([place])
      .select()
    
    if (!error && data) {
      set({ places: [data[0], ...get().places] })
    }
    return { data, error }
  },
  
  updatePlace: async (id, updates) => {
    const { data, error } = await supabase
      .from('places')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (!error && data) {
      set({
        places: get().places.map(p => p.id === id ? data[0] : p)
      })
    }
    return { data, error }
  },
  
  deletePlace: async (id) => {
    const { error } = await supabase
      .from('places')
      .delete()
      .eq('id', id)
    
    if (!error) {
      set({ places: get().places.filter(p => p.id !== id) })
    }
    return { error }
  },
  
  deletePlaces: async (ids) => {
    const { error } = await supabase
      .from('places')
      .delete()
      .in('id', ids)
    
    if (!error) {
      set({ places: get().places.filter(p => !ids.includes(p.id)) })
    }
    return { error }
  },

  uploadPhotos: async (files, placeId) => {
    const uploadedUrls = []
    for (const file of files) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${placeId}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `place-photos/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file)
      
      if (uploadError) {
        console.error('Upload error:', uploadError)
        continue
      }
      
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath)
      
      if (urlData?.publicUrl) {
        uploadedUrls.push(urlData.publicUrl)
      }
    }
    return uploadedUrls
  },

  deletePhoto: async (photoUrl) => {
    try {
      const urlParts = photoUrl.split('/place-photos/')
      if (urlParts.length === 2) {
        const filePath = `place-photos/${urlParts[1]}`
        const { error } = await supabase.storage
          .from('photos')
          .remove([filePath])
        
        if (error) {
          console.error('Delete photo error:', error)
        }
      }
    } catch (err) {
      console.error('Error deleting photo:', err)
    }
  },

  fetchPlans: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('plans')
      .select(`
        *,
        plan_places (
          id,
          order_index,
          time,
          custom_name,
          place:places (*)
        )
      `)
      .order('created_at', { ascending: false })
    
    if (!error) {
      const plansWithPlaces = data.map(plan => ({
        ...plan,
        places: plan.plan_places
          .sort((a, b) => {
            const timeA = a.time || '23:59:59'
            const timeB = b.time || '23:59:59'
            return timeA.localeCompare(timeB)
          })
          .map(pp => ({
            id: pp.id,
            place_id: pp.place?.id || null,
            name: pp.custom_name || pp.place?.name || '',
            category: pp.place?.category || 'カスタム',
            station: pp.place?.station || '',
            photos: pp.place?.photos || [],
            time: pp.time,
            isCustom: !pp.place
          }))
      }))
      set({ plans: plansWithPlaces })
    }
    set({ loading: false })
  },

  addPlan: async (plan, planPlaces) => {
    const { data: planData, error: planError } = await supabase
      .from('plans')
      .insert([plan])
      .select()
    
    if (planError || !planData) return { error: planError }

    const planId = planData[0].id
    
    if (planPlaces && planPlaces.length > 0) {
      const { error: planPlacesError } = await supabase
        .from('plan_places')
        .insert(planPlaces.map(pp => ({ ...pp, plan_id: planId })))
      
      if (planPlacesError) return { error: planPlacesError }
    }

    await get().fetchPlans()
    return { data: planData[0], error: null }
  },

  updatePlan: async (id, updates, planPlaces) => {
    const { data, error } = await supabase
      .from('plans')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) return { error }

    if (planPlaces !== undefined) {
      await supabase
        .from('plan_places')
        .delete()
        .eq('plan_id', id)

      if (planPlaces.length > 0) {
        await supabase
          .from('plan_places')
          .insert(planPlaces.map(pp => ({ ...pp, plan_id: id })))
      }
    }

    await get().fetchPlans()
    return { data: data[0], error: null }
  },

  deletePlan: async (id) => {
    const { error } = await supabase
      .from('plans')
      .delete()
      .eq('id', id)
    
    if (!error) {
      set({ plans: get().plans.filter(p => p.id !== id) })
    }
    return { error }
  }
}))
