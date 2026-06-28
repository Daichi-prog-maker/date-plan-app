import React, { useEffect, useState } from 'react'
import { useStore } from '../stores/useStore'
import { List, Plus, Calendar, Trash2, Edit, X, MapPin, Clock, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { ghibliStyles, commonStyles, mergeGhibliStyles } from '../stores/ghibliStyles'

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
    <div style={{ minHeight: '100vh', paddingBottom: '100px', padding: '16px' }}>
      <div style={mergeGhibliStyles(ghibliStyles.card, {
        padding: '16px',
        marginBottom: '16px',
        textAlign: 'center'
      })}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          color: '#4A3F35', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '8px',
          margin: 0
        }}>
          <List size={28} />
          デートプラン
        </h1>
      </div>

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
            placeholder="プランを検索..."
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

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setShowPastPlans(false)}
          style={mergeGhibliStyles(
            !showPastPlans ? ghibliStyles.buttonPink : ghibliStyles.button,
            { padding: '8px 16px' }
          )}
        >
          今後のプラン
        </button>
        <button
          onClick={() => setShowPastPlans(true)}
          style={mergeGhibliStyles(
            showPastPlans ? ghibliStyles.buttonPink : ghibliStyles.button,
            { padding: '8px 16px' }
          )}
        >
          過去のプラン
        </button>
      </div>

      {showFilters && (
        <div style={mergeGhibliStyles(ghibliStyles.card, {
          padding: '16px',
          marginBottom: '16px'
        })}>
          <div>
            <label style={commonStyles.label}>
              季節
            </label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              style={mergeGhibliStyles(ghibliStyles.input, {
                width: '100%',
                boxSizing: 'border-box',
                cursor: 'pointer'
              })}
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
        <div style={mergeGhibliStyles(ghibliStyles.card, {
          textAlign: 'center',
          padding: '3rem 1rem'
        })}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#4A3F35', marginBottom: '0.5rem' }}>
            {showPastPlans ? '過去のプランがありません' : 'まだプランがありません'}
          </h2>
          <p style={{ color: '#8B7355', fontSize: '0.875rem' }}>
            {showPastPlans ? '過去のプランはここに表示されます' : '「＋」ボタンからデートプランを作ってみましょう！'}
          </p>
        </div>
      )}

      {showAddModal && <PlanModal onClose={() => setShowAddModal(false)} />}
      {editingPlan && <PlanModal plan={editingPlan} onClose={() => setEditingPlan(null)} />}
    </div>
  )
}
// PlanCard Component
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
      <div style={mergeGhibliStyles(ghibliStyles.card, {
        padding: '16px',
        cursor: 'pointer'
      })}>
        <div onClick={() => setIsExpanded(!isExpanded)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '4px', color: '#4A3F35' }}>
                {plan.title}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                {(plan.start_date || plan.end_date) && (
                  <p style={{ fontSize: '14px', color: '#8B7355', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} />
                    {plan.start_date && new Date(plan.start_date).toLocaleDateString('ja-JP')}
                    {plan.start_date && plan.end_date && ' 〜 '}
                    {plan.end_date && new Date(plan.end_date).toLocaleDateString('ja-JP')}
                  </p>
                )}

                {plan.season && (
                  <span style={mergeGhibliStyles(ghibliStyles.tag, {
                    background: 'linear-gradient(to bottom, #F5E6B8 0%, #E8D89A 100%)',
                    border: '1px solid #D4C17A'
                  })}>
                    {plan.season}
                  </span>
                )}
              </div>
              {plan.notes && (
                <p style={{ fontSize: '14px', color: '#4A3F35', marginTop: '8px' }}>
                  {plan.notes}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={handleEdit}
                style={mergeGhibliStyles(ghibliStyles.button, {
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  width: '36px',
                  height: '36px',
                  background: 'linear-gradient(to bottom, #F5E6B8 0%, #E8D89A 100%)',
                  border: '2px solid #D4C17A'
                })}
              >
                <Edit size={18} />
              </button>
              <button
                onClick={onDelete}
                style={mergeGhibliStyles(ghibliStyles.button, {
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  width: '36px',
                  height: '36px',
                  background: 'linear-gradient(to bottom, #E8B5B5 0%, #D89A9A 100%)',
                  border: '2px solid #C98585'
                })}
              >
                <Trash2 size={18} />
              </button>
              <span style={{ fontSize: '20px', color: '#8B7355' }}>
                {isExpanded ? '▲' : '▼'}
              </span>
            </div>
          </div>
        </div>

        {isExpanded && plan.places && plan.places.length > 0 && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '2px solid #E8DCC8' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#8B7355', marginBottom: '8px' }}>
              訪問予定の場所 ({plan.places.length}件)
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {plan.places.map((place, index) => {
                const placePhotos = place.photos || []
                const displayPhotos = placePhotos.slice(0, 3)
                let photoStartIndex = 0
                for (let i = 0; i < index; i++) {
                  photoStartIndex += (plan.places[i].photos || []).length
                }
                
                return (
                  <div 
                    key={place.id || index} 
                    style={mergeGhibliStyles(ghibliStyles.card, {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px',
                      background: 'linear-gradient(to bottom, #FAF8F3 0%, #F5F1E8 100%)',
                      border: '2px solid #E8DCC8'
                    })}
                  >
                    {(place.start_datetime || place.end_datetime || place.time) && (
                      <div style={{ 
                        fontSize: '11px', 
                        fontWeight: 'bold', 
                        color: '#C9A87C', 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '2px', 
                        minWidth: '180px',  // ← 150pxから180pxに変更
                        flexShrink: 0
                      }}>


                        {place.start_datetime && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={10} />
                            {new Date(place.start_datetime).toLocaleString('ja-JP', { 
                              month: 'numeric', 
                              day: 'numeric', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        )}
                        {place.end_datetime && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            → {new Date(place.end_datetime).toLocaleString('ja-JP', { 
                              month: 'numeric', 
                              day: 'numeric', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        )}
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#4A3F35' }}>
                        {place.name}
                      </p>
                      {place.station && (
                        <p style={{ fontSize: '12px', color: '#8B7355', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} />
                          {place.station}
                        </p>
                      )}
                    </div>
                    {displayPhotos.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px', flexDirection: 'row', flexWrap: 'wrap', flexShrink: 0, maxWidth: '150px' }}>
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
                              cursor: 'pointer',
                              border: '2px solid #C9A87C'
                            }}
                          />
                        ))}
                      </div>
                    )}
                    <span style={mergeGhibliStyles(ghibliStyles.tag, {
                      fontSize: '12px',
                      flexShrink: 0
                    })}>
                      {place.category}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {isExpanded && (!plan.places || plan.places.length === 0) && (
          <p style={{ 
            fontSize: '14px', 
            color: '#8B7355', 
            marginTop: '8px', 
            textAlign: 'center', 
            padding: '16px', 
            backgroundColor: '#F5F1E8', 
            borderRadius: '8px',
            border: '2px solid #E8DCC8'
          }}>
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
// PlanModal Component
function PlanModal({ plan, onClose }) {
  const stores = useStore()
  const isEdit = !!plan
  const [formData, setFormData] = useState({
    title: plan?.title || '',
    date: plan?.date || '',
    start_date: plan?.start_date || '',
    end_date: plan?.end_date || '',
    season: plan?.season || '',
    notes: plan?.notes || ''
  })
  const [selectedPlaces, setSelectedPlaces] = useState(
  plan?.places?.map(p => ({
    ...p,
    start_datetime: p.start_datetime || '',
    end_datetime: p.end_datetime || ''
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
 
const planData = {
  title: formData.title,
  date: formData.start_date || null,  // 互換性のため、dateにstart_dateを入れる
  start_date: formData.start_date || null,
  end_date: formData.end_date || null,
  season: formData.season || null,
  notes: formData.notes || null
}
  
  console.log('Saving planData:', planData) // デバッグ用
  
  const planPlaces = selectedPlaces.map((place, index) => ({
    place_id: place.place_id || null,
    custom_name: place.isCustom ? place.name : null,
    time: place.time || null,
    start_datetime: place.start_datetime || null,
    end_datetime: place.end_datetime || null,
    order_index: index
  }))


  console.log('Saving planPlaces:', planPlaces) // デバッグ用

  if (isEdit) {
    await stores.updatePlan(plan.id, planData, planPlaces)
  } else {
    await stores.addPlan(planData, planPlaces)
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

  const updatePlaceDateTime = (index, field, value) => {
  setSelectedPlaces(prev =>
    prev.map((p, i) => i === index ? { ...p, [field]: value } : p)
  )
}

  const sortedSelectedPlaces = [...selectedPlaces].sort((a, b) => {
    const timeA = a.time || '23:59:59'
    const timeB = b.time || '23:59:59'
    return timeA.localeCompare(timeB)
  })

  return (
    <div 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        backgroundColor: 'rgba(74, 63, 53, 0.7)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '16px', 
        zIndex: 50 
      }} 
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        style={mergeGhibliStyles(ghibliStyles.card, {
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          paddingBottom: '100px'
        })}
      >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#4A3F35' }}>
        {isEdit ? 'プランを編集' : '新しいプランを作成'}
      </h2>
      <button 
        onClick={onClose} 
        style={mergeGhibliStyles(ghibliStyles.button, {
          padding: '4px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        })}
      >
        <X size={24} />
      </button>
    </div>

    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={commonStyles.label}>
          プラン名 <span style={{ color: '#E8B5B5' }}>*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          style={mergeGhibliStyles(ghibliStyles.input, {
            width: '100%',
            boxSizing: 'border-box'
          })}
          placeholder="例: 新宿デート"
        />
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ flex: 1 }}>
          <label style={commonStyles.label}>
            開始日
          </label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({...formData, start_date: e.target.value})}
            style={mergeGhibliStyles(ghibliStyles.input, {
              width: '100%',
              boxSizing: 'border-box',
              cursor: 'pointer',
              padding: '6px 8px',
              fontSize: '13px'
            })}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label style={commonStyles.label}>
            終了日
          </label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({...formData, end_date: e.target.value})}
            style={mergeGhibliStyles(ghibliStyles.input, {
              width: '100%',
              boxSizing: 'border-box',
              cursor: 'pointer',
              padding: '6px 8px',
              fontSize: '13px'
            })}
          />
        </div>
      </div>



          <div>
            <label style={commonStyles.label}>
              季節
            </label>
            <select
              value={formData.season}
              onChange={(e) => setFormData({...formData, season: e.target.value})}
              style={mergeGhibliStyles(ghibliStyles.input, {
                width: '100%',
                boxSizing: 'border-box',
                cursor: 'pointer'
              })}
            >
              <option value="">選択なし</option>
              <option value="春">春</option>
              <option value="夏">夏</option>
              <option value="秋">秋</option>
              <option value="冬">冬</option>
            </select>
          </div>

          <div>
            <label style={commonStyles.label}>
              メモ
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              style={mergeGhibliStyles(ghibliStyles.input, {
                width: '100%',
                boxSizing: 'border-box',
                resize: 'vertical',
                fontFamily: 'inherit'
              })}
              rows={2}
              placeholder="例: 天気が良かったら公園も"
            />
          </div>
          <div>
            <label style={mergeGhibliStyles(commonStyles.label, { marginBottom: '8px' })}>
              場所を選択
            </label>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'stretch' }}>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                style={mergeGhibliStyles(
                  showFilters ? ghibliStyles.buttonPink : ghibliStyles.button,
                  {
                    width: '40px',
                    minWidth: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }
                )}
              >
                <Filter size={16} />
              </button>
              <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
                <Search style={{ position: 'absolute', left: '12px', top: '12px', color: '#8B7355', pointerEvents: 'none' }} size={16} />
                <input
                  type="text"
                  placeholder="場所を検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={mergeGhibliStyles(ghibliStyles.input, {
                    width: '100%',
                    height: '40px',
                    paddingLeft: '36px',
                    boxSizing: 'border-box',
                    fontSize: '14px'
                  })}
                />
              </div>
            </div>

            {showFilters && (
              <div style={mergeGhibliStyles(ghibliStyles.card, {
                padding: '12px',
                marginBottom: '12px',
                background: 'linear-gradient(to bottom, #FAF8F3 0%, #F5F1E8 100%)',
                border: '2px solid #E8DCC8'
              })}>
                <label style={{ ...commonStyles.label, fontSize: '12px', marginBottom: '4px' }}>
                  カテゴリー
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={mergeGhibliStyles(ghibliStyles.input, {
                    width: '100%',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '8px 12px'
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
            )}

            <div style={{ 
              maxHeight: '200px', 
              overflowY: 'auto', 
              border: '2px solid #C9A87C', 
              borderRadius: '8px', 
              padding: '8px',
              backgroundColor: '#FAF8F3',
              marginBottom: '12px'
            }}>
              {filteredPlaces.map(place => (
                <div
                  key={place.id}
                  onClick={() => togglePlace(place)}
                  style={{
                    padding: '8px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    marginBottom: '4px',
                    backgroundColor: selectedPlaces.find(p => p.place_id === place.id) ? '#E8DCC8' : '#F5F1E8',
                    border: selectedPlaces.find(p => p.place_id === place.id) ? '2px solid #C9A87C' : '2px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#4A3F35' }}>
                    {place.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8B7355', marginTop: '2px' }}>
                    {place.station && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={10} />
                        {place.station}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {filteredPlaces.length === 0 && (
                <div style={{ textAlign: 'center', padding: '16px', color: '#8B7355', fontSize: '14px' }}>
                  場所が見つかりません
                </div>
              )}
            </div>

            <div style={{ marginBottom: '12px' }}>
              {!showCustomPlaceInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomPlaceInput(true)}
                  style={mergeGhibliStyles(ghibliStyles.button, {
                    width: '100%',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  })}
                >
                  <Plus size={16} />
                  リストにない場所を追加
                </button>
              ) : (
                <div style={mergeGhibliStyles(ghibliStyles.card, {
                  padding: '12px',
                  background: 'linear-gradient(to bottom, #FAF8F3 0%, #F5F1E8 100%)',
                  border: '2px solid #E8DCC8'
                })}>
                  <label style={{ ...commonStyles.label, fontSize: '12px', marginBottom: '8px' }}>
                    Google検索
                  </label>
                  <div style={{ position: 'relative', marginBottom: '12px' }}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="場所を検索..."
                      style={mergeGhibliStyles(ghibliStyles.input, {
                        width: '100%',
                        boxSizing: 'border-box',
                        fontSize: '14px'
                      })}
                    />
                    {loadingPredictions && (
                      <div style={{ 
                        position: 'absolute', 
                        right: '12px', 
                        top: '12px',
                        color: '#8B7355',
                        fontSize: '12px'
                      }}>
                        検索中...
                      </div>
                    )}
                    {showPredictions && predictions.length > 0 && (
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
                            onClick={() => handleSelectPrediction(prediction)}
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

                  <label style={{ ...commonStyles.label, fontSize: '12px', marginBottom: '8px' }}>
                    または手動入力
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={customPlaceName}
                      onChange={(e) => setCustomPlaceName(e.target.value)}
                      placeholder="例: 休憩、移動"
                      style={mergeGhibliStyles(ghibliStyles.input, {
                        flex: 1,
                        boxSizing: 'border-box',
                        fontSize: '14px'
                      })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addCustomPlace()
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addCustomPlace}
                      style={mergeGhibliStyles(ghibliStyles.buttonPink, {
                        padding: '8px 16px',
                        fontSize: '14px'
                      })}
                    >
                      追加
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomPlaceInput(false)
                        setCustomPlaceName('')
                        setSearchQuery('')
                        setShowPredictions(false)
                      }}
                      style={mergeGhibliStyles(ghibliStyles.button, {
                        padding: '8px 16px',
                        fontSize: '14px'
                      })}
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              )}
            </div>

            {sortedSelectedPlaces.length > 0 && (
              <div>
                <label style={{ ...commonStyles.label, marginBottom: '8px' }}>
                  選択した場所 ({sortedSelectedPlaces.length}件)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sortedSelectedPlaces.map((place, index) => (
                    <div 
                      key={place.id || index} 
                      style={mergeGhibliStyles(ghibliStyles.card, {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        padding: '12px',
                        background: 'linear-gradient(to bottom, #FAF8F3 0%, #F5F1E8 100%)',
                        border: '2px solid #C9A87C'
                      })}
                    >
                      {/* 1行目: 日時入力 */}
                      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                        <input
                          type="datetime-local"
                          value={place.start_datetime}
                          onChange={(e) => updatePlaceDateTime(selectedPlaces.indexOf(place), 'start_datetime', e.target.value)}
                          style={mergeGhibliStyles(ghibliStyles.input, {
                            flex: 1,
                            padding: '6px 8px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          })}
                          placeholder="開始"
                        />
                        <input
                          type="datetime-local"
                          value={place.end_datetime}
                          onChange={(e) => updatePlaceDateTime(selectedPlaces.indexOf(place), 'end_datetime', e.target.value)}
                          style={mergeGhibliStyles(ghibliStyles.input, {
                            flex: 1,
                            padding: '6px 8px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          })}
                          placeholder="終了"
                        />
                      </div>

                      {/* 2行目: 場所名・カテゴリ・削除ボタン */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#4A3F35' }}>
                            {place.name}
                          </div>
                          {place.station && (
                            <div style={{ fontSize: '12px', color: '#8B7355', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={10} />
                              {place.station}
                            </div>
                          )}
                        </div>
                        <span style={mergeGhibliStyles(ghibliStyles.tag, {
                          fontSize: '11px',
                          padding: '4px 8px',
                          flexShrink: 0
                        })}>
                          {place.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => removePlace(selectedPlaces.indexOf(place))}
                          style={mergeGhibliStyles(ghibliStyles.button, {
                            padding: '6px',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            background: 'linear-gradient(to bottom, #E8B5B5 0%, #D89A9A 100%)',
                            border: '2px solid #C98585'
                          })}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
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
              style={mergeGhibliStyles(ghibliStyles.buttonPink, {
                flex: 1,
                padding: '12px'
              })}
            >
              {isEdit ? '更新' : '作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
