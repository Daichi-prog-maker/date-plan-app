import React, { useEffect, useState } from 'react'
import { useStore } from '../stores/useStore'
import { Plus, MapPin, Check, Trash2, Search, X, Edit } from 'lucide-react'

const CATEGORIES = ['ご飯', 'カフェ', 'おでかけ(外)', 'おでかけ(室内)', '旅行']
const SEASONS = ['春', '夏', '秋', '冬', '通年']

export default function Home() {
  const stores = useStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPlace, setEditingPlace] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('すべて')
  const [selectedSeason, setSelectedSeason] = useState('すべて')
  const [visitedFilter, setVisitedFilter] = useState('すべて')
  const [searchText, setSearchText] = useState('')
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [sortBy, setSortBy] = useState('created_at') // created_at, name, favorite

  useEffect(() => {
    stores.fetchPlaces()
  }, [])

  let filteredPlaces = stores.places.filter(place => {
    const categoryMatch = selectedCategory === 'すべて' || place.category === selectedCategory
    const seasonMatch = selectedSeason === 'すべて' || place.season === selectedSeason
    const visitedMatch = visitedFilter === 'すべて' || 
      (visitedFilter === '訪問済み' ? place.visited : !place.visited)
    const searchMatch = searchText === '' || 
      place.name.includes(searchText) || 
      (place.address && place.address.includes(searchText)) ||
      (place.station && place.station.includes(searchText))
    return categoryMatch && seasonMatch && visitedMatch && searchMatch
  })

  // ソート処理
  filteredPlaces = [...filteredPlaces].sort((a, b) => {
    if (sortBy === 'favorite') {
      if (a.is_favorite === b.is_favorite) return new Date(b.created_at) - new Date(a.created_at)
      return a.is_favorite ? -1 : 1
    }
    if (sortBy === 'name') return a.name.localeCompare(b.name, 'ja')
    return new Date(b.created_at) - new Date(a.created_at)
  })

  const toggleVisited = async (place) => {
    await stores.updatePlace(place.id, { 
      visited: !place.visited,
      visited_date: !place.visited ? new Date().toISOString().split('T')[0] : null
    })
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    const count = selectedIds.length
    if (window.confirm(count + '件の場所を削除しますか？')) {
      await stores.deletePlaces(selectedIds)
      setSelectedIds([])
      setSelectMode(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fce7f3', paddingBottom: '5rem' }}>
      <div style={{ backgroundColor: 'white', padding: '1rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ec4899', textAlign: 'center', marginBottom: '1rem' }}>
          ○○に行きたいんじゃ！
        </h1>
        
        <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
          <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
          <input
            type="text"
            placeholder="場所や駅名で検索..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '9999px', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #fbcfe8', fontSize: '0.875rem', backgroundColor: 'white' }}
          >
            <option value="すべて">すべて</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #fbcfe8', fontSize: '0.875rem', backgroundColor: 'white' }}
          >
            <option value="すべて">すべて</option>
            {SEASONS.map(season => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
          <select
            value={visitedFilter}
            onChange={(e) => setVisitedFilter(e.target.value)}
            style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #fbcfe8', fontSize: '0.875rem', backgroundColor: 'white' }}
          >
            <option value="すべて">すべて</option>
            <option value="未訪問">未訪問</option>
            <option value="訪問済み">訪問済み</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #fbcfe8', fontSize: '0.875rem', backgroundColor: 'white' }}
          >
            <option value="created_at">新しい順</option>
            <option value="name">名前順</option>
            <option value="favorite">お気に入り順</option>
          </select>
        </div>
      </div>

      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setShowAddModal(true)}
            style={{ flex: 1, backgroundColor: '#ec4899', color: 'white', padding: '0.75rem', borderRadius: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Plus size={20} />
            新しい場所を追加
          </button>
          <button
            onClick={() => {
              setSelectMode(!selectMode)
              setSelectedIds([])
            }}
            style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', fontWeight: 'bold', border: selectMode ? 'none' : '1px solid #d1d5db', backgroundColor: selectMode ? '#6b7280' : 'white', color: selectMode ? 'white' : '#374151', cursor: 'pointer' }}
          >
            {selectMode ? 'キャンセル' : '選択'}
          </button>
        </div>

        {selectMode && selectedIds.length > 0 && (
          <button
            onClick={handleBulkDelete}
            style={{ width: '100%', backgroundColor: '#ef4444', color: 'white', padding: '0.75rem', borderRadius: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}
          >
            <Trash2 size={20} />
            {selectedIds.length}件を削除
          </button>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredPlaces.map(place => (
            <div
              key={place.id}
              onClick={() => selectMode && toggleSelect(place.id)}
              style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', cursor: selectMode ? 'pointer' : 'default', border: selectedIds.includes(place.id) ? '2px solid #ec4899' : 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                {selectMode && (
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(place.id)}
                    onChange={() => toggleSelect(place.id)}
                    style={{ marginTop: '0.25rem' }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  {place.photo_url && (
                    <img src={place.photo_url} alt={place.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '0.75rem' }} />
                  )}
                  <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{place.name}</h3>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', backgroundColor: '#fce7f3', color: '#db2777', borderRadius: '9999px' }}>
                          {place.category}
                        </span>
                        {place.season && (
                          <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', backgroundColor: '#dbeafe', color: '#2563eb', borderRadius: '9999px' }}>
                            {place.season}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {!selectMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingPlace(place)
                          }}
                          style={{ padding: '0.5rem', borderRadius: '9999px', border: 'none', backgroundColor: '#fef3c7', color: '#f59e0b', cursor: 'pointer' }}
                        >
                          <Edit size={18} />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleVisited(place)
                        }}
                        style={{ padding: '0.5rem', borderRadius: '9999px', border: 'none', backgroundColor: place.visited ? '#d1fae5' : '#f3f4f6', color: place.visited ? '#059669' : '#9ca3af', cursor: 'pointer' }}
                      >
                        <Check size={18} />
                      </button>
                    </div>
                  </div>
                  {place.station && (
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={14} />
                      {place.station}
                    </p>
                  )}
                  {place.address && (
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>{place.address}</p>
                  )}
                  {place.memo && (
                    <p style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.5rem' }}>{place.memo}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPlaces.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
            <p>まだ場所が登録されていません</p>
            <p style={{ fontSize: '0.875rem' }}>「新しい場所を追加」から登録してみましょう！</p>
          </div>
        )}
      </div>

      {showAddModal && <AddPlaceModal onClose={() => setShowAddModal(false)} />}
      {editingPlace && (
        <EditPlaceModal 
          place={editingPlace} 
          onClose={() => setEditingPlace(null)} 
        />
      )}
    </div>
  )
}

function AddPlaceModal({ onClose }) {
  const stores = useStore()
  const [formData, setFormData] = useState({
    name: '',
    category: 'ご飯',
    address: '',
    station: '',
    memo: '',
    season: '通年',
    photoFile: null,
    photoPreview: null
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('場所の名前を入力してください')
      return
    }
    
    let photo_url = null
    if (formData.photoFile) {
      const result = await stores.uploadPhoto(formData.photoFile, 'new')
      if (!result.error) {
        photo_url = result.data
      }
    }
    
    const placeData = { ...formData }
    delete placeData.photoFile
    delete placeData.photoPreview
    if (photo_url) placeData.photo_url = photo_url
    
    await stores.addPlace(placeData)
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', maxWidth: '28rem', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>新しい場所を追加</h2>
          <button onClick={onClose} style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>場所の名前 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              placeholder="例: 新宿カフェ"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>カテゴリ *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>最寄り駅</label>
            <input
              type="text"
              value={formData.station}
              onChange={(e) => setFormData({...formData, station: e.target.value})}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              placeholder="例: 新宿駅"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>住所</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              placeholder="例: 東京都新宿区..."
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>季節</label>
            <select
              value={formData.season}
              onChange={(e) => setFormData({...formData, season: e.target.value})}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            >
              {SEASONS.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>メモ</label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({...formData, memo: e.target.value})}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              rows="3"
              placeholder="例: インスタで見つけた！パンケーキが美味しそう"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>写真</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    setFormData({...formData, photoFile: file, photoPreview: reader.result})
                  }
                  reader.readAsDataURL(file)
                }
              }}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            />
            {formData.photoPreview && (
              <img src={formData.photoPreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginTop: '0.5rem', borderRadius: '0.5rem' }} />
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontWeight: 'bold', backgroundColor: 'white', cursor: 'pointer' }}
            >
              キャンセル
            </button>
            <button
              type="submit"
              style={{ flex: 1, padding: '0.75rem 1rem', backgroundColor: '#ec4899', color: 'white', borderRadius: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditPlaceModal({ place, onClose }) {
  const stores = useStore()
  const [formData, setFormData] = useState({
    name: place.name || '',
    category: place.category || 'ご飯',
    address: place.address || '',
    station: place.station || '',
    memo: place.memo || '',
    season: place.season || '通年',
    photoFile: null,
    photoPreview: place.photo_url || null
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('場所の名前を入力してください')
      return
    }
    
    let photo_url = formData.photoPreview
    if (formData.photoFile) {
      const result = await stores.uploadPhoto(formData.photoFile, place.id)
      if (!result.error) {
        photo_url = result.data
      }
    }
    
    const placeData = { ...formData }
    delete placeData.photoFile
    delete placeData.photoPreview
    if (photo_url) placeData.photo_url = photo_url
    
    await stores.updatePlace(place.id, placeData)
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', maxWidth: '28rem', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>場所を編集</h2>
          <button onClick={onClose} style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>場所の名前 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              placeholder="例: 新宿カフェ"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>カテゴリ *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>最寄り駅</label>
            <input
              type="text"
              value={formData.station}
              onChange={(e) => setFormData({...formData, station: e.target.value})}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              placeholder="例: 新宿駅"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>住所</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              placeholder="例: 東京都新宿区..."
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>季節</label>
            <select
              value={formData.season}
              onChange={(e) => setFormData({...formData, season: e.target.value})}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            >
              {SEASONS.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>メモ</label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({...formData, memo: e.target.value})}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              rows="3"
              placeholder="例: インスタで見つけた！パンケーキが美味しそう"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontWeight: 'bold', backgroundColor: 'white', cursor: 'pointer' }}
            >
              キャンセル
            </button>
            <button
              type="submit"
              style={{ flex: 1, padding: '0.75rem 1rem', backgroundColor: '#ec4899', color: 'white', borderRadius: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
            >
              更新
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
