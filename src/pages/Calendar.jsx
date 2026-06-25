import React, { useEffect, useState } from 'react'
import { useStore } from '../stores/useStore'
import { Calendar as CalendarIcon, Sun, Cloud, Leaf, Snowflake } from 'lucide-react'

const SEASONS = [
  { name: '春', icon: Leaf, color: '#f9a8d4', emoji: '🌸' },
  { name: '夏', icon: Sun, color: '#fbbf24', emoji: '☀️' },
  { name: '秋', icon: Leaf, color: '#fb923c', emoji: '🍁' },
  { name: '冬', icon: Snowflake, color: '#60a5fa', emoji: '⛄' },
  { name: '通年', icon: Cloud, color: '#a78bfa', emoji: '📅' }
]

export default function Calendar() {
  const stores = useStore()
  const [selectedSeason, setSelectedSeason] = useState('春')

  useEffect(() => {
    stores.fetchPlaces()
  }, [])

  const currentMonth = new Date().getMonth() + 1
  const currentSeason = currentMonth >= 3 && currentMonth <= 5 ? '春' :
                       currentMonth >= 6 && currentMonth <= 8 ? '夏' :
                       currentMonth >= 9 && currentMonth <= 11 ? '秋' : '冬'

  const filteredPlaces = stores.places.filter(place => 
    place.season === selectedSeason || place.season === '通年'
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fce7f3', paddingBottom: '5rem' }}>
      <div style={{ backgroundColor: 'white', padding: '1rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ec4899', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <CalendarIcon size={28} />
          季節カレンダー
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem', padding: '0.5rem', backgroundColor: '#fef3f9', borderRadius: '0.75rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>現在の季節:</span>
          <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#ec4899' }}>
            {SEASONS.find(s => s.name === currentSeason)?.emoji} {currentSeason}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
          {SEASONS.map(season => (
            <button
              key={season.name}
              onClick={() => setSelectedSeason(season.name)}
              style={{ 
                padding: '0.75rem 0.5rem', 
                borderRadius: '0.75rem', 
                border: 'none', 
                backgroundColor: selectedSeason === season.name ? season.color : 'white',
                color: selectedSeason === season.name ? 'white' : '#6b7280',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{season.emoji}</span>
              {season.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '1rem' }}>
        <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 'bold', color: '#374151' }}>
            {SEASONS.find(s => s.name === selectedSeason)?.emoji} {selectedSeason}の場所
          </span>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            {filteredPlaces.length}件
          </span>
        </div>

        {filteredPlaces.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
            <p>{selectedSeason}の場所がまだ登録されていません</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>ホームから場所を追加してみましょう！</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredPlaces.map(place => (
            <div key={place.id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem' }}>{place.name}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', backgroundColor: '#fce7f3', color: '#db2777', borderRadius: '9999px' }}>
                  {place.category}
                </span>
                {place.season && (
                  <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', backgroundColor: SEASONS.find(s => s.name === place.season)?.color || '#e5e7eb', color: 'white', borderRadius: '9999px' }}>
                    {SEASONS.find(s => s.name === place.season)?.emoji} {place.season}
                  </span>
                )}
                {place.visited && (
                  <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', backgroundColor: '#d1fae5', color: '#059669', borderRadius: '9999px' }}>
                    ✓ 訪問済み
                  </span>
                )}
              </div>
              {place.station && (
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>📍 {place.station}</p>
              )}
              {place.address && (
                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{place.address}</p>
              )}
              {place.memo && (
                <p style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#fef3f9', borderRadius: '0.5rem' }}>{place.memo}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
