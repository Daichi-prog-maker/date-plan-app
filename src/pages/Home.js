import React, { useEffect, useState } from 'react'
import { useStore } from '../stores/useStore'
import { Plus, Search, Trash2, X, MapPin, Calendar, Tag, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { ghibliStyles, commonStyles, mergeGhibliStyles } from '../stores/ghibliStyles'

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
    <div style={{ padding: '16px', paddingBottom: '100px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'stretch' }}>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={mergeGhibliStyles(
            showFilters ? ghibliStyles.buttonPink : ghibliStyles.button,
            { width: '48px', minWidth: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }
          )}
        >
          <Filter size={20} />
        </button>
        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <Search style={{ position: 'absolute', left: '12px', top: '14px', color: '#8B7355', pointerEvents: 'none' }} size={20} />
          <input
            type="text"
            placeholder="リストから検索..."
            style={mergeGhibliStyles(ghibliStyles.input, {
              width: '100%',
              height: '48px',
              paddingLeft: '40px',
              boxSizing: 'border-box'
            })}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={mergeGhibliStyles(ghibliStyles.buttonPink, {
            width: '48px',
            minWidth: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          })}
        >
          <Plus size={24} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={mergeGhibliStyles(ghibliStyles.input, {
            padding: '8px 16px',
            cursor: 'pointer'
          })}
        >
          <option value="newest">新しい順</option>
          <option value="name">名前順</option>
        </select>
        <button
          onClick={() => {
            setIsSelectionMode(!isSelectionMode)
            setSelectedIds([])
          }}
          style={mergeGhibliStyles(
            isSelectionMode ? ghibliStyles.buttonPink : ghibliStyles.button,
            { padding: '8px 16px' }
          )}
        >
          {isSelectionMode ? 'キャンセル' : '選択'}
        </button>
        {isSelectionMode && selectedIds.length > 0 && (
          <button
            onClick={handleBulkDelete}
            style={mergeGhibliStyles(ghibliStyles.button, {
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'linear-gradient(to bottom, #D19A9A 0%, #B87C7C 100%)',
              border: '2px solid #A86B6B'
            })}
          >
            <Trash2 size={16} />
            削除 ({selectedIds.length})
          </button>
        )}
      </div>

      {showFilters && (
        <div style={mergeGhibliStyles(ghibliStyles.card, {
          padding: '16px',
          marginBottom: '16px'
        })}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#4A3F35' }}>
              カテゴリー
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={mergeGhibliStyles(ghibliStyles.input, {
                width: '100%',
                cursor: 'pointer'
              })}
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
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#4A3F35' }}>
              季節
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              style={mergeGhibliStyles(ghibliStyles.input, {
                width: '100%',
                cursor: 'pointer'
              })}
            >
              <option value="all">すべて</option>
              <option value="春">春</option>
              <option value="夏">夏</option>
              <option value="秋">秋</option>
              <option value="冬">冬</option>
              <option value="通年">通年</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowVisitedOnly(!showVisitedOnly)}
              style={mergeGhibliStyles(
                showVisitedOnly ? ghibliStyles.buttonPink : ghibliStyles.button,
                { padding: '8px 16px' }
              )}
            >
              行った場所のみ
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ 
            border: '4px solid #E8DCC8',
            borderTop: '4px solid #8B7355',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div style={mergeGhibliStyles(ghibliStyles.card, {
          textAlign: 'center',
          padding: '3rem 1rem'
        })}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#4A3F35', marginBottom: '0.5rem' }}>
            場所が見つかりませんでした
          </h2>
          <p style={{ color: '#8B7355', fontSize: '0.875rem' }}>
            右上の＋ボタンから追加してみましょう！
          </p>
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
// PhotoViewer Component
function PhotoViewer({ photos, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(74, 63, 53, 0.95)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        style={mergeGhibliStyles(ghibliStyles.button, {
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2001
        })}
      >
        <X size={24} />
      </button>

      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            style={mergeGhibliStyles(ghibliStyles.button, {
              position: 'absolute',
              left: '16px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2001
            })}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            style={mergeGhibliStyles(ghibliStyles.button, {
              position: 'absolute',
              right: '16px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2001
            })}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      <img
        src={photos[currentIndex]}
        alt=""
        style={{
          maxWidth: '90%',
          maxHeight: '90%',
          objectFit: 'contain',
          borderRadius: '12px',
          border: '3px solid #8B7355'
        }}
        onClick={(e) => e.stopPropagation()}
      />

      {photos.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#F5F1E8',
            fontSize: '14px',
            backgroundColor: 'rgba(139, 115, 85, 0.8)',
            padding: '8px 16px',
            borderRadius: '20px',
            border: '2px solid #8B7355'
          }}
        >
          {currentIndex + 1} / {photos.length}
        </div>
      )}
    </div>
  )
}

// PlaceCard Component
function PlaceCard({ place, isSelectionMode, isSelected, onToggleSelection, onEdit, onDelete }) {
  const { updatePlace } = useStore()
  const [showPhotoViewer, setShowPhotoViewer] = useState(false)
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0)

  const toggleVisited = async (e) => {
    e.stopPropagation()
    await updatePlace(place.id, {
      visited: !place.visited,
      visited_date: !place.visited ? new Date().toISOString() : null
    })
  }

  const photos = place.photos || []
  const displayPhotos = photos.slice(0, 3)

  const openPhotoViewer = (e, index) => {
    e.stopPropagation()
    setPhotoViewerIndex(index)
    setShowPhotoViewer(true)
  }

  return (
    <>
      <div
        onClick={isSelectionMode ? onToggleSelection : onEdit}
        style={mergeGhibliStyles(ghibliStyles.card, {
          padding: '16px',
          cursor: 'pointer',
          border: isSelected ? '3px solid #E8B5B5' : '3px solid #8B7355',
          position: 'relative'
        })}
      >
        {isSelectionMode && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '2px solid #8B7355',
            backgroundColor: isSelected ? '#E8B5B5' : '#FAF8F3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}>
            {isSelected && <span style={{ color: '#4A3F35', fontSize: '16px' }}>✓</span>}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#4A3F35' }}>
              {place.name}
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
              <span style={ghibliStyles.tag}>
                {place.category}
              </span>
              {place.season && (
                <span style={mergeGhibliStyles(ghibliStyles.tag, {
                  background: 'linear-gradient(to bottom, #B8C5B0 0%, #9DB89A 100%)',
                  border: '1px solid #8B9E88'
                })}>
                  {place.season}
                </span>
              )}
            </div>

            {place.station && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#8B7355', marginBottom: '4px' }}>
                <MapPin size={14} />
                <span>{place.station}</span>
              </div>
            )}

            {place.memo && (
              <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#8B7355', lineHeight: '1.5' }}>
                {place.memo}
              </p>
            )}

            {!isSelectionMode && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button
                  onClick={toggleVisited}
                  style={mergeGhibliStyles(
                    place.visited ? 
                      { ...ghibliStyles.button, background: 'linear-gradient(to bottom, #B8C5B0 0%, #9DB89A 100%)', border: '2px solid #8B9E88' } : 
                      ghibliStyles.button,
                    { padding: '6px 12px', fontSize: '12px' }
                  )}
                >
                  {place.visited ? '✓ 行った' : '行ってない'}
                </button>
                {place.visited && place.visited_date && (
                  <span style={{ fontSize: '12px', color: '#8B7355', alignSelf: 'center' }}>
                    {new Date(place.visited_date).toLocaleDateString('ja-JP')}
                  </span>
                )}
              </div>
            )}
          </div>

          {displayPhotos.length > 0 && (
            <div style={{ display: 'flex', gap: '4px', flexShrink: 0, flexDirection: 'row', flexWrap: 'wrap', maxWidth: '200px' }}>
              {displayPhotos.map((photoUrl, idx) => (
                <img
                  key={idx}
                  src={photoUrl}
                  alt=""
                  onClick={(e) => openPhotoViewer(e, idx)}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: '2px solid #C9A87C'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showPhotoViewer && (
        <PhotoViewer
          photos={photos}
          initialIndex={photoViewerIndex}
          onClose={() => setShowPhotoViewer(false)}
        />
      )}
    </>
  )
}
// AddPlaceModal Component
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
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)

  // Google Places Autocomplete state
  const [searchQuery, setSearchQuery] = useState('')
  const [predictions, setPredictions] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    const newPlace = {
      ...formData,
      visited_date: formData.visited ? new Date().toISOString() : null,
      photos: []
    }

    const { data, error } = await addPlace(newPlace)

    if (!error && data && photos.length > 0) {
      const uploadedUrls = await uploadPhotos(photos, data.id)
      if (uploadedUrls.length > 0) {
        await useStore.getState().updatePlace(data.id, { photos: uploadedUrls })
      }
    }

    setUploading(false)
    if (!error) onClose()
  }

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files)
    setPhotos(prev => [...prev, ...files])
  }

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  // Google Places Autocomplete
  const searchPlaces = async (query) => {
    if (query.length < 3) {
      setPredictions([])
      return
    }

    setIsSearching(true)
    try {
      const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&language=ja&components=country:jp&key=${apiKey}`
      )
      const data = await response.json()
      
      if (data.predictions) {
        setPredictions(data.predictions)
      }
    } catch (error) {
      console.error('Place search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    searchPlaces(query)
  }

  const selectPlace = async (placeId) => {
    try {
      const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&language=ja&fields=name,formatted_address,geometry&key=${apiKey}`
      )
      const data = await response.json()
      
      if (data.result) {
        const result = data.result
        const addressParts = result.formatted_address.split(' ')
        
        setFormData(prev => ({
          ...prev,
          name: result.name,
          address: result.formatted_address,
          station: addressParts[0] || ''
        }))
        
        setSearchQuery('')
        setPredictions([])
      }
    } catch (error) {
      console.error('Place details error:', error)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(74, 63, 53, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={mergeGhibliStyles(ghibliStyles.card, {
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '24px',
        position: 'relative'
      })}>
        <button
          onClick={onClose}
          style={mergeGhibliStyles(ghibliStyles.button, {
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0
          })}
        >
          <X size={20} />
        </button>

        <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', fontWeight: '600', color: '#4A3F35' }}>
          新しい場所を追加
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Google Places Search */}
          <div style={{ marginBottom: '16px' }}>
            <label style={commonStyles.label}>
              Google検索
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="場所を検索..."
                style={mergeGhibliStyles(ghibliStyles.input, {
                  width: '100%',
                  boxSizing: 'border-box'
                })}
              />
              {isSearching && (
                <div style={{ 
                  position: 'absolute', 
                  right: '12px', 
                  top: '12px',
                  color: '#8B7355' 
                }}>
                  検索中...
                </div>
              )}
              {predictions.length > 0 && (
                <div style={mergeGhibliStyles(ghibliStyles.card, {
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  maxHeight: '200px',
                  overflow: 'auto',
                  zIndex: 1001,
                  padding: '8px'
                })}>
                  {predictions.map((prediction) => (
                    <div
                      key={prediction.place_id}
                      onClick={() => selectPlace(prediction.place_id)}
                      style={{
                        padding: '12px',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        marginBottom: '4px',
                        backgroundColor: '#FAF8F3',
                        border: '2px solid transparent',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F5F1E8'
                        e.currentTarget.style.borderColor = '#C9A87C'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FAF8F3'
                        e.currentTarget.style.borderColor = 'transparent'
                      }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#4A3F35', marginBottom: '2px' }}>
                        {prediction.structured_formatting.main_text}
                      </div>
                      <div style={{ fontSize: '12px', color: '#8B7355' }}>
                        {prediction.structured_formatting.secondary_text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={commonStyles.label}>
              場所名 <span style={{ color: '#E8B5B5' }}>*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={mergeGhibliStyles(ghibliStyles.input, {
                width: '100%',
                boxSizing: 'border-box'
              })}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={commonStyles.label}>
              カテゴリー
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={mergeGhibliStyles(ghibliStyles.input, {
                width: '100%',
                boxSizing: 'border-box',
                cursor: 'pointer'
              })}
            >
              <option value="ご飯">ご飯</option>
              <option value="カフェ">カフェ</option>
              <option value="おでかけ(外)">おでかけ(外)</option>
              <option value="おでかけ(室内)">おでかけ(室内)</option>
              <option value="旅行">旅行</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={commonStyles.label}>
              季節
            </label>
            <select
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              style={mergeGhibliStyles(ghibliStyles.input, {
                width: '100%',
                boxSizing: 'border-box',
                cursor: 'pointer'
              })}
            >
              <option value="通年">通年</option>
              <option value="春">春</option>
              <option value="夏">夏</option>
              <option value="秋">秋</option>
              <option value="冬">冬</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={commonStyles.label}>
              最寄り駅
            </label>
            <input
              type="text"
              value={formData.station}
              onChange={(e) => setFormData({ ...formData, station: e.target.value })}
              style={mergeGhibliStyles(ghibliStyles.input, {
                width: '100%',
                boxSizing: 'border-box'
              })}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={commonStyles.label}>
              住所
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={mergeGhibliStyles(ghibliStyles.input, {
                width: '100%',
                boxSizing: 'border-box'
              })}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={commonStyles.label}>
              メモ
            </label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              rows={3}
              style={mergeGhibliStyles(ghibliStyles.input, {
                width: '100%',
                boxSizing: 'border-box',
                resize: 'vertical',
                fontFamily: 'inherit'
              })}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={commonStyles.label}>
              写真
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px',
                fontSize: '14px',
                color: '#4A3F35',
                border: '2px solid #C9A87C',
                borderRadius: '8px',
                backgroundColor: '#FAF8F3',
                cursor: 'pointer'
              }}
            />
            {photos.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {photos.map((photo, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={URL.createObjectURL(photo)}
                      alt=""
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #C9A87C'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '2px solid #8B7355',
                        backgroundColor: '#E8B5B5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <X size={14} color="#4A3F35" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.visited}
                onChange={(e) => setFormData({ ...formData, visited: e.target.checked })}
                style={{ 
                  width: '18px', 
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: '#C9A87C'
                }}
              />
              <span style={{ fontSize: '14px', color: '#4A3F35' }}>すでに行った</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={mergeGhibliStyles(ghibliStyles.button, {
                flex: 1,
                padding: '12px'
              })}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={uploading}
              style={mergeGhibliStyles(ghibliStyles.buttonPink, {
                flex: 1,
                padding: '12px',
                opacity: uploading ? 0.6 : 1
              })}
            >
              {uploading ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
// EditPlaceModal Component
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
  const [newPhotos, setNewPhotos] = useState([])
  const [uploading, setUploading] = useState(false)

  // Google Places Autocomplete state
  const [searchQuery, setSearchQuery] = useState('')
  const [predictions, setPredictions] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    let finalPhotos = [...existingPhotos]

    if (newPhotos.length > 0) {
      const uploadedUrls = await uploadPhotos(newPhotos, place.id)
      finalPhotos = [...finalPhotos, ...uploadedUrls]
    }

    await updatePlace(place.id, {
      ...formData,
      photos: finalPhotos,
      visited_date: formData.visited && !place.visited ? new Date().toISOString() : place.visited_date
    })

    setUploading(false)
    onClose()
  }

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files)
    setNewPhotos(prev => [...prev, ...files])
  }

  const removeNewPhoto = (index) => {
    setNewPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingPhoto = async (photoUrl) => {
    if (window.confirm('この写真を削除しますか？')) {
      await deletePhoto(photoUrl)
      setExistingPhotos(prev => prev.filter(url => url !== photoUrl))
    }
  }

  // Google Places Autocomplete
  const searchPlaces = async (query) => {
    if (query.length < 3) {
      setPredictions([])
      return
    }

    setIsSearching(true)
    try {
      const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&language=ja&components=country:jp&key=${apiKey}`
      )
      const data = await response.json()
      
      if (data.predictions) {
        setPredictions(data.predictions)
      }
    } catch (error) {
      console.error('Place search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    searchPlaces(query)
  }

  const selectPlace = async (placeId) => {
    try {
      const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&language=ja&fields=name,formatted_address,geometry&key=${apiKey}`
      )
      const data = await response.json()
      
      if (data.result) {
        const result = data.result
        const addressParts = result.formatted_address.split(' ')
        
        setFormData(prev => ({
          ...prev,
          name: result.name,
          address: result.formatted_address,
          station: addressParts[0] || ''
        }))
        
        setSearchQuery('')
        setPredictions([])
      }
    } catch (error) {
      console.error('Place details error:', error)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(74, 63, 53, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={mergeGhibliStyles(ghibliStyles.card, {
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '24px',
        position: 'relative'
      })}>
        <button
          onClick={onClose}
          style={mergeGhibliStyles(ghibliStyles.button, {
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0
          })}
        >
          <X size={20} />
        </button>

        <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', fontWeight: '600', color: '#4A3F35' }}>
          場所を編集
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Google Places Search */}
          <div style={{ marginBottom: '16px' }}>
            <label style={commonStyles.label}>
              Google検索
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="場所を検索..."
                style={mergeGhibliStyles(ghibliStyles.input, {
                  width: '100%',
                  boxSizing: 'border-box'
                })}
              />
              {isSearching && (
                <div style={{ 
                  position: 'absolute', 
                  right: '12px', 
                  top: '12px',
                  color: '#8B7355' 
                }}>
                  検索中...
                </div>
              )}
              {predictions.length > 0 && (
                <div 
                  style={mergeGhibliStyles(ghibliStyles.card, {
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    maxHeight: '250px',
                    overflow: 'auto',
                    zIndex: 99999,
                    padding: '8px',
                    boxShadow: '0 8px 24px rgba(74, 63, 53, 0.5)',
                    touchAction: 'auto'
                  })}
                  onClick={(e) => e.stopPropagation()}
                >

                  {predictions.map((prediction) => (
                    <div
                      key={prediction.place_id}
                      onClick={() => selectPlace(prediction.place_id)}
                      style={{
                        padding: '12px',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        marginBottom: '4px',
                        backgroundColor: '#FAF8F3',
                        border: '2px solid transparent',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F5F1E8'
                        e.currentTarget.style.borderColor = '#C9A87C'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FAF8F3'
                        e.currentTarget.style.borderColor = 'transparent'
                      }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#4A3F35', marginBottom: '2px' }}>
                        {prediction.structured_formatting.main_text}
                      </div>
                      <div style={{ fontSize: '12px', color: '#8B7355' }}>
                        {prediction.structured_formatting.secondary_text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={commonStyles.label}>
              場所名 <span style={{ color: '#E8B5B5' }}>*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={mergeGhibliStyles(ghibliStyles.input, {
                width: '100%',
                boxSizing: 'border-box'
              })}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={commonStyles.label}>
              カテゴリー
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={mergeGhibliStyles(ghibliStyles.input, {
                width: '100%',
                boxSizing: 'border-box',
                cursor: 'pointer'
              })}
            >
              <option value="ご飯">ご飯</option>
              <option value="カフェ">カフェ</option>
              <option value="おでかけ(外)">おでかけ(外)</option>
              <option value="おでかけ(室内)">おでかけ(室内)</option>
              <option value="旅行">旅行</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={commonStyles.label}>
              季節
            </label>
            <select
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              style={mergeGhibliStyles(ghibliStyles.input, {
                width: '100%',
                boxSizing: 'border-box',
                cursor: 'pointer'
              })}
            >
              <option value="通年">通年</option>
              <option value="春">春</option>
              <option value="夏">夏</option>
              <option value="秋">秋</option>
              <option value="冬">冬</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={commonStyles.label}>
              最寄り駅
            </label>
            <input
              type="text"
              value={formData.station}
              onChange={(e) => setFormData({ ...formData, station: e.target.value })}
              style={mergeGhibliStyles(ghibliStyles.input, {
                width: '100%',
                boxSizing: 'border-box'
              })}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={commonStyles.label}>
              住所
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={mergeGhibliStyles(ghibliStyles.input, {
                width: '100%',
                boxSizing: 'border-box'
              })}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={commonStyles.label}>
              メモ
            </label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              rows={3}
              style={mergeGhibliStyles(ghibliStyles.input, {
                width: '100%',
                boxSizing: 'border-box',
                resize: 'vertical',
                fontFamily: 'inherit'
              })}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={commonStyles.label}>
              写真
            </label>
            
            {existingPhotos.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {existingPhotos.map((photoUrl, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={photoUrl}
                      alt=""
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #C9A87C'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(photoUrl)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '2px solid #8B7355',
                        backgroundColor: '#E8B5B5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <X size={14} color="#4A3F35" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px',
                fontSize: '14px',
                color: '#4A3F35',
                border: '2px solid #C9A87C',
                borderRadius: '8px',
                backgroundColor: '#FAF8F3',
                cursor: 'pointer'
              }}
            />
            
            {newPhotos.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {newPhotos.map((photo, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={URL.createObjectURL(photo)}
                      alt=""
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #C9A87C'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeNewPhoto(index)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '2px solid #8B7355',
                        backgroundColor: '#E8B5B5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <X size={14} color="#4A3F35" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.visited}
                onChange={(e) => setFormData({ ...formData, visited: e.target.checked })}
                style={{ 
                  width: '18px', 
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: '#C9A87C'
                }}
              />
              <span style={{ fontSize: '14px', color: '#4A3F35' }}>行った</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={mergeGhibliStyles(ghibliStyles.button, {
                flex: 1,
                padding: '12px'
              })}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={uploading}
              style={mergeGhibliStyles(ghibliStyles.buttonPink, {
                flex: 1,
                padding: '12px',
                opacity: uploading ? 0.6 : 1
              })}
            >
              {uploading ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
