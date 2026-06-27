import React, { useState } from 'react'
import { useStore } from '../stores/useStore'
import { Sparkles, MapPin, Search, X } from 'lucide-react'
import { ghibliStyles, commonStyles, mergeGhibliStyles } from '../stores/ghibliStyles'

export default function AiSuggestions() {
  const { places } = useStore()
  const [searchLocation, setSearchLocation] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [suggestions, setSuggestions] = useState([])
  const [searching, setSearching] = useState(false)

  const categories = ['all', 'ご飯', 'カフェ', 'おでかけ(外)', 'おでかけ(室内)', '旅行']

  const handleSearch = () => {
    if (!searchLocation.trim()) {
      alert('場所を入力してください')
      return
    }

    setSearching(true)

    // 簡易的な距離計算（場所名や住所、最寄り駅に検索語が含まれるかチェック）
    const filteredPlaces = places.filter(place => {
      const matchesLocation = 
        place.name?.toLowerCase().includes(searchLocation.toLowerCase()) ||
        place.address?.toLowerCase().includes(searchLocation.toLowerCase()) ||
        place.station?.toLowerCase().includes(searchLocation.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory
      
      return matchesLocation && matchesCategory
    })

    // ランダムにソート（AI風）
    const shuffled = [...filteredPlaces].sort(() => Math.random() - 0.5)
    
    setTimeout(() => {
      setSuggestions(shuffled.slice(0, 10)) // 最大10件
      setSearching(false)
    }, 500)
  }

  const clearSearch = () => {
    setSearchLocation('')
    setSelectedCategory('all')
    setSuggestions([])
  }

  return (
    <div style={{ padding: '16px', paddingBottom: '100px', minHeight: '100vh' }}>
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
          <Sparkles size={28} />
          AI提案
        </h1>
        <p style={{ fontSize: '14px', color: '#8B7355', marginTop: '8px', marginBottom: 0 }}>
          場所とカテゴリーを選んで、おすすめスポットを見つけよう
        </p>
      </div>

      <div style={mergeGhibliStyles(ghibliStyles.card, {
        padding: '16px',
        marginBottom: '16px'
      })}>
        <div style={{ marginBottom: '16px' }}>
          <label style={commonStyles.label}>
            場所を入力
          </label>
          <div style={{ position: 'relative' }}>
            <MapPin style={{ position: 'absolute', left: '12px', top: '12px', color: '#8B7355', pointerEvents: 'none' }} size={20} />
            <input
              type="text"
              placeholder="例: 渋谷、新宿、原宿..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              style={mergeGhibliStyles(ghibliStyles.input, {
                width: '100%',
                paddingLeft: '40px',
                boxSizing: 'border-box'
              })}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={commonStyles.label}>
            カテゴリー
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={mergeGhibliStyles(ghibliStyles.input, {
              width: '100%',
              boxSizing: 'border-box',
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

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleSearch}
            disabled={searching}
            style={mergeGhibliStyles(ghibliStyles.buttonPink, {
              flex: 1,
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: searching ? 0.6 : 1
            })}
          >
            <Search size={20} />
            {searching ? '検索中...' : '提案してもらう'}
          </button>
          {(searchLocation || suggestions.length > 0) && (
            <button
              onClick={clearSearch}
              style={mergeGhibliStyles(ghibliStyles.button, {
                padding: '12px',
                width: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              })}
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {suggestions.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={mergeGhibliStyles(ghibliStyles.card, {
            padding: '12px 16px',
            marginBottom: '12px',
            textAlign: 'center'
          })}>
            <p style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#4A3F35',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <Sparkles size={20} style={{ color: '#E8B5B5' }} />
              {suggestions.length}件の提案が見つかりました
            </p>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {suggestions.map((place) => (
              <SuggestionCard key={place.id} place={place} />
            ))}
          </div>
        </div>
      )}

      {suggestions.length === 0 && !searching && searchLocation && (
        <div style={mergeGhibliStyles(ghibliStyles.card, {
          textAlign: 'center',
          padding: '3rem 1rem'
        })}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#4A3F35', marginBottom: '0.5rem' }}>
            提案が見つかりませんでした
          </h2>
          <p style={{ color: '#8B7355', fontSize: '0.875rem' }}>
            別の場所やカテゴリーで試してみてください
          </p>
        </div>
      )}
    </div>
  )
}

// SuggestionCard Component
function SuggestionCard({ place }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      style={mergeGhibliStyles(ghibliStyles.card, {
        padding: '16px',
        cursor: 'pointer'
      })}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
        {place.photos && place.photos.length > 0 && (
          <img
            src={place.photos[0]}
            alt={place.name}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '12px',
              objectFit: 'cover',
              border: '2px solid #C9A87C',
              flexShrink: 0
            }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#4A3F35'
          }}>
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
            {place.visited && (
              <span style={mergeGhibliStyles(ghibliStyles.tag, {
                background: 'linear-gradient(to bottom, #E8B5B5 0%, #D19A9A 100%)',
                border: '1px solid #C17C74'
              })}>
                ✓ 行った
              </span>
            )}
          </div>

          {place.station && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              fontSize: '14px', 
              color: '#8B7355',
              marginBottom: '4px'
            }}>
              <MapPin size={14} />
              <span>{place.station}</span>
            </div>
          )}

          {isExpanded && place.memo && (
            <p style={{ 
              margin: '8px 0 0 0', 
              fontSize: '14px', 
              color: '#8B7355', 
              lineHeight: '1.5',
              paddingTop: '8px',
              borderTop: '2px solid #E8DCC8'
            }}>
              {place.memo}
            </p>
          )}

          {isExpanded && place.address && (
            <p style={{ 
              margin: '8px 0 0 0', 
              fontSize: '13px', 
              color: '#8B7355'
            }}>
              📍 {place.address}
            </p>
          )}
        </div>
      </div>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '8px', 
        paddingTop: '8px', 
        borderTop: '2px solid #E8DCC8',
        fontSize: '12px',
        color: '#8B7355'
      }}>
        {isExpanded ? '▲ 閉じる' : '▼ 詳細を見る'}
      </div>
    </div>
  )
}
