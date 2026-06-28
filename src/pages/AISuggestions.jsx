import { useState } from 'react'
import { useStore } from '../stores/useStore'
import { Sparkles, MapPin, Search, X, Plus, MessageSquare } from 'lucide-react'
import { ghibliStyles, commonStyles, mergeGhibliStyles } from '../stores/ghibliStyles'

export default function AiSuggestions() {
  const { addPlace } = useStore()
  const [searchLocation, setSearchLocation] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [additionalRequest, setAdditionalRequest] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [aiMessage, setAiMessage] = useState('')
  const [searching, setSearching] = useState(false)

  // Gemini APIを使ってAI提案を取得
  const getAiSuggestions = async () => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY
    
    if (!apiKey) {
      throw new Error('Gemini API key not found. Please add REACT_APP_GEMINI_API_KEY to your .env file')
    }

    // カテゴリーの説明
    const categoryDescription = {
      'all': 'あらゆる種類の場所',
      'ご飯': 'レストランや食事ができる場所',
      'カフェ': 'カフェや喫茶店',
      'おでかけ(外)': '公園や観光スポットなど屋外の場所',
      'おでかけ(室内)': '美術館、ショッピングモール、映画館など屋内の場所',
      '旅行': '旅行先や宿泊施設'
    }

    const prompt = `あなたはデートスポットやおでかけスポットを提案する専門家です。

【リクエスト】
- 場所: ${searchLocation}
- カテゴリー: ${selectedCategory === 'all' ? 'すべて' : selectedCategory}（${categoryDescription[selectedCategory]}）
${additionalRequest ? `- 追加リクエスト: ${additionalRequest}` : ''}

【タスク】
${searchLocation}周辺で${categoryDescription[selectedCategory]}を5〜8個提案してください。
実在する具体的な場所を提案してください。

【出力形式（必ずこのJSON形式で）】
{
  "message": "提案の説明（1〜2文で）",
  "places": [
    {
      "name": "場所名",
      "category": "${selectedCategory !== 'all' ? selectedCategory : 'カフェ'}",
      "station": "最寄り駅",
      "address": "住所",
      "reason": "おすすめ理由（1文で）",
      "tags": ["タグ1", "タグ2"]
    }
  ]
}

重要: 必ず有効なJSON形式で出力してください。余計な説明は不要です。`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error('AI API request failed')
    }

    const data = await response.json()
    const text = data.candidates[0].content.parts[0].text

    // JSONを抽出（```json ``` で囲まれている場合も対応）
    let jsonText = text
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      jsonText = jsonMatch[1]
    }

    const result = JSON.parse(jsonText)
    return result
  }

  const handleSearch = async () => {
    if (!searchLocation.trim()) {
      alert('場所を入力してください')
      return
    }

    setSearching(true)
    setSuggestions([])
    setAiMessage('')

    try {
      const result = await getAiSuggestions()
      
      setAiMessage(result.message || 'おすすめスポットを見つけました！')
      
      const formattedPlaces = result.places.map((place, index) => ({
        id: `ai-${Date.now()}-${index}`,
        name: place.name,
        category: place.category,
        station: place.station || '',
        address: place.address || '',
        memo: place.reason || '',
        tags: place.tags || [],
        photos: [],
        visited: false,
        isAiSuggestion: true
      }))

      setSuggestions(formattedPlaces)
    } catch (error) {
      console.error('AI suggestion error:', error)
      alert(`AI提案の取得に失敗しました。\nエラー: ${error.message}\n\n.envファイルにREACT_APP_GEMINI_API_KEYを設定してください。`)
    } finally {
      setSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchLocation('')
    setSelectedCategory('all')
    setAdditionalRequest('')
    setSuggestions([])
    setAiMessage('')
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
          AIがあなたにぴったりのスポットを提案します
        </p>
      </div>

      <div style={mergeGhibliStyles(ghibliStyles.card, {
        padding: '16px',
        marginBottom: '16px'
      })}>
        <div style={{ marginBottom: '16px' }}>
          <label style={commonStyles.label}>
            場所を入力 <span style={{ color: '#E8B5B5' }}>*</span>
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

        <div style={{ marginBottom: '16px' }}>
          <label style={commonStyles.label}>
            その他の希望（任意）
          </label>
          <div style={{ position: 'relative' }}>
            <MessageSquare style={{ position: 'absolute', left: '12px', top: '12px', color: '#8B7355', pointerEvents: 'none' }} size={20} />
            <input
              type="text"
              placeholder="例: 静かな場所、インスタ映え、デート向け..."
              value={additionalRequest}
              onChange={(e) => setAdditionalRequest(e.target.value)}
              style={mergeGhibliStyles(ghibliStyles.input, {
                width: '100%',
                paddingLeft: '40px',
                boxSizing: 'border-box'
              })}
            />
          </div>
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
            <Sparkles size={20} />
            {searching ? 'AI が考え中...' : 'AIに提案してもらう'}
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

      {aiMessage && (
        <div style={mergeGhibliStyles(ghibliStyles.card, {
          padding: '16px',
          marginBottom: '16px',
          background: 'linear-gradient(to bottom, #F5E6D3 0%, #E8DCC8 100%)',
          border: '3px solid #C9A87C'
        })}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
            <Sparkles size={24} style={{ color: '#C9A87C', flexShrink: 0 }} />
            <div>
              <p style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#4A3F35',
                margin: '0 0 4px 0'
              }}>
                AIからのメッセージ
              </p>
              <p style={{ fontSize: '14px', color: '#4A3F35', margin: 0, lineHeight: '1.6' }}>
                {aiMessage}
              </p>
            </div>
          </div>
        </div>
      )}

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
              AIが{suggestions.length}件の場所を提案しました
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
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#4A3F35', marginBottom: '0.5rem' }}>
            提案の生成に失敗しました
          </h2>
          <p style={{ color: '#8B7355', fontSize: '0.875rem' }}>
            もう一度試すか、条件を変更してください
          </p>
        </div>
      )}
    </div>
  )
}

// SuggestionCard Component
function SuggestionCard({ place }) {
  const { addPlace } = useStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [adding, setAdding] = useState(false)

  const handleAddToList = async (e) => {
    e.stopPropagation()
    if (adding) return

    setAdding(true)
    
    const newPlace = {
      name: place.name,
      category: place.category,
      station: place.station || '',
      address: place.address || '',
      memo: place.memo || '',
      photos: [],
      visited: false
    }

    await addPlace(newPlace)
    alert(`「${place.name}」をリストに追加しました！`)
    setAdding(false)
  }

  return (
    <div
      style={mergeGhibliStyles(ghibliStyles.card, {
        padding: '16px',
        cursor: 'pointer'
      })}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
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
            {place.tags && place.tags.map((tag, index) => (
              <span key={index} style={mergeGhibliStyles(ghibliStyles.tag, {
                background: 'linear-gradient(to bottom, #B8C5B0 0%, #9DB89A 100%)',
                border: '1px solid #8B9E88'
              })}>
                {tag}
              </span>
            ))}
            <span style={mergeGhibliStyles(ghibliStyles.tag, {
              background: 'linear-gradient(to bottom, #E8B5E8 0%, #D19AD1 100%)',
              border: '1px solid #C17CC1'
            })}>
              🤖 AI提案
            </span>
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

          {place.memo && (
            <p style={{ 
              margin: '8px 0 0 0', 
              fontSize: '14px', 
              color: '#8B7355', 
              lineHeight: '1.5',
              paddingTop: '8px',
              borderTop: '2px solid #E8DCC8'
            }}>
              💡 {place.memo}
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

          {isExpanded && (
            <button
              onClick={handleAddToList}
              disabled={adding}
              style={mergeGhibliStyles(ghibliStyles.buttonPink, {
                marginTop: '12px',
                padding: '8px 16px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                opacity: adding ? 0.6 : 1
              })}
            >
              <Plus size={16} />
              {adding ? '追加中...' : 'リストに追加'}
            </button>
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

