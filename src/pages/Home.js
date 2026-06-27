import React, { useEffect, useState } from 'react'
import { useStore } from '../stores/useStore'
import { Plus, Search, Trash2, X, MapPin, Calendar, Tag, Filter } from 'lucide-react'

export default function Home() {
  const { places, loading, fetchPlaces, deletePlace, deletePlaces } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSeason, setSelectedSeason] = useState('all')
  const [showVisitedOnly, setShowVisitedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPlace, setEditingPlace] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchPlaces()
  }, [fetchPlaces])

  const categories = ['all', 'ご飯', 'カフェ', 'おでかけ(外)', 'おでかけ(室内)', '旅行']
  const seasons = ['all', '春', '夏', '秋', '冬', '通年']

  let filteredPlaces = places.filter(place => {
    const matchesSearch = 
      place.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.station?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.address?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory
    const matchesSeason = selectedSeason === 'all' || place.season === selectedSeason
    const matchesVisited = !showVisitedOnly || place.visited
    return matchesSearch && matchesCategory && matchesSeason && matchesVisited
  })

  if (sortBy === 'name') {
    filteredPlaces = [...filteredPlaces].sort((a, b) => a.name.localeCompare(b.name, 'ja'))
  }

  const handleDelete = async (id) => {
    if (window.confirm('この場所を削除しますか？')) {
      await deletePlace(id)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (window.confirm(`選択した${selectedIds.length}件の場所を削除しますか？`)) {
      await deletePlaces(selectedIds)
      setSelectedIds([])
      setIsSelectionMode(false)
    }
  }

  const toggleSelection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div style={{ padding: '16px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'stretch' }}>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            width: '48px',
            minWidth: '48px',
            height: '48px',
            borderRadius: '8px',
            backgroundColor: showFilters ? '#ec4899' : 'white',
            color: showFilters ? 'white' : '#ec4899',
            border: showFilters ? 'none' : '1px solid #ec4899',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <Filter size={20} />
        </button>
        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <Search style={{ position: 'absolute', left: '12px', top: '14px', color: '#9ca3af', pointerEvents: 'none' }} size={20} />
          <input
            type="text"
            placeholder="リストから検索..."
            style={{
              width: '100%',
              height: '48px',
              padding: '10px 10px 10px 40px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            width: '48px',
            minWidth: '48px',
            height: '48px',
            borderRadius: '8px',
            backgroundColor: '#ec4899',
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <Plus size={24} />
        </button>
      </div>

      {showFilters && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '16px', 
          marginBottom: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
              カテゴリー
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="all">すべて</option>
              <option value="ご飯">ご飯</option>
              <option value="カフェ">カフェ</option>
              <option value="おでかけ(外)">おでかけ(外)</option>
              <option value="おでかけ(室内)">おでかけ(室内)</option>
              <option value="旅行">旅行</option>
            </select>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
              季節
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="all">すべて</option>
              <option value="春">春</option>
              <option value="夏">夏</option>
              <option value="秋">秋</option>
              <option value="冬">冬</option>
              <option value="通年">通年</option>
            </select>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
              並び順
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="newest">新しい順</option>
              <option value="name">名前順</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowVisitedOnly(!showVisitedOnly)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: showVisitedOnly ? 'none' : '1px solid #ec4899',
                backgroundColor: showVisitedOnly ? '#ec4899' : 'white',
                color: showVisitedOnly ? 'white' : '#ec4899',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              行った場所のみ
            </button>
            <button
              onClick={() => {
                setIsSelectionMode(!isSelectionMode)
                setSelectedIds([])
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: isSelectionMode ? 'none' : '1px solid #ec4899',
                backgroundColor: isSelectionMode ? '#ec4899' : 'white',
                color: isSelectionMode ? 'white' : '#ec4899',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              {isSelectionMode ? 'キャンセル' : '選択'}
            </button>
            {isSelectionMode && selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Trash2 size={16} />
                削除 ({selectedIds.length})
              </button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #ec4899',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
          <p>場所が見つかりませんでした</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>右上の＋ボタンから追加してみましょう！</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredPlaces.map(place => (
            <PlaceCard
              key={place.id}
              place={place}
              isSelectionMode={isSelectionMode}
              isSelected={selectedIds.includes(place.id)}
              onToggleSelection={() => toggleSelection(place.id)}
              onEdit={() => {
                setEditingPlace(place)
                setShowEditModal(true)
              }}
              onDelete={() => handleDelete(place.id)}
            />
          ))}
        </div>
      )}

      {showAddModal && <AddPlaceModal onClose={() => setShowAddModal(false)} />}
      {showEditModal && editingPlace && (
        <EditPlaceModal
          place={editingPlace}
          onClose={() => {
            setShowEditModal(false)
            setEditingPlace(null)
          }}
        />
      )}
    </div>
  )
}

function PlaceCard({ place, isSelectionMode, isSelected, onToggleSelection, onEdit, onDelete }) {
  const { updatePlace } = useStore()

  const toggleVisited = async (e) => {
    e.stopPropagation()
    await updatePlace(place.id, {
      visited: !place.visited,
      visited_date: !place.visited ? new Date().toISOString() : null
    })
  }

  const photos = place.photos || []
  const displayPhotos = photos.slice(0, 2)

  return (
    <div
      onClick={isSelectionMode ? onToggleSelection : onEdit}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '16px',
        cursor: 'pointer',
        border: isSelected ? '2px solid #ec4899' : '2px solid transparent',
        position: 'relative'
      }}
    >
      {isSelectionMode && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: '2px solid #ec4899',
          backgroundColor: isSelected ? '#ec4899' : 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}>
          {isSelected && <span style={{ color: 'white', fontSize: '16px' }}>✓</span>}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#111827' }}>
            {place.name}
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: '#fce7f3',
              color: '#ec4899',
              fontSize: '12px'
            }}>
              {place.category}
            </span>
            {place.season && (
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: '#fef3c7',
                color: '#f59e0b',
                fontSize: '12px'
              }}>
                {place.season}
              </span>
            )}
          </div>

          {place.station && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
              <MapPin size={14} />
              <span>{place.station}</span>
            </div>
          )}

          {place.memo && (
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
              {place.memo}
            </p>
          )}

          {!isSelectionMode && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                onClick={toggleVisited}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: place.visited ? '#22c55e' : '#e5e7eb',
                  color: place.visited ? 'white' : '#6b7280',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {place.visited ? '✓ 行った' : '行ってない'}
              </button>
              {place.visited && place.visited_date && (
                <span style={{ fontSize: '12px', color: '#9ca3af', alignSelf: 'center' }}>
                  {new Date(place.visited_date).toLocaleDateString('ja-JP')}
                </span>
              )}
            </div>
          )}
        </div>

        {displayPhotos.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexShrink: 0, flexDirection: 'column' }}>
            {displayPhotos.map((photoUrl, idx) => (
              <img
                key={idx}
                src={photoUrl}
                alt=""
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '6px',
                  objectFit: 'cover'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AddPlaceModal({ onClose }) {
  const { addPlace, uploadPhotos } = useStore()
  const [formData, setFormData] = useState({
    name: '',
    category: 'ご飯',
    season: '通年',
    station: '',
    address: '',
    memo: '',
    visited: false
  })
  const [photoFiles, setPhotoFiles] = useState([])
  const [photoPreviews, setPhotoPreviews] = useState([])
  const [uploading, setUploading] = useState(false)

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || [])
    setPhotoFiles(prev => [...prev, ...files])
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreviews(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index))
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      const tempId = Date.now()
      let photoUrls = []

      if (photoFiles.length > 0) {
        photoUrls = await uploadPhotos(photoFiles, tempId)
      }

      const { data, error } = await addPlace({
        ...formData,
        photos: photoUrls
      })

      if (error) {
        alert('エラーが発生しました')
        console.error(error)
      } else {
        onClose()
      }
    } catch (err) {
      alert('エラーが発生しました')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>新しい場所を追加</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              場所名 *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              カテゴリー *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option>ご飯</option>
              <option>カフェ</option>
              <option>おでかけ(外)</option>
              <option>おでかけ(室内)</option>
              <option>旅行</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              季節
            </label>
            <select
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option>通年</option>
              <option>春</option>
              <option>夏</option>
              <option>秋</option>
              <option>冬</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              最寄り駅
            </label>
            <input
              type="text"
              value={formData.station}
              onChange={(e) => setFormData({ ...formData, station: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              住所
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              メモ
            </label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              写真
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            {photoPreviews.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                {photoPreviews.map((preview, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img
                      src={preview}
                      alt=""
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', paddingBottom: '20px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                backgroundColor: 'white',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={uploading}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: uploading ? '#9ca3af' : '#ec4899',
                color: 'white',
                fontSize: '16px',
                cursor: uploading ? 'not-allowed' : 'pointer'
              }}
            >
              {uploading ? 'アップロード中...' : '追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditPlaceModal({ place, onClose }) {
  const { updatePlace, uploadPhotos, deletePhoto } = useStore()
  const [formData, setFormData] = useState({
    name: place.name || '',
    category: place.category || 'ご飯',
    season: place.season || '通年',
    station: place.station || '',
    address: place.address || '',
    memo: place.memo || '',
    visited: place.visited || false
  })
  const [existingPhotos, setExistingPhotos] = useState(place.photos || [])
  const [newPhotoFiles, setNewPhotoFiles] = useState([])
  const [newPhotoPreviews, setNewPhotoPreviews] = useState([])
  const [uploading, setUploading] = useState(false)

  const handleNewPhotoChange = (e) => {
    const files = Array.from(e.target.files || [])
    setNewPhotoFiles(prev => [...prev, ...files])
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewPhotoPreviews(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeExistingPhoto = async (photoUrl, index) => {
    await deletePhoto(photoUrl)
    setExistingPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const removeNewPhoto = (index) => {
    setNewPhotoFiles(prev => prev.filter((_, i) => i !== index))
    setNewPhotoPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      let allPhotoUrls = [...existingPhotos]

      if (newPhotoFiles.length > 0) {
        const uploadedUrls = await uploadPhotos(newPhotoFiles, place.id)
        allPhotoUrls = [...allPhotoUrls, ...uploadedUrls]
      }

      const { error } = await updatePlace(place.id, {
        ...formData,
        photos: allPhotoUrls
      })

      if (error) {
        alert('エラーが発生しました')
        console.error(
error)
      } else {
        onClose()
      }
    } catch (err) {
      alert('エラーが発生しました')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>場所を編集</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              場所名 *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              カテゴリー *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option>ご飯</option>
              <option>カフェ</option>
              <option>おでかけ(外)</option>
              <option>おでかけ(室内)</option>
              <option>旅行</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              季節
            </label>
            <select
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option>通年</option>
              <option>春</option>
              <option>夏</option>
              <option>秋</option>
              <option>冬</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              最寄り駅
            </label>
            <input
              type="text"
              value={formData.station}
              onChange={(e) => setFormData({ ...formData, station: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              住所
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              メモ
            </label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              既存の写真
            </label>
            {existingPhotos.length > 0 ? (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {existingPhotos.map((photoUrl, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img
                      src={photoUrl}
                      alt=""
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(photoUrl, idx)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>写真がありません</p>
            )}

            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              新しい写真を追加
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleNewPhotoChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            {newPhotoPreviews.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                {newPhotoPreviews.map((preview, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img
                      src={preview}
                      alt=""
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeNewPhoto(idx)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', paddingBottom: '20px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                backgroundColor: 'white',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={uploading}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: uploading ? '#9ca3af' : '#ec4899',
                color: 'white',
                fontSize: '16px',
                cursor: uploading ? 'not-allowed' : 'pointer'
              }}
            >
              {uploading ? 'アップロード中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
