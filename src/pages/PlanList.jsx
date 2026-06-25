import React, { useEffect, useState } from 'react'
import { useStore } from '../stores/useStore'
import { List, Plus, Calendar, Trash2 } from 'lucide-react'

export default function PlanList() {
  const stores = useStore()
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    stores.fetchPlaces()
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fce7f3', paddingBottom: '5rem' }}>
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

        <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>プラン機能は準備中です</h2>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
            登録した場所を組み合わせて、<br />
            素敵なデートプランを作成できるようになります！
          </p>
          <div style={{ backgroundColor: '#fef3f9', padding: '1rem', borderRadius: '0.75rem', marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
              <strong>今後の機能：</strong>
            </p>
            <ul style={{ textAlign: 'left', fontSize: '0.875rem', color: '#6b7280', paddingLeft: '1.5rem' }}>
              <li>複数の場所を組み合わせてプラン作成</li>
              <li>プランに日付を設定</li>
              <li>プランの順序を並び替え</li>
              <li>プランをカレンダーに登録</li>
            </ul>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }} onClick={() => setShowAddModal(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', maxWidth: '28rem', width: '100%' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>🚧 準備中</h2>
            <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '1.5rem' }}>
              プラン作成機能は現在開発中です。<br />
              もうしばらくお待ちください！
            </p>
            <button
              onClick={() => setShowAddModal(false)}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: '#ec4899', color: 'white', borderRadius: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
