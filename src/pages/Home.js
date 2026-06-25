import React, { useEffect, useState } from 'react'
import { useStore } from '../stores/useStore'
import { Plus, MapPin, Check, Trash2, Search } from 'lucide-react'

export default function Home() {
  const stores = useStore()
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    stores.fetchPlaces()
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fce7f3', paddingBottom: '5rem' }}>
      <div style={{ backgroundColor: 'white', padding: '1rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ec4899', textAlign: 'center', marginBottom: '1rem' }}>
          行きたいんじゃ！
        </h1>
      </div>

      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '1rem' }}>
        <button
          onClick={() => setShowAddModal(true)}
          style={{ width: '100%', backgroundColor: '#ec4899', color: 'white', padding: '0.75rem', borderRadius: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
        >
          新しい場所を追加
        </button>

        <div style={{ marginTop: '1rem' }}>
          {stores.places.map(place => (
            <div key={place.id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1rem', marginBottom: '0.75rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{place.name}</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{place.category}</p>
              {place.station && <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{place.station}</p>}
              {place.memo && <p style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.5rem' }}>{place.memo}</p>}
            </div>
          ))}
        </div>

        {stores.places.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
            <p>まだ場所が登録されていません</p>
          </div>
        )}
      </div>

      {showAddModal && <AddPlaceModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}

function AddPlaceModal({ onClose }) {
  const stores = useStore()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('ご飯')
  const [station, setStation] = useState('')
  const [memo, setMemo] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('場所の名前を入力してください')
      return
    }
    
    await stores.addPlace({ name, category, station, memo, season: '通年' })
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}>
      <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', maxWidth: '28rem', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>新しい場所を追加</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>場所の名前 *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              placeholder="例: 新宿カフェ"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>カテゴリ *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            >
              <option value="ご飯">ご飯</option>
              <option value="カフェ">カフェ</option>
              <option value="おでかけ(外)">おでかけ(外)</option>
              <option value="おでかけ(室内)">おでかけ(室内)</option>
              <option value="旅行">旅行</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>最寄り駅</label>
            <input
              type="text"
              value={station}
              onChange={(e) => setStation(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              placeholder="例: 新宿駅"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>メモ</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              rows="3"
              placeholder="例: パンケーキが美味しそう"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
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
