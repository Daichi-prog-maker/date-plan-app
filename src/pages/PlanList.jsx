import React, { useEffect, useState } from 'react'
import { useStore } from '../stores/useStore'
import { List, Plus, Calendar, Trash2, Edit, X, MapPin, GripVertical } from 'lucide-react'

export default function PlanList() {
  const stores = useStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [expandedPlanId, setExpandedPlanId] = useState(null)

  useEffect(() => {
    stores.fetchPlaces()
    stores.fetchPlans()
  }, [])

  const handleDeletePlan = async (planId) => {
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
        <button
          onClick={() => setShowAddModal(true)}
          style={{ width: '100%', backgroundColor: '#ec4899', color: 'white', padding: '0.75rem', borderRadius: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}
        >
          <Plus size={20} />
          新しいプランを作成
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {stores.plans.map(plan => (
            <div
              key={plan.id}
              style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.25rem' }}>{plan.title}</h3>
                  {plan.date && (
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} />
                      {new Date(plan.date).toLocaleDateString('ja-JP')}
                    </p>
                  )}
                  {plan.notes && (
                    <p style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.5rem' }}>{plan.notes}</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setEditingPlan(plan)}
                    style={{ padding: '0.5rem', borderRadius: '9999px', border: 'none', backgroundColor: '#fef3c7', color: '#f59e0b', cursor: 'pointer' }}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    style={{ padding: '0.5rem', borderRadius: '9999px', border: 'none', backgroundColor: '#fee2e2', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {plan.places && plan.places.length > 0 && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#6b7280', marginBottom: '0.5rem' }}>
                    訪問予定の場所 ({plan.places.length}件)
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {plan.places.map((place, index) => (
                      <div key={place.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: '#fef3f9', borderRadius: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#ec4899' }}>{index + 1}.</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{place.name}</p>
                          {place.station && (
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <MapPin size={12} />
                              {place.station}
                            </p>
                          )}
                        </div>
                        <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', backgroundColor: '#fce7f3', color: '#db2777', borderRadius: '9999px' }}>
                          {place.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!plan.places || plan.places.length === 0) && (
                <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem', textAlign: 'center', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                  まだ場所が追加されていません
                </p>
              )}
            </div>
          ))}
        </div>

        {stores.plans.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>まだプランがありません</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              「新しいプランを作成」から<br />
              デートプランを作ってみましょう！
            </p>
          </div>
        )}
      </div>

      {showAddModal && <AddPlanModal onClose={() => setShowAddModal(false)} />}
      {editingPlan && (
        <EditPlanModal 
          plan={editingPlan} 
          onClose={() => setEditingPlan(null)} 
        />
      )}
    </div>
  )
}

function AddPlanModal({ onClose }) {
  const stores = useStore()
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    notes: ''
  })
  const [selectedPlaces, setSelectedPlaces] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('プラン名を入力してください')
      return
    }
    
    const placeIds = selectedPlaces.map(p => p.id)
    await stores.addPlan(formData, placeIds)
    onClose()
  }

  const togglePlace = (place) => {
    setSelectedPlaces(prev => 
      prev.find(p => p.id === place.id)
        ? prev.filter(p => p.id !== place.id)
        : [...prev, place]
    )
  }

  const movePlace = (index, direction) => {
    const newPlaces = [...selectedPlaces]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newPlaces.length) return
    
    [newPlaces[index], newPlaces[targetIndex]] = [newPlaces[targetIndex], newPlaces[index]]
    setSelectedPlaces(newPlaces)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', maxWidth: '40rem', width: '100%', maxHeight: '90vh', overflowY: 'auto', paddingBottom: '100px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>新しいプランを作成</h2>
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
              訪問する場所を選択 ({selectedPlaces.length}件)
            </label>
            
            {selectedPlaces.length > 0 && (
              <div style={{ marginBottom: '0.75rem', padding: '0.75rem', backgroundColor: '#fef3f9', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#ec4899', marginBottom: '0.5rem' }}>選択した場所（訪問順）</p>
                {selectedPlaces.map((place, index) => (
                  <div key={place.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem', backgroundColor: 'white', borderRadius: '0.25rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#ec4899' }}>{index + 1}.</span>
                    <p style={{ flex: 1, fontSize: '0.875rem' }}>{place.name}</p>
                    <button
                      type="button"
                      onClick={() => movePlace(index, 'up')}
                      disabled={index === 0}
                      style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => movePlace(index, 'down')}
                      disabled={index === selectedPlaces.length - 1}
                      style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: index === selectedPlaces.length - 1 ? 'not-allowed' : 'pointer', opacity: index === selectedPlaces.length - 1 ? 0.3 : 1 }}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePlace(place)}
                      style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ maxHeight: '15rem', overflowY: 'auto', border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '0.5rem' }}>
              {stores.places.map(place => (
                <div
                  key={place.id}
                  onClick={() => togglePlace(place)}
                  style={{ padding: '0.5rem', marginBottom: '0.25rem', backgroundColor: selectedPlaces.find(p => p.id === place.id) ? '#fce7f3' : 'white', borderRadius: '0.25rem', cursor: 'pointer', border: selectedPlaces.find(p => p.id === place.id) ? '1px solid #ec4899' : '1px solid transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={!!selectedPlaces.find(p => p.id === place.id)}
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

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', paddingBottom: '20px' }}>
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
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditPlanModal({ plan, onClose }) {
  const stores = useStore()
  const [formData, setFormData] = useState({
    title: plan.title || '',
    date: plan.date || '',
    notes: plan.notes || ''
  })
  const [selectedPlaces, setSelectedPlaces] = useState(plan.places || [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('プラン名を入力してください')
      return
    }
    
    const placeIds = selectedPlaces.map(p => p.id)
    await stores.updatePlan(plan.id, formData, placeIds)
    onClose()
  }

  const togglePlace = (place) => {
    setSelectedPlaces(prev => 
      prev.find(p => p.id === place.id)
        ? prev.filter(p => p.id !== place.id)
        : [...prev, place]
    )
  }

  const movePlace = (index, direction) => {
    const newPlaces = [...selectedPlaces]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newPlaces.length) return
    
    [newPlaces[index], newPlaces[targetIndex]] = [newPlaces[targetIndex], newPlaces[index]]
    setSelectedPlaces(newPlaces)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', maxWidth: '40rem', width: '100%', maxHeight: '90vh', overflowY: 'auto', paddingBottom: '100px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>プランを編集</h2>
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
              訪問する場所を選択 ({selectedPlaces.length}件)
            </label>
            
            {selectedPlaces.length > 0 && (
              <div style={{ marginBottom: '0.75rem', padding: '0.75rem', backgroundColor: '#fef3f9', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#ec4899', marginBottom: '0.5rem' }}>選択した場所（訪問順）</p>
                {selectedPlaces.map((place, index) => (
                  <div key={place.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem', backgroundColor: 'white', borderRadius: '0.25rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#ec4899' }}>{index + 1}.</span>
                    <p style={{ flex: 1, fontSize: '0.875rem' }}>{place.name}</p>
                    <button
                      type="button"
                      onClick={() => movePlace(index, 'up')}
                      disabled={index === 0}
                      style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => movePlace(index, 'down')}
                      disabled={index === selectedPlaces.length - 1}
                      style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: index === selectedPlaces.length - 1 ? 'not-allowed' : 'pointer', opacity: index === selectedPlaces.length - 1 ? 0.3 : 1 }}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePlace(place)}
                      style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ maxHeight: '15rem', overflowY: 'auto', border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '0.5rem' }}>
              {stores.places.map(place => (
                <div
                  key={place.id}
                  onClick={() => togglePlace(place)}
                  style={{ padding: '0.5rem', marginBottom: '0.25rem', backgroundColor: selectedPlaces.find(p => p.id === place.id) ? '#fce7f3' : 'white', borderRadius: '0.25rem', cursor: 'pointer', border: selectedPlaces.find(p => p.id === place.id) ? '1px solid #ec4899' : '1px solid transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={!!selectedPlaces.find(p => p.id === place.id)}
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

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', paddingBottom: '20px' }}>
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
