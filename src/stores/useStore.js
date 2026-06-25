import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useStore = create((set, get) => ({
  places: [],
  plans: [],
  loading: false,
  
  // 場所データの取得
  fetchPlaces: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) set({ places: data || [] })
    set({ loading: false })
  },
  
  // 場所の追加
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
  
  // 場所の更新
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
  
  // 場所の削除
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
  
  // 複数削除
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

  // プランの取得
  fetchPlans: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('plans')
      .select(`
        *,
        plan_places (
          id,
          order_index,
          place:places (*)
        )
      `)
      .order('created_at', { ascending: false })
    
    if (!error) {
      const plansWithPlaces = data.map(plan => ({
        ...plan,
        places: plan.plan_places
          .sort((a, b) => a.order_index - b.order_index)
          .map(pp => pp.place)
      }))
      set({ plans: plansWithPlaces })
    }
    set({ loading: false })
  },

  // プランの追加
  addPlan: async (plan, placeIds) => {
    const { data: planData, error: planError } = await supabase
      .from('plans')
      .insert([plan])
      .select()
    
    if (planError || !planData) return { error: planError }

    const planId = planData[0].id
    
    // プランに場所を追加
    if (placeIds && placeIds.length > 0) {
      const planPlaces = placeIds.map((placeId, index) => ({
        plan_id: id,
        place_id: placeId,
        order_index: index
      }))

      const { error: planPlacesError } = await supabase
        .from('plan_places')
        .insert(planPlaces)
      
      if (planPlacesError) return { error: planPlacesError }
    }

    await get().fetchPlans()
    return { data: planData[0], error: null }
  },

  // プランの更新
  updatePlan: async (id, updates, placeIds) => {
    const { data, error } = await supabase
      .from('plans')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) return { error }

    // 場所の順序が変更された場合
    if (placeIds !== undefined) {
      // 既存の関連を削除
      await supabase
        .from('plan_places')
        .delete()
        .eq('plan_id', id)

      // 新しい関連を追加
      if (placeIds.length > 0) {
        const planPlaces = placeIds.map((placeId, index) => ({
          plan_id: id,
          place_id: placeId,
          order_index: index
        }))

        await supabase
          .from('plan_places')
          .insert(planPlaces)
      }
    }

    await get().fetchPlans()
    return { data: data[0], error: null }
  },

  // プランの削除
  deletePlan: async (id) => {
    const { error } = await supabase
      .from('plans')
      .delete()
      .eq('id', id)
    
    if (!error) {
      set({ plans: get().plans.filter(p => p.id !== id) })
    }
    return { error }
  },

  // プランに場所を追加
  addPlaceToPlan: async (planId, placeId) => {
    const plan = get().plans.find(p => p.id === planId)
    if (!plan) return { error: 'Plan not found' }

    const orderIndex = plan.places?.length || 0

    const { error } = await supabase
      .from('plan_places')
      .insert([{
        plan_id: id,
        place_id: placeId,
        order_index: orderIndex
      }])

    if (!error) {
      await get().fetchPlans()
    }
    return { error }
  },

  // プランから場所を削除
  removePlaceFromPlan: async (planId, placeId) => {
    const { error } = await supabase
      .from('plan_places')
      .delete()
      .eq('plan_id', planId)
      .eq('place_id', placeId)

    if (!error) {
      await get().fetchPlans()
    }
    return { error }
  }
}))
