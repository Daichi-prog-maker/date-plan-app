// Google Places Autocomplete を使用した場所検索コンポーネント
import { useEffect, useRef, useState } from 'react'

// Google Places Autocomplete を初期化するカスタムフック
export const usePlacesAutocomplete = (onPlaceSelected) => {
  const inputRef = useRef(null)
  const autocompleteRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Google Maps API が既に読み込まれているかチェック
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsLoaded(true)
      return
    }

    // Google Maps API をロード
    const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY || process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      console.error('Google Places API key is not set')
      return
    }

    const script = document.createElement('script')
    script.src = \https://maps.googleapis.com/maps/api/js?key=\&libraries=places&language=ja&region=JP\
    script.async = true
    script.defer = true
    script.onload = () => setIsLoaded(true)
    document.head.appendChild(script)

    return () => {
      // クリーンアップ
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return

    // Autocomplete を初期化
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        componentRestrictions: { country: 'jp' },
        fields: ['name', 'formatted_address', 'geometry', 'place_id', 'types'],
        types: ['establishment', 'geocode']
      }
    )

    // 場所が選択されたときのリスナー
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace()
      
      if (!place.geometry) {
        console.log('場所の詳細が取得できませんでした')
        return
      }

      // 最寄り駅を取得
      findNearestStation(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      ).then(station => {
        onPlaceSelected({
          id: place.place_id,
          name: place.name,
          address: place.formatted_address || '',
          station: station,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        })
      })
    })
  }, [isLoaded, onPlaceSelected])

  return { inputRef, isLoaded }
}

// 最寄り駅を検索
const findNearestStation = async (lat, lng) => {
  if (!window.google || !window.google.maps) return ''

  return new Promise((resolve) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    )

    service.nearbySearch(
      {
        location: { lat, lng },
        radius: 1000,
        type: 'train_station'
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          resolve(results[0].name)
        } else {
          resolve('')
        }
      }
    )
  })
}
