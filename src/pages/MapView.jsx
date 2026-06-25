import React, { useEffect, useState } from 'react'
import { useStore } from '../stores/useStore'
import { MapPin, Navigation } from 'lucide-react'

export default function MapView() {
  const stores = useStore()
  const [groupedByStation, setGroupedByStation] = useState({})

  useEffect(() => {
    stores.fetchPlaces()
  }, [])

  useEffect(() => {
    const grouped = {}
    stores.places.forEach(place => {
      const station = place.station || '駅未設定'
      if (!grouped[station]) {
        grouped[station] = []
      }
      grouped[station].push(place)
    })
    setGroupedByStation(grouped)
  }, [stores.places])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fce7f3', paddingBottom: '5rem' }}>
      <div style={{ backgroundColor: 'white', padding: '1rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ec4899', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <MapPin size={28} />
          駅別マップ
        </h1>
      </div>

      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '1rem' }}>
        {Object.keys(groupedByStation).length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
            <p>まだ場所が登録されていません</p>
          </div>
        )}

        {Object.keys(groupedByStation).sort().map(station => (
          <div key={station} style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', padding: '0.75rem', backgroundColor: '#ec4899', color: 'white', borderRadius: '0.75rem', fontWeight: 'bold' }}>
              <Navigation size={20} />
              <h2 style={{ fontSize: '1.125rem' }}>{station}</h2>
              <span style={{ marginLeft: 'auto', backgroundColor: 'rgba(255,255,255,0.3)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem' }}>
                {groupedByStation[station].length}件
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {groupedByStation[station].map(place => (
                <div key={place.id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem' }}>{place.name}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', backgroundColor: '#fce7f3', color: '#db2777', borderRadius: '9999px' }}>
                      {place.category}
                    </span>
                    {place.season && (
                      <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', backgroundColor: '#dbeafe', color: '#2563eb', borderRadius: '9999px' }}>
                        {place.season}
                      </span>
                    )}
                    {place.visited && (
                      <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', backgroundColor: '#d1fae5', color: '#059669', borderRadius: '9999px' }}>
                        訪問済み
                      </span>
                    )}
                  </div>
                  {place.address && (
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{place.address}</p>
                  )}
                  {place.memo && (
                    <p style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.5rem' }}>{place.memo}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
