import React, { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { useStore } from '../stores/useStore'

export default function AISuggestions() {
  const stores = useStore()
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [error, setError] = useState('')

  const generateSuggestions = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(
        https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: '東京近郊で2人で楽しめるデートスポットを3つおすすめしてください。それぞれに場所名、カテゴリ（ご飯/カフェ/おでかけ(外)/おでかけ(室内)/旅行のいずれか）、最寄り駅、簡単な説明を含めてください。JSON形式で回答してください: {suggestions: [{name, category, station, description}]}'
              }]
            }]
          })
        }
      )

      const data = await response.json()
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const textContent = data.candidates[0].content.parts[0].text
        // Extract JSON from markdown code block if present
        const jsonMatch = textContent.match(/`json\n?([\s\S]*?)\n?`/) || textContent.match(/{[\s\S]*}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0])
          setSuggestions(parsed.suggestions || [])
        }
      }
    } catch (err) {
      setError('提案の取得に失敗しました: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const savePlace = async (suggestion) => {
    await stores.addPlace({
      name: suggestion.name,
      category: suggestion.category,
      station: suggestion.station,
      memo: suggestion.description,
      season: '通年'
    })
    alert('保存しました！')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fce7f3', paddingBottom: '5rem' }}>
      <div style={{ backgroundColor: 'white', padding: '1rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ec4899', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Sparkles size={28} />
          AI おすすめスポット
        </h1>
      </div>

      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '1rem' }}>
        <button
          onClick={generateSuggestions}
          disabled={loading}
          style={{ width: '100%', backgroundColor: loading ? '#d1d5db' : '#ec4899', color: 'white', padding: '1rem', borderRadius: '0.75rem', fontWeight: 'bold', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}
        >
          {loading ? (
            <>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              提案を生成中...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              おすすめスポットを提案
            </>
          )}
        </button>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {suggestions.map((suggestion, index) => (
            <div key={index} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem' }}>{suggestion.name}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', backgroundColor: '#fce7f3', color: '#db2777', borderRadius: '9999px' }}>
                  {suggestion.category}
                </span>
                {suggestion.station && (
                  <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', backgroundColor: '#dbeafe', color: '#2563eb', borderRadius: '9999px' }}>
                    {suggestion.station}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '1rem' }}>
                {suggestion.description}
              </p>
              <button
                onClick={() => savePlace(suggestion)}
                style={{ width: '100%', backgroundColor: '#10b981', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
              >
                この場所を保存
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      }</style>
    </div>
  )
}
