// Google Places API を使用した場所検索機能

const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY

// Places API Text Search を使用
export const searchPlaces = async (query) => {
  if (!query || query.trim().length < 2) {
    return []
  }

  if (!GOOGLE_PLACES_API_KEY) {
    console.error('Google Places API key is not set')
    return []
  }

  try {
    const response = await fetch(
      https://maps.googleapis.com/maps/api/place/textsearch/json? +
      query=& +
      language=ja& +
      egion=jp& +
      key=
    )

    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Places API error:', data.status)
      return []
    }

    if (!data.results || data.results.length === 0) {
      return []
    }

    // 結果を整形
    const places = data.results.map(place => ({
      id: place.place_id,
      name: place.name,
      address: place.formatted_address || '',
      lat: place.geometry?.location?.lat,
      lng: place.geometry?.location?.lng,
      types: place.types || []
    }))

    // 各場所の最寄り駅を取得
    const placesWithStations = await Promise.all(
      places.map(async (place) => {
        const station = await findNearestStation(place.lat, place.lng)
        return {
          ...place,
          station
        }
      })
    )

    return placesWithStations
  } catch (error) {
    console.error('Error searching places:', error)
    return []
  }
}

// 最寄り駅を検索（Nearby Search を使用）
const findNearestStation = async (lat, lng) => {
  if (!lat || !lng || !GOOGLE_PLACES_API_KEY) {
    return ''
  }

  try {
    const response = await fetch(
      https://maps.googleapis.com/maps/api/place/nearbysearch/json? +
      location=,& +
      adius=1000& +
      	ype=train_station& +
      language=ja& +
      key=
    )

    const data = await response.json()

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      // 一番近い駅を返す
      return data.results[0].name
    }

    return ''
  } catch (error) {
    console.error('Error finding nearest station:', error)
    return ''
  }
}

// Place Details を取得（必要に応じて使用）
export const getPlaceDetails = async (placeId) => {
  if (!placeId || !GOOGLE_PLACES_API_KEY) {
    return null
  }

  try {
    const response = await fetch(
      https://maps.googleapis.com/maps/api/place/details/json? +
      place_id=& +
      ields=name,formatted_address,geometry,types& +
      language=ja& +
      key=
    )

    const data = await response.json()

    if (data.status !== 'OK') {
      console.error('Place Details API error:', data.status)
      return null
    }

    return data.result
  } catch (error) {
    console.error('Error getting place details:', error)
    return null
  }
}
