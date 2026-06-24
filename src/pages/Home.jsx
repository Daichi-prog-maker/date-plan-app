import React, { useEffect, useState } from 'react'
import { useStore } from '../stores/useStore'
import { Plus, MapPin, Check, Trash2, Filter, Search } from 'lucide-react'

const CATEGORIES = ['ご飯', 'カフェ', 'おでかけ(外)', 'おでかけ(室内)', '旅行']
const SEASONS = ['春', '夏', '秋', '冬', '通年']

export default function Home() {
  const { places, fetchPlaces, deletePlace, deletePlaces, updatePlace } = useStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('すべて')
  const [selectedSeason, setSelectedSeason] = useState('すべて')
  const [searchText, setSearchText] = useState('')
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])

  useEffect(() => {
    fetchPlaces()
  }, [fetchPlaces])

  const filteredPlaces = places.filter(place => {
    const categoryMatch = selectedCategory === 'すべて' || place.category === selectedCategory
    const seasonMatch = selectedSeason === 'すべて' || place.season === selectedSeason
    const searchMatch = searchText === '' || 
      place.name.includes(searchText) || 
      (place.address && place.address.includes(searchText)) ||
      (place.station && place.station.includes(searchText))
    return categoryMatch && seasonMatch && searchMatch
  })

  const toggleVisited = async (place) => {
    await updatePlace(place.id, { 
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
    if (window.confirm(\\件の場所を削除しますか？\)) {
      await deletePlaces(selectedIds)
      setSelectedIds([])
      setSelectMode(false)
    }
  }

  return (
    <div className='min-h-screen bg-pink-50 pb-20'>
      {/* ヘッダー */}
      <div className='bg-white shadow-sm sticky top-0 z-10'>
        <div className='max-w-4xl mx-auto px-4 py-4'>
          <h1 className='text-2xl font-bold text-pink-600 text-center mb-4'>
            ○○に行きたいんじゃ！
          </h1>
          
          {/* 検索バー */}
          <div className='relative mb-3'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
            <input
              type='text'
              placeholder='場所や駅名で検索...'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400'
            />
          </div>

          {/* フィルター */}
          <div className='flex gap-2 overflow-x-auto pb-2'>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='px-3 py-1 rounded-full border border-pink-200 text-sm bg-white'
            >
              <option value='すべて'>すべて</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className='px-3 py-1 rounded-full border border-pink-200 text-sm bg-white'
            >
              <option value='すべて'>すべて</option>
              {SEASONS.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className='max-w-4xl mx-auto px-4 py-4'>
        {/* アクションボタン */}
        <div className='flex gap-2 mb-4'>
          <button
            onClick={() => setShowAddModal(true)}
            className='flex-1 bg-pink-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-pink-600'
          >
            <Plus size={20} />
            新しい場所を追加
          </button>
          <button
            onClick={() => {
              setSelectMode(!selectMode)
              setSelectedIds([])
            }}
            className={\px-4 py-3 rounded-xl font-bold \\}
          >
            {selectMode ? 'キャンセル' : '選択'}
          </button>
        </div>

        {selectMode && selectedIds.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className='w-full bg-red-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 mb-4'
          >
            <Trash2 size={20} />
            {selectedIds.length}件を削除
          </button>
        )}

        {/* 場所リスト */}
        <div className='space-y-3'>
          {filteredPlaces.map(place => (
            <div
              key={place.id}
              className={\g-white rounded-xl p-4 shadow-sm \ \\}
              onClick={() => selectMode && toggleSelect(place.id)}
            >
              <div className='flex items-start gap-3'>
                {selectMode && (
                  <input
                    type='checkbox'
                    checked={selectedIds.includes(place.id)}
                    onChange={() => toggleSelect(place.id)}
                    className='mt-1'
                  />
                )}
                <div className='flex-1'>
                  <div className='flex items-start justify-between mb-2'>
                    <div>
                      <h3 className='font-bold text-lg'>{place.name}</h3>
                      <div className='flex gap-2 mt-1'>
                        <span className='text-xs px-2 py-1 bg-pink-100 text-pink-600 rounded-full'>
                          {place.category}
                        </span>
                        {place.season && (
                          <span className='text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full'>
                            {place.season}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleVisited(place)
                      }}
                      className={\p-2 rounded-full \\}
                    >
                      <Check size={20} />
                    </button>
                  </div>
                  {place.station && (
                    <p className='text-sm text-gray-600 flex items-center gap-1'>
                      <MapPin size={14} />
                      {place.station}
                    </p>
                  )}
                  {place.address && (
                    <p className='text-xs text-gray-500 mt-1'>{place.address}</p>
                  )}
                  {place.memo && (
                    <p className='text-sm text-gray-700 mt-2'>{place.memo}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPlaces.length === 0 && (
          <div className='text-center py-12 text-gray-400'>
            <p>まだ場所が登録されていません</p>
            <p className='text-sm'>「新しい場所を追加」から登録してみましょう！</p>
          </div>
        )}
      </div>

      {/* 追加モーダル */}
      {showAddModal && (
        <AddPlaceModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  )
}

function AddPlaceModal({ onClose }) {
  const { addPlace } = useStore()
  const [formData, setFormData] = useState({
    name: '',
    category: 'ご飯',
    address: '',
    station: '',
    memo: '',
    season: '通年'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('場所の名前を入力してください')
      return
    }
    
    await addPlace(formData)
    onClose()
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto'>
        <h2 className='text-xl font-bold mb-4'>新しい場所を追加</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-bold mb-1'>場所の名前 *</label>
            <input
              type='text'
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400'
              placeholder='例: 新宿カフェ'
            />
          </div>

          <div>
            <label className='block text-sm font-bold mb-1'>カテゴリ *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400'
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-bold mb-1'>最寄り駅</label>
            <input
              type='text'
              value={formData.station}
              onChange={(e) => setFormData({...formData, station: e.target.value})}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400'
              placeholder='例: 新宿駅'
            />
          </div>

          <div>
            <label className='block text-sm font-bold mb-1'>住所</label>
            <input
              type='text'
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400'
              placeholder='例: 東京都新宿区...'
            />
          </div>

          <div>
            <label className='block text-sm font-bold mb-1'>季節</label>
            <select
              value={formData.season}
              onChange={(e) => setFormData({...formData, season: e.target.value})}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400'
            >
              {SEASONS.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-bold mb-1'>メモ</label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({...formData, memo: e.target.value})}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400'
              rows='3'
              placeholder='例: インスタで見つけた！パンケーキが美味しそう'
            />
          </div>

          <div className='flex gap-2 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-4 py-3 border border-gray-300 rounded-xl font-bold'
            >
              キャンセル
            </button>
            <button
              type='submit'
              className='flex-1 px-4 py-3 bg-pink-500 text-white rounded-xl font-bold'
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
