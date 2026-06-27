import React, { useEffect, useState } from 'react'
import { useStore } from '../stores/useStore'
import { List, Plus, Calendar, Trash2, Edit, X, MapPin, Clock, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'

export default function PlanList() {
  const stores = useStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [showPastPlans, setShowPastPlans] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSeason, setSelectedSeason] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    stores.fetchPlaces()
    stores.fetchPlans()
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const filteredPlans = stores.plans.filter(plan => {
    const planDate = plan.date ? new Date(plan.date) : null
    const isPast = planDate && planDate < today
    const matchesTimeFilter = showPastPlans ? isPast : !isPast
    const matchesSearch = 
      plan.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeason = selectedSeason === 'all' || plan.season === selectedSeason
    return matchesTimeFilter && matchesSearch && matchesSeason
  })

  const sortedPlans = [...filteredPlans].sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return showPastPlans ? dateB - dateA : dateA - dateB
  })

  const handleDeletePlan = async (planId, e) => {
    e.stopPropagation()
    if (window.confirm('このプランを削除しますか？')) {
      await stores.deletePlan(planId)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fce7f3', paddingBottom: '100px' }}>
      <div style={{ backgroundColor: 'white', padding: '1rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ec4899', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <List size={28} />
          デートプラン
        </h1>
      </div>

      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '1rem' }}>
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
              placeholder="プランを検索..."
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

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            onClick={() => setShowPastPlans(false)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: !showPastPlans ? 'none' : '1px solid #ec4899',
              backgroundColor: !showPastPlans ? '#ec4899' : 'white',
              color: !showPastPlans ? 'white' : '#ec4899',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            今後のプラン
          </button>
          <button
            onClick={() => setShowPastPlans(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: showPastPlans ? 'none' : '1px solid #ec4899',
              backgroundColor: showPastPlans ? '#ec4899' : 'white',
              color: showPastPlans ? 'white' : '#ec4899',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            過去のプラン
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
              </select>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sortedPlans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={() => setEditingPlan(plan)}
              onDelete={(e) => handleDeletePlan(plan.id, e)}
            />
          ))}
        </div>

        {sortedPlans.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
              {showPastPlans ? '過去のプランがありません' : 'まだプランがありません'}
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              {showPastPlans ? '過去のプランはここに表示されます' : '「＋」ボタンからデートプランを作ってみましょう！'}
            </p>
          </div>
        )}
      </div>

      {showAddModal && <PlanModal onClose={() => setShowAddModal(false)} />}
      {editingPlan && <PlanModal plan={editingPlan} onClose={() => setEditingPlan(null)} />}
    </div>
  )
}

function PlanCard({ plan, onEdit, onDelete }) {
  const [showPhotoViewer, setShowPhotoViewer] = useState(false)
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0)
  const [allPhotos, setAllPhotos] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const photos = []
    if (plan.places) {
      plan.places.forEach(place => {
        if (place.photos && place.photos.length > 0) {
          photos.push(...place.photos)
        }
      })
    }
    setAllPhotos(photos)
  }, [plan.places])

  const openPhotoViewer = (e, startIndex) => {
    e.stopPropagation()
    setPhotoViewerIndex(startIndex)
    setShowPhotoViewer(true)
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    onEdit()
  }

  return (
    <>
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.25rem' }}>{plan.title}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '0.25rem' }}>
                {plan.date && (
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} />
                    {new Date(plan.date).toLocaleDateString('ja-JP')}
                  </p>
                )}
                {plan.season && (
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: '#fef3c7',
                    color: '#f59e0b',
                    fontSize: '12px'
                  }}>
                    {plan.season}
                  </span>
                )}
              </div>
              {plan.notes && (
                <p style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.5rem' }}>{plan.notes}</p>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={handleEdit}
                style={{ padding: '0.5rem', borderRadius: '9999px', border: 'none', backgroundColor: '#fef3c7', color: '#f59e0b', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Edit size={18} />
              </button>
              <button
                onClick={onDelete}
                style={{ padding: '0.5rem', borderRadius: '9999px', border: 'none', backgroundColor: '#fee2e2', color: '#ef4444', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Trash2 size={18} />
              </button>
              <span style={{ fontSize: '1.25rem', color: '#6b7280' }}>
                {isExpanded ? '▲' : '▼'}
              </span>
            </div>
          </div>
        </div>

        {isExpanded && plan.places && plan.places.length > 0 && (
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#6b7280', marginBottom: '0.5rem' }}>
              訪問予定の場所 ({plan.places.length}件)
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {plan.places.map((place, index) => {
                const placePhotos = place.photos || []
                const displayPhotos = placePhotos.slice(0, 3)
                let photoStartIndex = 0
                for (let i = 0; i < index; i++) {
                  photoStartIndex += (plan.places[i].photos || []).length
                }
                
                return (
                  <div key={place.id || index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: '#fef3f9', borderRadius: '0.5rem' }}>
                    {place.time && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#ec4899', display: 'flex', alignItems: 'center', gap: '0.25rem', minWidth: '60px' }}>
                        <Clock size={12} />
                        {place.time.substring(0, 5)}
                      </span>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{place.name}</p>
                      {place.station && (
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={12} />
                          {place.station}
                        </p>
                      )}
                    </div>
                    {displayPhotos.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px', flexDirection: 'column', flexShrink: 0 }}>
                        {displayPhotos.map((photoUrl, photoIdx) => (
                          <img
                            key={photoIdx}
                            src={photoUrl}
                            alt=""
                            onClick={(e) => openPhotoViewer(e, photoStartIndex + photoIdx)}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '6px',
                              objectFit: 'cover',
                              cursor: 'pointer'
                            }}
                          />
                        ))}
                      </div>
                    )}
                    <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', backgroundColor: '#fce7f3', color: '#db2777', borderRadius: '9999px', flexShrink: 0 }}>
                      {place.category}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {isExpanded && (!plan.places || plan.places.length === 0) && (
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem', textAlign: 'center', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
            まだ場所が追加されていません
          </p>
        )}
      </div>

      {showPhotoViewer && allPhotos.length > 0 && (
        <PhotoViewer
          photos={allPhotos}
          initialIndex={photoViewerIndex}
          onClose={() => setShowPhotoViewer(false)}
        />
      )}
    </>
  )
}

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
        backgroundColor: 'rgba(0,0,0,0.9)',
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
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2001
        }}
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
            style={{
              position: 'absolute',
              left: '16px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2001
            }}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            style={{
              position: 'absolute',
              right: '16px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2001
            }}
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
          objectFit: 'contain'
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
            color: 'white',
            fontSize: '14px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '4px 12px',
            borderRadius: '12px'
          }}
        >
          {currentIndex + 1} / {photos.length}
        </div>
      )}
    </div>
  )
}

function PlanModal({ plan, onClose }) {
  const stores = useStore()
  const isEdit = !!plan
  const [formData, setFormData] = useState({
    title: plan?.title || '',
    date: plan?.date || '',
    season: plan?.season || '',
    notes: plan?.notes || ''
  })
  const [selectedPlaces, setSelectedPlaces] = useState(
    plan?.places?.map(p => ({
      ...p,
      time: p.time || ''
    })) || []
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showCustomPlaceInput, setShowCustomPlaceInput] = useState(false)
  const [customPlaceName, setCustomPlaceName] = useState('')
  
  // Google検索用の状態
  const [searchQuery, setSearchQuery] = useState('')
  const [predictions, setPredictions] = useState([])
  const [showPredictions, setShowPredictions] = useState(false)
  const [loadingPredictions, setLoadingPredictions] = useState(false)

  // Google Maps APIをロード
  const loadGoogleMapsAPI = () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps && window.google.maps.places) {
        resolve()
        return
      }
      const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY || process.env.REACT_APP_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        reject(new Error('Google Places API key not found'))
        return
      }
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=ja&region=JP`
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Google Maps API'))
      document.head.appendChild(script)
    })
  }

  // 検索クエリが変更されたら予測候補を取得
  useEffect(() => {
    const fetchPredictions = async () => {
      if (searchQuery.length < 3) {
        setPredictions([])
        setShowPredictions(false)
        return
      }
      setLoadingPredictions(true)
      try {
        if (!window.google || !window.google.maps || !window.google.maps.places) {
          await loadGoogleMapsAPI()
        }
        const service = new window.google.maps.places.AutocompleteService()
        service.getPlacePredictions(
          { input: searchQuery, componentRestrictions: { country: 'jp' }, language: 'ja' },
          (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
              setPredictions(results)
              setShowPredictions(true)
            } else {
              setPredictions([])
              setShowPredictions(false)
            }
            setLoadingPredictions(false)
          }
        )
      } catch (error) {
        console.error('Error fetching predictions:', error)
        setLoadingPredictions(false)
      }
    }
    const timeoutId = setTimeout(fetchPredictions, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // 予測候補を選択してカスタム場所として追加
  const handleSelectPrediction = async (prediction) => {
    setShowPredictions(false)
    setSearchQuery('')
    setLoadingPredictions(true)
    try {
      const detailsService = new window.google.maps.places.PlacesService(document.createElement('div'))
      detailsService.getDetails(
        { placeId: prediction.place_id, fields: ['name', 'formatted_address', 'geometry'], language: 'ja' },
        async (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSelectedPlaces(prev => [...prev, {
              id: `custom-${Date.now()}`,
              place_id: null,
              name: place.name,
              category: 'カスタム',
              station: '',
              photos: [],
              time: '',
              isCustom: true
            }])
            setShowCustomPlaceInput(false)
          } else {
            alert('場所の詳細情報を取得できませんでした')
          }
          setLoadingPredictions(false)
        }
      )
    } catch (error) {
      console.error('Error getting place details:', error)
      alert('エラーが発生しました')
      setLoadingPredictions(false)
    }
  }

  const filteredPlaces = stores.places.filter(place => {
    const matchesSearch = 
      place.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.station?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('プラン名を入力してください')
      return
    }
    
    const planPlaces = selectedPlaces.map((place, index) => ({
      place_id: place.place_id || null,
      custom_name: place.isCustom ? place.name : null,
      time: place.time || null,
      order_index: index
    }))

    if (isEdit) {
      await stores.updatePlan(plan.id, formData, planPlaces)
    } else {
      await stores.addPlan(formData, planPlaces)
    }
    onClose()
  }

  const togglePlace = (place) => {
    setSelectedPlaces(prev => {
      const existing = prev.find(p => p.place_id === place.id)
      if (existing) {
        return prev.filter(p => p.place_id !== place.id)
      } else {
        return [...prev, {
          id: place.id,
          place_id: place.id,
          name: place.name,
          category: place.category,
          station: place.station,
          photos: place.photos || [],
          time: '',
          isCustom: false
        }]
      }
    })
  }

  const addCustomPlace = () => {
    if (!customPlaceName.trim()) {
      alert('場所名を入力してください')
      return
    }
    setSelectedPlaces(prev => [...prev, {
      id: `custom-${Date.now()}`,
      place_id: null,
      name: customPlaceName,
      category: 'カスタム',
      station: '',
      photos: [],
      time: '',
      isCustom: true
    }])
    setCustomPlaceName('')
    setShowCustomPlaceInput(false)
  }

  const removePlace = (index) => {
    setSelectedPlaces(prev => prev.filter((_, i) => i !== index))
  }

  const updatePlaceTime = (index, time) => {
    setSelectedPlaces(prev =>
      prev.map((p, i) => i === index ? { ...p, time } : p)
    )
  }

  const sortedSelectedPlaces = [...selectedPlaces].sort((a, b) => {
    const timeA = a.time || '23:59:59'
    const timeB = b.time || '23:59:59'
    return timeA.localeCompare(timeB)
  })

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', maxWidth: '40rem', width: '100%', maxHeight: '90vh', overflowY: 'auto', paddingBottom: '100px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{isEdit ? 'プランを編集' : '新しいプランを作成'}</h2>
          <button onClick={onClose} style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>プラン名 *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
              placeholder="例: 新宿デート"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>日付</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>季節</label>
            <select
              value={formData.season}
              onChange={(e) => setFormData({...formData, season: e.target.value})}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
            >
              <option value="">選択なし</option>
              <option value="春">春</option>
              <option value="夏">夏</option>
              <option value="秋">秋</option>
              <option value="冬">冬</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>メモ</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
              rows="2"
              placeholder="例: 天気が良かったら公園も"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              場所を選択
            </label>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'stretch' }}>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  width: '40px',
                  minWidth: '40px',
                  height: '40px',
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
                <Filter size={16} />
              </button>
              <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
                <Search style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af', pointerEvents: 'none' }} size={16} />
                <input
                  type="text"
                  placeholder="場所を検索..."
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '8px 8px 8px 36px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {showFilters && (
                    <div style={{ 
                backgroundColor: '#f9fafb', 
                borderRadius: '8px', 
                padding: '12px', 
                marginBottom: '12px'
              }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                  カテゴリー
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
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
            )}

            <button
              type="button"
              onClick={() => setShowCustomPlaceInput(!showCustomPlaceInput)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '12px',
                border: '1px dashed #ec4899',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#ec4899',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Plus size={16} />
              リストにない場所を追加
            </button>

            {showCustomPlaceInput && (
              <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#fef3f9', borderRadius: '8px', position: 'relative' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: '#ec4899' }}>
                  🔍 場所を検索（3文字以上で候補表示）
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 3 && predictions.length > 0 && setShowPredictions(true)}
                  placeholder="例: 新宿 スターバックス、または手動入力（休憩など）"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #fce7f3',
                    borderRadius: '8px',
                    fontSize: '13px',
                    marginBottom: '8px',
                    boxSizing: 'border-box'
                  }}
                />

                {/* 予測候補ドロップダウン */}
                {showPredictions && predictions.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% - 50px)',
                    left: '12px',
                    right: '12px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1001
                  }}>
                    {predictions.map((prediction, index) => (
                      <div
                        key={prediction.place_id}
                        onClick={() => handleSelectPrediction(prediction)}
                        style={{
                          padding: '10px',
                          cursor: 'pointer',
                          borderBottom: index < predictions.length - 1 ? '1px solid #f3f4f6' : 'none',
                          fontSize: '13px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef3f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        <div style={{ fontWeight: '500', color: '#111827', marginBottom: '2px' }}>
                          {prediction.structured_formatting.main_text}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                          {prediction.structured_formatting.secondary_text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {loadingPredictions && (
                  <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '8px' }}>
                    読み込み中...
                  </p>
                )}

                <div style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#6b7280' }}>
                    または手動入力
                  </label>
                  <input
                    type="text"
                    placeholder="場所名を入力（例: 休憩、移動）"
                    value={customPlaceName}
                    onChange={(e) => setCustomPlaceName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomPlaceInput(false)
                      setCustomPlaceName('')
                      setSearchQuery('')
                      setPredictions([])
                      setShowPredictions(false)
                    }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    キャンセル
                  </button>
                  <button
                    type="button"
                    onClick={addCustomPlace}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: '#ec4899',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    手動で追加
                  </button>
                </div>
              </div>
            )}

            {/* 予測候補が表示されている場合、背景クリックで閉じる */}
            {showPredictions && (
              <div 
                onClick={() => setShowPredictions(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1000
                }}
              />
            )}

            <div style={{ maxHeight: '15rem', overflowY: 'auto', border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '0.5rem' }}>
              {filteredPlaces.map(place => (
                <div
                  key={place.id}
                  onClick={() => togglePlace(place)}
                  style={{ 
                    padding: '0.5rem', 
                    marginBottom: '0.25rem', 
                    backgroundColor: selectedPlaces.find(p => p.place_id === place.id) ? '#fce7f3' : 'white', 
                    borderRadius: '0.25rem', 
                    cursor: 'pointer', 
                    border: selectedPlaces.find(p => p.place_id === place.id) ? '1px solid #ec4899' : '1px solid transparent' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={!!selectedPlaces.find(p => p.place_id === place.id)}
                      onChange={() => {}}
                      style={{ cursor: 'pointer' }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{place.name}</p>
                      <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.125rem' }}>
                        <span style={{ fontSize: '0.75rem', padding: '0.0625rem 0.25rem', backgroundColor: '#fce7f3', color: '#db2777', borderRadius: '0.25rem' }}>
                          {place.category}
                        </span>
                        {place.station && (
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {place.station}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {sortedSelectedPlaces.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                選択した場所 ({sortedSelectedPlaces.length}件)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.75rem', backgroundColor: '#fef3f9', borderRadius: '0.5rem' }}>
                {sortedSelectedPlaces.map((place, index) => {
                  const displayPhotos = (place.photos || []).slice(0, 3)
                  return (
                    <div key={place.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.25rem' }}>
                      <input
                        type="time"
                        value={place.time || ''}
                        onChange={(e) => updatePlaceTime(selectedPlaces.findIndex(p => p.id === place.id), e.target.value)}
                        style={{ padding: '0.25rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', fontSize: '0.75rem', width: '80px' }}
                      />
                      <p style={{ flex: 1, fontSize: '0.875rem', minWidth: 0 }}>{place.name}</p>
                      {displayPhotos.length > 0 && (
                        <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                          {displayPhotos.map((photoUrl, photoIdx) => (
                            <img
                              key={photoIdx}
                              src={photoUrl}
                              alt=""
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '4px',
                                objectFit: 'cover'
                              }}
                            />
                          ))}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removePlace(selectedPlaces.findIndex(p => p.id === place.id))}
                        style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer', flexShrink: 0 }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
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
              {isEdit ? '更新' : '作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

              
