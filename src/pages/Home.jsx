import React, { useEffect, useState } from 'react'
import { useStore } from '../stores/useStore'
import { Plus, Search, Filter } from 'lucide-react'

export default function Home() {
  const { places, loading, fetchPlaces } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  useEffect(() => {
    fetchPlaces()
  }, [fetchPlaces])
  
  const categories = ['all', 'ご飯', 'カフェ', 'おでかけ(外)', 'おでかけ(室内)', '旅行']
  
  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory
    return matchesSearch && matchesCategory
  })
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="場所を検索..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-primary btn-circle">
          <Plus size={24} />
        </button>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-outline'}
          >
            {cat === 'all' ? 'すべて' : cat}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>まだ場所が登録されていません</p>
          <p className="text-sm">右上の＋ボタンから追加してみましょう！</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPlaces.map(place => (
            <div key={place.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{place.name}</h2>
                <p className="text-sm text-gray-600">{place.category}</p>
                {place.memo && <p className="text-sm">{place.memo}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
