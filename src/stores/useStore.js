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
  }
}))
